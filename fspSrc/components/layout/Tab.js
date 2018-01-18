/**
 * @file components/layout/Tab.js
 *  切换切换用tab,具体展示的页面使用路由控制
 * @author zhufeiyang
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import store from 'store';
import FSPUnwrap from './FSPUnwrap';
import TabMenu from './TabMenu';
import menuConfig from '../../../src/config/menu';
import tabConfig, { indexPaneKey } from '../../../src/config/tabMenu';
import { enableLocalStorage } from '../../../src/config/constants';
import withRouter from '../../../src/decorators/withRouter';

// 判断pane是否在paneArray中
function isPaneInArray(panes, paneArray) {
  return panes.length !== 0 ?
    _.some(paneArray, pane => pane.id === panes[0].id) : false;
}

// 获取最终的pane数组
function getFinalPanes(panes, addPanes = [], removePanes = []) {
  const filterPanes = panes.filter(pane => !_.find(removePanes, key => key === pane.id));
  const paneArray = addPanes.filter(pane => !_.find(panes, tabPane => tabPane.id === pane.id));
  return [
    ...filterPanes,
    ...paneArray,
  ];
}

// 将pane数组根据视口范围进行划分的工具方法
function splitPanesArray(panes, menuWidth) {
  // 预设置按钮的大小
  const moreButtonWidth = 90;
  const firstButtonWidth = 121;
  const menuButtonWidth = 96;
  // tab菜单除了必有的首页之外，所有其他的tab都是96px，可以由此算出视口宽度内可以放下多少个
  const tabCount = Math.floor((menuWidth - moreButtonWidth - firstButtonWidth) / menuButtonWidth);
  return {
    mainArray: panes.slice(0, tabCount + 1),
    moreMenuObject: {
      id: 'MORE',
      name: '更多',
      children: panes.slice(tabCount + 1),
    },
  };
}

// 获取本地保存的tab菜单
function getLocalPanes(pathname) {
  if (enableLocalStorage) {
    return store.get('pathname') === pathname ?
      store.get('panes') :
      [];
  }
  return [];
}

// storeTabInfo 内部逻辑抽象的方法,条件满足执行callback
function tureAndstore(item, callback) {
  if (item) {
    callback(item);
  }
}

// 用来本地缓存tab信息的方法函数
function storeTabInfo({ activeKey, panes, pathname }) {
  if (enableLocalStorage) {
    tureAndstore(activeKey, store.set.bind(store, 'activeKey'));
    tureAndstore(panes, store.set.bind(store, 'panes'));
    tureAndstore(pathname, store.set.bind(store, 'pathname'));
  }
}

@withRouter
export default class Tab extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    isBlockRemovePane: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    // 初始化菜单的宽度为视口宽度
    this.menuWidth = document.documentElement.clientWidth;
    // 刷新操作会使用保存的当前tab
    let reloadKey;
    const { location: { pathname, query } } = props;
    // 根据当前路由找到对应的tabpane
    const config = this.getConfig(pathname);

    // 这里获取到的location对应的pane配置只可能是0或者1个
    // 这也是后面在判断本地是否有location对应的pane时，直接取panes[0]的原因
    let panes = this.getPanesWithPathname(pathname, query);

    // 如果开启了本地缓存，则支持刷新后保持打开的tab菜单状态
    const localPanes = getLocalPanes(pathname);
    const isDefaultpane = isPaneInArray(panes, menuConfig);

    // 如果是刷新操作，获取相应的reloadKey
    if (localPanes.length !== 0) {
      reloadKey = store.get('activeKey');
    }

    // 如果是刷新操作
    if (reloadKey) {
      panes = [
        ...localPanes,
      ];
    } else if (!isDefaultpane) { // 如果不是刷新操作，而且不是默认的tab
      panes = [
        ...menuConfig,
        ...panes,
      ];
    } else if (isDefaultpane) { // 如果是默认的tab
      panes = menuConfig;
    }

    this.state = {
      forceRender: false, // 这个标志的作用是用来在window.onResize方法中强制tab执行render方法
      panes,
      activeKey: reloadKey || (config && config.id) || indexPaneKey,
    };
  }

  componentDidMount() {
    this.elem = document.querySelector('#tabMenu');
    this.menuWidth = this.elem.getBoundingClientRect().width;
    window.addEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    const { location: { pathname, query, state } } = nextProps;
    const { activeKey, addPanes, removePanes, shouldRemove, shouldStay } = state || {};
    let panes = [];
    let config = {};
    if (!shouldStay) {
      if (pathname !== this.props.location.pathname) {
        config = this.getConfig(pathname);
        panes = this.getPanesWithPathname(pathname, query, shouldRemove);
        if (addPanes || removePanes) {
          panes = getFinalPanes(panes, addPanes, removePanes);
        }
        // 保存tab菜单信息
        storeTabInfo({
          activeKey: (activeKey || config.id),
          panes,
          pathname,
        });

        this.setState({
          panes,
          activeKey: activeKey || config.id,
        });
      }
    } else if (enableLocalStorage) {
      // 保存tab菜单信息
      storeTabInfo({
        pathname,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  @autobind
  onResize() {
    const { panes, activeKey, forceRender } = this.state;
    const menuWidth = this.elem && this.elem.getBoundingClientRect().width;
    if (menuWidth !== this.menuWidth) {
      this.menuWidth = menuWidth;
      this.setState({
        forceRender: !forceRender,
        panes,
        activeKey,
      });
    }
  }

  @autobind
  onChange(activeKey) {
    const { push } = this.props;
    const { panes } = this.state;
    const pane = panes.find(item => item.id === activeKey);
    // 调用push时同时传递pathname，query
    push({
      pathname: pane.path,
      query: pane.query,
    });
  }

  @autobind
  onRemove(targetKey) {
    const { push, isBlockRemovePane, location: { pathname } } = this.props;
    const { activeKey, panes } = this.state;
    const index = _.findIndex(panes, pane => pane.id === targetKey);
    const changePanes = panes.filter(pane => pane.id !== targetKey);
    let pane;
    // 如果移除的是当前的tabKey
    if (activeKey === targetKey) {
      // 如果当前的tabKey是最后一个tab,向前跳转
      if (panes[panes.length - 1].id === targetKey) {
        pane = changePanes[changePanes.length - 1];
        // 如前向跳转无path，回到首页
        if (!pane.path) {
          pane = changePanes[0];
        }
      } else { // 如果移除的当前tab不是最后一个,向后跳转
        pane = changePanes[index];
      }
    } else { // 如果移除的tabKey不是当前的tab, 仅移除对应tab，不做跳转
      pane = changePanes.find(item => item.id === activeKey);
    }
    // 将tab信息保存到本地
    storeTabInfo({
      panes: changePanes,
    });
    if (isBlockRemovePane) {
      const shouldJumpPane = window.confirm(`请确定你要跳转到 ${pane.path}，未保存的数据会丢失!`); // eslint-disable-line
      if (shouldJumpPane) {
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
    } else {
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
  }

  // 从配置文件中获取pathname对应的tabPane对象
  getConfig(pathname) {
    // 获取pathname的匹配数组
    const matchArray = _.map(tabConfig, (pane) => {
      const match = RegExp(pane.path).exec(pathname);
      return !match ? 0 : match[0].length;
    });
    // 最佳匹配下标
    const index = _.indexOf(matchArray, _.max(matchArray));

    // 如果没找到匹配的tab菜单，会默认首页菜单展示
    return tabConfig[index];
  }

  // 根据pathname获取一个初步的pane数组
  getPanesWithPathname(pathname, query, shouldRemove = false) {
    let { panes = [] } = this.state || {};
    const { activeKey = '' } = this.state || {};
    if (shouldRemove) {
      panes = panes.filter(pane => pane.id !== activeKey);
    }
    const paneConf = this.getConfig(pathname);
    if (!_.isEmpty(paneConf)) {
      const isExists = panes.find(item => item.id === paneConf.id);
      paneConf.query = query;
      if (!isExists) {
        panes.push(paneConf);
      } else {
        panes.map((pane) => {
          if (pane.id === paneConf.id) {
            return paneConf;
          }
          return pane;
        });
      }
    }
    return panes;
  }

  render() {
    const { activeKey, panes } = this.state;
    const { push, location } = this.props;
    // 将panes数组划分为两个数组，一个是视口可以容纳的tab，一个是放在更多下拉菜单中的tab
    const finalpanesObj = splitPanesArray(panes, this.menuWidth);
    return (
      <div>
        <TabMenu
          mainArray={finalpanesObj.mainArray}
          moreMenuObject={finalpanesObj.moreMenuObject}
          onChange={this.onChange}
          activeKey={activeKey}
          onRemove={this.onRemove}
          push={push}
          path={location.pathname}
        />
        <FSPUnwrap path={location.pathname} {...this.props} />
      </div>
    );
  }
}
