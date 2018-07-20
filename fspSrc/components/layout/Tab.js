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
import menuConfig from '../../../src/config/menu';
import newOpenTabConfig, { indexPaneKey, defaultMenu } from '../../../src/config/tabMenu';
import { enableSessionStorage } from '../../../src/config/constants';
import withRouter from '../../../src/decorators/withRouter';
import { traverseMenus } from '../utils/tab';

// 获取最终的pane数组
function getFinalPanes(panes, addPanes = [], removePanes = []) {
  const filterPanes = panes.filter(pane => !_.find(removePanes, key => key === pane.id));
  const paneArray = filterPanes.filter(
    pane => !_.find(addPanes, tabPane => tabPane.id === pane.id));
  // 注意下面是有序的
  return [
    ...paneArray,
    ...addPanes,
  ];
}

// 将pane数组根据视口范围进行划分的工具方法
function splitPanesArray(panes, menuWidth) {
  // 预设置按钮的大小
  const moreButtonWidth = 50;
  const firstButtonWidth = 104;
  const menuButtonWidth = 90;
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

// 获取本地缓存的tab菜单
function getLocalPanes(pathname) {
  if (enableSessionStorage) {
    return sessionStore.get('pathname') === pathname ?
      sessionStore.get('panes') :
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
  if (enableSessionStorage) {
    tureAndstore(activeKey, sessionStore.set.bind(sessionStore, 'activeKey'));
    tureAndstore(panes, sessionStore.set.bind(sessionStore, 'panes'));
    tureAndstore(pathname, sessionStore.set.bind(sessionStore, 'pathname'));
  }
}

@withRouter
export default class Tab extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    // 初始化菜单的宽度为视口宽度
    this.menuWidth = document.documentElement.clientWidth;

    const { panes, activeKey } = this.getInitialPanesWithPathname(this.props.location);

    this.state = {
      forceRender: false, // 这个标志的作用是用来在window.onResize方法中强制tab执行render方法
      panes,
      activeKey: activeKey || indexPaneKey,
    };
  }

  componentDidMount() {
    this.elem = document.querySelector('#tabMenu');
    this.menuWidth = this.elem.getBoundingClientRect().width;
    window.addEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    const { location: { pathname, query, state } } = nextProps;
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
      (pathname !== this.props.location.pathname) || (!_.isEqual(query, this.props.location.query));

    if (isUrlChange) {
      // 不是页面内跳转，而是菜单跳转
      if (!shouldStay) {
        const paneObj = this.getPanesWithPathname(location, shouldRemove, editPane);
        let panes = paneObj.panes;
        // 这里的修正一般用不到
        if (addPanes.length || removePanes.length) {
          panes = getFinalPanes(panes, addPanes, removePanes);
        }

        const finalActiveKey = (activeKey || paneObj.activeKey);

        // 保存tab菜单信息
        storeTabInfo({
          activeKey: finalActiveKey,
          panes,
          pathname,
        });

        this.setState({
          panes,
          activeKey: finalActiveKey,
        });
      } else {
        const shouldStayPanes = this.getStayPanes(pathname, query, this.state.activeKey);

        // 保存tab菜单信息
        storeTabInfo({
          panes: shouldStayPanes,
          pathname,
        });

        this.setState({
          panes: shouldStayPanes,
        });
      }
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
    const { pathname } = location;
    // 本地缓存只是为了刷新页面时，可以保持打开页面
    // 对于手动输入地址的功能则不能完善支持
    if (enableSessionStorage) {
      const localPanes = getLocalPanes(pathname);
      if (!_.isEmpty(localPanes)) {
        return {
          panes: localPanes,
          activeKey: sessionStore.get('activeKey'),
        };
      }
    }

    const { newPanes, newActiveKey } = this.getPanes(location, menuConfig);

    return {
      panes: newPanes,
      activeKey: newActiveKey,
    };
  }

  getPanesWithPathname(location, shouldRemove, editPane = {}) {
    const { panes = [], activeKey = '' } = this.state || {};

    // 如果设置了shouldRemove, 则从当前的panes数组中移除对应的pane
    // 这种情况主要是用来处理跳转到新的tab页面，并关闭当前tab页面的情况
    const fixPanes = shouldRemove ? _.filter(panes, pane => pane.id !== activeKey) : panes;

    const { newPanes, newActiveKey } = this.getPanes(location, fixPanes, editPane);

    return {
      panes: newPanes,
      activeKey: newActiveKey,
    };
  }

  getPanes(location, fixPanes, editPane) {
    // 首先在tabConfig里面查找，该path是否能精确匹配某个新开的页面
    // 返回经过修正的panes数组
    if (this.findPaneFromTabConfig(location)) {
      return this.getPanesFromTabCongfig(location, fixPanes, editPane);
    }
    // 如果没有精确匹配到某个新开的页面，则说明一定属于主导航菜单的嵌套页面
    // 在主导航菜单中找到path对应的menu配置，进行修正，并记录下menu的嵌套路径
    return this.getPanesFromMenu(location, fixPanes);
  }


  // pathname 匹配一个新打开的pane页面
  getPanesFromTabCongfig(location, fixPanes, editPane) {
    const { pathname, query } = location;
    const currentPane = _.find(newOpenTabConfig, pane => pane.pathname === pathname);
    const newActiveKey = currentPane.id;
    let newPanes = [];

    // 修正页面的query,以及pane名称
    currentPane.query = query;
    if (editPane.name) {
      currentPane.name = editPane.name;
    }

    // 在fixPanes里面确定是否有相应的pane，如果有，替换，如果没有，加上
    if (_.find(fixPanes, pane => pane.id === newActiveKey)) {
      newPanes = _.map(fixPanes, (pane) => {
        if (pane.id === newActiveKey) {
          return currentPane;
        }
        return pane;
      });
    } else {
      newPanes = [
        ...fixPanes,
        currentPane,
      ];
    }


    return {
      newPanes,
      newActiveKey,
    };
  }


  // 在已有的panes数组中查找非精确匹配,并进行修正
  getPanesFromMenu(location, fixPanes) {
    const { pathname, query } = location;
    let isTopMenu = false;
    let newActiveKey = '';

    // 找到并修正对应的pane
    // 这里唯一不足之处在于traverseMenus不是纯函数，但是纯函数的代价太高
    const newPanes = traverseMenus(fixPanes, (pane, i, array) => {
      // 找到当前path对应的pane进行修正
      if (pane.pathname === pathname) {
        const currentPane = array[i];
        currentPane.query = query;
        if (currentPane.pid === 'ROOT') {
          isTopMenu = true;
          newActiveKey = currentPane.id;
        }
        return true;
      }
      return false;
    });

    if (!isTopMenu) {
      return this.getAndFixTopMenu(pathname, query, newPanes, newActiveKey);
    }

    return {
      newPanes,
      newActiveKey,
    };
  }

  getAndFixTopMenu(pathname, query, panes, activeKey) {
    let newActiveKey = activeKey;
    let newPanes;

    let pathForMatch = pathname;
    // 如果pathname是以fsp开头的，
    if (/^\/fsp/.test(pathname)) {
      pathForMatch = _.slice(pathname, 5); // 去掉"/fsp/"开头
    }
    const pathArray = _.split(pathForMatch, '/');

    const topMenu = _.find(defaultMenu, menu => menu.path === pathArray[0]);

    if (topMenu) {
      newPanes = _.map(panes, (pane) => {
        if (pane.name === topMenu.name) {
          const newPane = pane;
          newPane.path = pathname;
          newPane.query = query;
          newActiveKey = newPane.id;
          return newPane;
        }

        return pane;
      });
    } else { // 容错处理，新开一个其他的pane，进行高亮
      newPanes = [
        ...panes,
        {
          id: 'FSP_ERROR_OTHER',
          name: '其他',
          pid: 'OTHER',
          type: 'link',
          order: Infinity,
          path: pathname,
          query,
        },
      ];
      newActiveKey = 'FSP_ERROR_OTHER';
    }

    return {
      newPanes,
      newActiveKey,
    };
  }

  // 如果设置了shouldStay标志，表示为页面内部跳转，使用这个修正pane
  getStayPanes(pathname, query, activeKey) {
    const { panes } = this.state;
    const finalPanes = _.map(panes, (pane) => {
      const needEditPane = pane;
      // 如果提供了editPanes，使用这里的pane修正
      if (pane.id === activeKey) {
        needEditPane.path = pathname;
        needEditPane.query = query;
        return needEditPane;
      }
      return pane;
    });

    return finalPanes;
  }

  findPaneFromTabConfig({ pathname }) {
    return _.find(newOpenTabConfig, pane => pane.pathname === pathname);
  }

  render() {
    const { activeKey, panes } = this.state;
    const { push, location } = this.props;
    // 将panes数组划分为两个数组，一个是视口可以容纳的tab，一个是放在更多下拉菜单中的tab
    const finalpanesObj = splitPanesArray(panes, this.menuWidth);
    return (
      <TabMenu
        mainArray={finalpanesObj.mainArray}
        moreMenuObject={finalpanesObj.moreMenuObject}
        onChange={this.onChange}
        activeKey={activeKey}
        onRemove={this.onRemove}
        push={push}
        path={location.pathname}
      />
    );
  }
}
