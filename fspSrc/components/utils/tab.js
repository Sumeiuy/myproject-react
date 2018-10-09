/**
 * @file components/utils/tab.js
 *  tab 组件中的通用方法
 * @author yuanhaojie
 */

import _ from 'lodash';
import { emp } from '../../../src/helper';
import { newOpenTabConfig, defaultMenu } from '../../../src/config/tabMenu';
import { enableSessionStorage } from '../../../src/config/constants';
import { sessionStore } from '../../../src/config';
import commonConfig from '../layout/config';

function traverseMenus(menus, callback, level = 1) {
  const newMenus = [
    ...menus,
  ];
  _.forEach(newMenus, (menu, i, array) => {
    if (callback(menu, i, array, level)) {
      return false;
    }
    return menu.children && !_.isEmpty(menu.children) ?
      traverseMenus(menu.children, callback, level + 1) : true;
  });

  return newMenus;
}

function getCurrentMenuPath(pathname, level) {
  const pathArray = pathname && pathname.split('/');
  if (pathArray) {
    if (pathArray[1] === 'fsp') {
      return '/' + pathArray.slice(2, level + 2).join('/');
    } else {
      return pathArray.slice(0, level + 1).join('/');
    }
  }
}

// 修正外部跳转连接
function fixExternUrl(url) {
  const empId = emp.getId();
  const orgId = emp.getOrgId();
  return url
    .replace('=#[userCode]', `=${empId}`)
    .replace('=#[orgCode]', `=${orgId}`);
}

