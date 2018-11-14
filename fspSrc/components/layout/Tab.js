/**
 * @file components/layout/Tab.js
 *  切换切换用tab,具体展示的页面使用路由控制
 * @author zhufeiyang
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { sessionStore } from '../../../src/config';
import TabMenu from './TabMenu';
import Breadcrumb from './Breadcrumb';
import { indexPaneKey } from '../../../src/config/tabMenu';
import { enableSessionStorage } from '../../../src/config/constants';
import withRouter from '../../../src/decorators/withRouter';
import styles from './tab.less';
import {
  getFinalPanes,
  getPanes,
  getPanesWithPathname,
  getStayPanes,
  preTreatment,
  storeTabInfo,
  splitPanesArray,
  getLocalPanes,
  getNewRouterHistory,
 } from '../utils/tab';

@withRouter
export default class Tab extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    primaryMenu: PropTypes.array.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { location } = nextProps;
    const {
      pathname,
      query,
      state,
    } = location;

    const {
      activeKey,
      addPanes = [],
      removePanes = [],
      shouldRemove,
      shouldStay,
      editPane,
    } = state || {};

    const { routerHistory } = prevState;

    // 路由是否发生变化
    const isUrlChange =
      (pathname !== prevState.location.pathname) || (!_.isEqual(query, prevState.location.query));

    if (isUrlChange) {
      // 不是页面内跳转，而是菜单跳转
      if (!shouldStay) {
        const paneObj = getPanesWithPathname(location, shouldRemove, editPane, prevState);
        let panes = paneObj.panes;
        // 这里的修正一般用不到
        if (addPanes.length || removePanes.length) {
          panes = getFinalPanes(panes, addPanes, removePanes);
        }

        const finalActiveKey = (activeKey || paneObj.activeKey);
        const currentMenuId = paneObj.currentMenuId;
        const breadcrumbRoutes = paneObj.breadcrumbRoutes;
        // 更新路由历史记录
        const newRouterHistory =
          getNewRouterHistory({ pathname, query, routerHistory });
        // 保存tab菜单信息
        storeTabInfo({
          activeKey: finalActiveKey,
          currentMenuId,
          panes,
          href: window.location.href,
          breadcrumbRoutes,
          routerHistory: newRouterHistory,
        });

        return {
          panes, //最终渲染的菜单信息
          activeKey: finalActiveKey, // 最终高亮的顶级菜单
          currentMenuId, // 最终高亮的叶节点菜单
          location, // 当前的路由信息
          breadcrumbRoutes, //当前路由对应的面包屑
          routerHistory: newRouterHistory, // 历史记录
        };
      }

      const { panes, currentMenuId } = getStayPanes(pathname, query, prevState);

      const newRouterHistory =
        getNewRouterHistory({ pathname, query, routerHistory });
      // 保存tab菜单信息
      storeTabInfo({
        panes,
        href: window.location.href,
        currentMenuId,
        routerHistory: newRouterHistory,
      });

      return {
        panes,
        currentMenuId,
        location,
        routerHistory: newRouterHistory,
        breadcrumbRoutes: [], // 对于linkTo页面暂时去除面包屑
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    // 初始化菜单的宽度为视口宽度
    this.menuWidth = document.documentElement.clientWidth;

    const {
      panes,
      activeKey,
      currentMenuId,
      breadcrumbRoutes,
    } = this.getInitialPanesWithPathname(props.location);

    const { pathname, query } = props.location;

    this.state = {
      location: props.location,
      forceRender: false, // 这个标志的作用是用来在window.onResize方法中强制tab执行render方法
      panes,
      activeKey: activeKey || indexPaneKey,
      currentMenuId,
      breadcrumbRoutes,
      routerHistory: [
        {
          pathname,
          query,
        }
      ],
    };

    // 抛出关闭tab的方法给jsp页面使用
    window.eb.utils.closeTab = (key) => {
      window.shouldNotBlock = true;
      this.onRemove(key, true);
    };
  }

  componentDidMount() {
    this.elem = document.querySelector('#tabMenu');
    this.menuWidth = this.elem.getBoundingClientRect().width;
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  @autobind
  onResize() {
    const { forceRender } = this.state;
    const menuWidth = this.elem && this.elem.getBoundingClientRect().width;
    if (menuWidth !== this.menuWidth) {
      this.menuWidth = menuWidth;
      this.setState({
        forceRender: !forceRender,
      });
    }
  }

  @autobind
  onChange(activeKey) {
    const { push } = this.props;
    const { panes } = this.state;
    const pane = _.find(panes, item => item.id === activeKey);
    // 调用push时同时传递pathname，query
    push({
      pathname: pane.path,
      query: pane.query,
    });
  }

  @autobind
  onRemove(targetKey, shouldBackToPrevPage) {
    const { push, location: { pathname } } = this.props;
    const { activeKey, panes } = this.state;
    const index = _.findIndex(panes, pane => pane.id === targetKey);
    if (activeKey === targetKey) { // 如果移除的是当前的tabKey
      return shouldBackToPrevPage ?
        this.navToOtherTabForFsp(panes, pathname, push)
        : this.navToOtherTab(panes, targetKey, index, push);
    }
    const changePanes = _.filter(panes, item => item.id !== targetKey);
    const pane = _.find(panes, item => item.id === activeKey);
    this.setState(
      { panes: changePanes },
      () => {
        if (pane.path !== pathname) {
          push({
            pathname: pane.path,
            query: pane.query,
          });
        }
      },
    );

    return null;
  }

  getInitialPanesWithPathname(location) {
    // 本地缓存只是为了刷新页面时，可以保持打开页面
    // 对于手动输入地址的功能则不能完善支持
    if (enableSessionStorage) {
      const localPanes = getLocalPanes(window.location.href);
      if (!_.isEmpty(localPanes)) {
        return {
          panes: localPanes,
          activeKey: sessionStore.get('activeKey'),
          currentMenuId: sessionStore.get('currentMenuId'),
          breadcrumbRoutes: sessionStore.get('breadcrumbRoutes'),
        };
      }
    }

    // 用于本地开发测试，菜单从本地配置加载 - 2
    // const fixPanes = this.preTreatment(localeMenu);
    const fixPanes = preTreatment(this.props.primaryMenu);

    const {
      newPanes,
      newActiveKey,
      newCurrentMenuId,
      newBreadcrumbRoutes,
    } = getPanes(location, fixPanes);

    return {
      panes: newPanes,
      activeKey: newActiveKey,
      currentMenuId: newCurrentMenuId,
      breadcrumbRoutes: newBreadcrumbRoutes,
    };
  }

  navToOtherTab(panes, targetKey, index, push) {
    let pane;
    // 如果当前的tabKey是最后一个tab,向前跳转
    if (panes[panes.length - 1].id === targetKey) {
      pane = panes[panes.length - 2];
      // 如前向跳转到层级菜单，直接回到首页
      if (!pane.path || pane.pid === 'ROOT') {
        pane = panes[0];
      }
    } else { // 如果移除的当前tab不是最后一个,向后跳转
      pane = panes[index + 1];
    }
    push({
      pathname: pane.path,
      query: pane.query,
      state: {
        shouldRemove: true,
      },
    });
  }

  navToOtherTabForFsp(panes, pathname, push) {
    // 如果设置了shouldBackToPrevPage
    // pane = _.find(panes, item => item.id === removePane.pid);
    // 现在暂时先返回首页
    const pane = panes[0];
    if (pane.path !== pathname) {
      push({
        pathname: pane.path,
        query: pane.query,
        state: {
          shouldRemove: true,
        },
      });
    }
  }

  render() {
    const {
      activeKey,
      panes,
      currentMenuId,
      location,
      breadcrumbRoutes,
      routerHistory,
    } = this.state;
    // 将panes数组划分为两个数组，一个是视口可以容纳的tab，一个是放在更多下拉菜单中的tab
    const finalpanesObj = splitPanesArray(panes, this.menuWidth);
    return (
      <div>
        <div className={styles.tabMenuContainer}>
          <TabMenu
            mainArray={finalpanesObj.mainArray}
            moreMenuObject={finalpanesObj.moreMenuObject}
            onChange={this.onChange}
            activeKey={activeKey}
            currentMenuId={currentMenuId}
            onRemove={this.onRemove}
            push={this.props.push}
            path={location.pathname}
          />
        </div>
        <div className={styles.breadcrumbContainer}>
          <Breadcrumb
            breadcrumbRoutes={breadcrumbRoutes}
            routerHistory={routerHistory}
            location={location}
            push={this.props.push}
          />
        </div>
      </div>
    );
  }
}
