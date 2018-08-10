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
import { indexPaneKey } from '../../../src/config/tabMenu';
import { enableSessionStorage } from '../../../src/config/constants';
import withRouter from '../../../src/decorators/withRouter';

import {
  getFinalPanes,
  getPanes,
  getPanesWithPathname,
  getStayPanes,
  preTreatment,
  storeTabInfo,
  splitPanesArray,
  getLocalPanes,
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

        // 保存tab菜单信息
        storeTabInfo({
          activeKey: finalActiveKey,
          currentMenuId,
          panes,
          href: window.location.href,
        });

        return {
          panes,
          activeKey: finalActiveKey,
          currentMenuId,
          location,
        };
      }

      const { panes, currentMenuId } = getStayPanes(pathname, query, prevState);

      // 保存tab菜单信息
      storeTabInfo({
        panes,
        href: window.location.href,
        currentMenuId,
      });

      return {
        panes,
        currentMenuId,
        location,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    // 初始化菜单的宽度为视口宽度
    this.menuWidth = document.documentElement.clientWidth;

    const { panes, activeKey, currentMenuId } = this.getInitialPanesWithPathname(props.location);

    this.state = {
      location: props.location,
      forceRender: false, // 这个标志的作用是用来在window.onResize方法中强制tab执行render方法
      panes,
      activeKey: activeKey || indexPaneKey,
      currentMenuId,
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
  onRemove(targetKey) {
    const { push, location: { pathname } } = this.props;
    const { activeKey, panes } = this.state;
    const index = _.findIndex(panes, pane => pane.id === targetKey);
    const changePanes = panes.filter(pane => pane.id !== targetKey);
    let pane;
    // 如果移除的是当前的tabKey
    if (activeKey === targetKey) {
      // 如果当前的tabKey是最后一个tab,向前跳转
      if (panes[panes.length - 1].id === targetKey) {
        pane = changePanes[changePanes.length - 1];
        // 如前向跳转到层级菜单，直接回到首页
        if (!pane.path || pane.pid === 'ROOT') {
          pane = changePanes[0];
        }
      } else { // 如果移除的当前tab不是最后一个,向后跳转
        pane = changePanes[index];
      }
    } else { // 如果移除的tabKey不是当前的tab, 仅移除对应tab，不做跳转
      pane = _.find(changePanes, item => item.id === activeKey);
    }
    // 将tab信息保存到本地
    storeTabInfo({
      panes: changePanes,
    });

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
          currentMenuId: sessionStorage.getItem('currentMenuId'),
        };
      }
    }

    // 用于本地开发测试，菜单从本地配置加载 - 2
    // const fixPanes = this.preTreatment(localeMenu);
    const fixPanes = preTreatment(this.props.primaryMenu);

    const { newPanes, newActiveKey, newCurrentMenuId } = getPanes(location, fixPanes);

    return {
      panes: newPanes,
      activeKey: newActiveKey,
      currentMenuId: newCurrentMenuId,
    };
  }

  render() {
    const { activeKey, panes, currentMenuId, location } = this.state;
    // 将panes数组划分为两个数组，一个是视口可以容纳的tab，一个是放在更多下拉菜单中的tab
    const finalpanesObj = splitPanesArray(panes, this.menuWidth);
    return (
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
    );
  }
}