// 用于本地开发测试，菜单从本地配置加载 - 1
// import localeMenu from '../../../src/config/menu';

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
  const firstButtonWidth = 106;
  const menuButtonWidth = 104;
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
function getLocalPanes(href) {
  if (enableSessionStorage) {
    return sessionStore.get('href') === href ?
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
function storeTabInfo({ activeKey, panes, href, currentMenuId, routerHistory }) {
  if (enableSessionStorage) {
    tureAndstore(activeKey, sessionStore.set.bind(sessionStore, 'activeKey'));
    tureAndstore(panes, sessionStore.set.bind(sessionStore, 'panes'));
    tureAndstore(href, sessionStore.set.bind(sessionStore, 'href'));
    tureAndstore(currentMenuId, sessionStore.set.bind(sessionStore, 'currentMenuId'));
    tureAndstore(routerHistory, sessionStore.set.bind(sessionStore, 'routerHistory'));
  }
}

function findPaneFromTabConfig({ pathname }) {
  return _.find(newOpenTabConfig, pane => pane.path === pathname);
}

// pathname 匹配一个新打开的pane页面
function getPanesFromTabCongfig(location, fixPanes, editPane) {
  const { pathname, query } = location;
  const currentPane = _.find(newOpenTabConfig, pane => pane.path === pathname);
  const newActiveKey = currentPane.id;
  let newPanes = [];

  // 修正页面的query,以及pane名称
  currentPane.query = query;
  if (editPane && editPane.name) {
    currentPane.name = editPane.name;
  }

  const newCurrentMenuId = newActiveKey;

  // 在fixPanes里面确定是否有相应的pane，如果有，替换，如果没有，加上
  if (_.find(fixPanes, pane => pane.id === newActiveKey)) {
    newPanes = _.map(fixPanes, (pane) => {
      if (pane.id === newActiveKey) {
        return {
          ...currentPane,
        };
      }
      return pane;
    });
  } else {
    newPanes = [
      ...fixPanes,
      {
        ...currentPane,
      },
    ];
  }


  return {
    newPanes,
    newActiveKey,
    newCurrentMenuId,
  };
}

function getAndFixTopMenu(
  location,
  panes,
  activeKey,
  currentMenuId,
  topMenu,
) {
  const { pathname, query } = location;
  let newActiveKey = activeKey;
  let newCurrentMenuId = currentMenuId;
  let newPanes = panes;

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
    // 如果已经有其他这个pane存在，不再新建其他pane
    if (!_.find(panes, pane => pane.id === 'FSP_ERROR_OTHER')) {
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
    }
    newActiveKey = 'FSP_ERROR_OTHER';
    newCurrentMenuId = 'FSP_ERROR_OTHER';
  }

  return {
    newPanes,
    newActiveKey,
    newCurrentMenuId,
  };
}

function findTopMenu(location) {
  const { pathname } = location;

  const pathArray = _.split(pathname, '/');
  let pathForMatch = pathArray[1];

  // 如果pathname是以fsp开头的，
  if (commonConfig.pathPrefix.test(pathname)) {
    pathForMatch = pathArray[2]; // 去掉"/fsp/"开头
  }

  return _.find(defaultMenu, menu => menu.path.indexOf(pathForMatch) > -1);
}

function getPanesFromMenu(location, fixPanes, currentMenuId, routerHistory) {
  const { pathname, query } = location;
  let isTopMenu = false;
  let isFoundCurrentPane = false;
  let newActiveKey = '';
  let newCurrentMenuId = currentMenuId;

  if (pathname === '/') {
    return {
      newPanes: fixPanes,
      newActiveKey: fixPanes[0].id,
      newCurrentMenuId: fixPanes[0].id,
    };
  }

  // 找到并修正对应的pane
  // 这里唯一不足之处在于traverseMenus不是纯函数，但是纯函数的代价太高
  const newPanes = traverseMenus(fixPanes, (pane, i, array, level) => {
    const menuPath = getCurrentMenuPath(pane.path, level);
    const locationPath = getCurrentMenuPath(pathname, level);
    // 找到当前path对应的pane进行修正
    if (menuPath === locationPath) {
      if (pane.path === '/customerPool' && pathname !== '/customerPool') {
        return false;
      }
      const currentPane = array[i];
      if (level === 1) {
        currentPane.path = pathname;
        currentPane.query = query;
        if (currentPane.pid === 'ROOT') {
          isTopMenu = true;
          newActiveKey = currentPane.id;
          if (currentPane.name === '首页') {
            isFoundCurrentPane = true;
            newCurrentMenuId = currentPane.id;
            return true;
          }
          return false;
        }
        // 新打开的页面被命中
        if (!pane.type) {
          isTopMenu = true;
          newActiveKey = currentPane.id;
          isFoundCurrentPane = true;
          newCurrentMenuId = currentPane.id;
          return true;
        }
      }

      // 中间嵌套的菜单不需要修正
      if (currentPane.children && !_.isEmpty(currentPane.children)) {
        return false;
      }

      // 找到叶节点link，修正
      currentPane.path = pathname;
      currentPane.query = query;
      isFoundCurrentPane = true;
      newCurrentMenuId = currentPane.id;
      return true;
    }
    return false;
  });

  // 如果没有任何匹配，容错处理
  if (!isFoundCurrentPane) {
    let errorPanes = newPanes;
    // 容错处理，新开一个其他的pane，进行高亮
    // 如果已经有其他这个pane存在，不再新建其他pane
    if (!_.find(newPanes, pane => pane.id === 'FSP_ERROR_OTHER')) {
      errorPanes = [
        ...newPanes,
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
    }
    newActiveKey = 'FSP_ERROR_OTHER';
    newCurrentMenuId = 'FSP_ERROR_OTHER';

    return {
      newPanes: errorPanes,
      newActiveKey,
      newCurrentMenuId,
    };
  }

  // 如果没有命中顶级菜单，继续修正
  if (!isTopMenu) {
    const topMenu = findTopMenu(location);
    return getAndFixTopMenu(
      location,
      newPanes,
      newActiveKey,
      newCurrentMenuId,
      topMenu,
    );
  }

  return {
    newPanes,
    newActiveKey,
    newCurrentMenuId,
  };
}


function getPanes(location, fixPanes, editPane, currentMenuId, routerHistory) {
  // 首先在tabConfig里面查找，该path是否能精确匹配某个新开的页面
  // 返回经过修正的panes数组
  if (findPaneFromTabConfig(location)) {
    return getPanesFromTabCongfig(location, fixPanes, editPane);
  }
  // 如果没有精确匹配到某个新开的页面，则说明一定属于主导航菜单的某个页面
  // 在主导航菜单中找到path对应的menu配置，进行修正，并记录下menu的嵌套路径
  return getPanesFromMenu(location, fixPanes, currentMenuId, routerHistory);
}

// 预处理menu数据，将path字段格式化一下
function preTreatment(primaryMenu) {
  const fixMenu = _.filter(primaryMenu, menu => menu.path || !_.isEmpty(menu.children));
  return traverseMenus(fixMenu, (pane, i, array) => {
    // 找到当前path对应的pane进行修正
    if (pane.name === '客户管理') {
      const currentPane = array[i];
      currentPane.path = currentPane.path.split('?')[0];
      currentPane.query = {
        source: 'leftMenu',
      };
      return true;
    }
    return false;
  });
}

// 如果设置了shouldStay标志，表示为页面内部跳转，使用这个修正pane
function getStayPanes(pathname, query, prevState) {
  const { panes, activeKey, currentMenuId } = prevState;
  const newPanes = [...panes];
  traverseMenus(newPanes, (pane, i, array) => {
    // 找到当前path对应的pane进行修正
    if (pane.id === activeKey || pane.id === currentMenuId) {
      const currentPane = array[i];
      currentPane.path = pathname;
      currentPane.query = query;
      if (currentPane.pid === 'ROOT') {
        return false;
      }
      return true;
    }
    return false;
  });
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

  return {
    panes: finalPanes,
    currentMenuId,
  };
}

function getPanesWithPathname(location, shouldRemove, editPane = {}, prevState) {
  const { panes = [], activeKey = '', currentMenuId, routerHistory } = prevState || {};

  // 如果设置了shouldRemove, 则从当前的panes数组中移除对应的pane
  // 这种情况主要是用来处理跳转到新的tab页面，并关闭当前tab页面的情况
  const fixPanes = shouldRemove ? _.filter(panes, pane => pane.id !== activeKey) : [...panes];

  const { newPanes, newActiveKey, newCurrentMenuId } =
    getPanes(location, fixPanes, editPane, currentMenuId, routerHistory);

  return {
    panes: newPanes,
    activeKey: newActiveKey,
    currentMenuId: newCurrentMenuId,
  };
}

function getNewRouterHistory({ finalActiveKey, currentMenuId, pathname, routerHistory = [] }) {
  let newRouterHistory = [];
  if (_.find(routerHistory, router => router.pathname === pathname)) {
    newRouterHistory = _.filter(routerHistory, router => router.pathname !== pathname);
    newRouterHistory = [
      {
        activeKey: finalActiveKey,
        currentMenuId,
        pathname,
      },
      ...newRouterHistory,
    ];
  }
  if (routerHistory.length > 10) {
    newRouterHistory = routerHistory.splice(0, routerHistory.length - 1);
    newRouterHistory = [
      {
        activeKey: finalActiveKey,
        currentMenuId,
        pathname,
      },
      ...newRouterHistory,
    ];
  } else {
    newRouterHistory = [
      {
        activeKey: finalActiveKey,
        currentMenuId,
        pathname,
      },
      ...routerHistory,
    ];
  }

  return newRouterHistory;
}

export {
  traverseMenus,
  fixExternUrl,
  getFinalPanes,
  getPanesWithPathname,
  getStayPanes,
  preTreatment,
  storeTabInfo,
  splitPanesArray,
  getLocalPanes,
  getPanes,
  getNewRouterHistory,
};
