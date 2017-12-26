/**
 * @file utils/fspGLobal.js
 *  封装fsp系统中window方法
 * @author wangjunjun
 */
import { getProperty } from './helper';
import { env } from '../helper';

function exec(method, ...args) {
  try {
    window[method].apply(null, args);
  } catch (e) {
    console.log(e);
  }
}

function execOpenTab(method, ...args) {
  try {
    window.eb.app[method].run.apply(null, args);
  } catch (e) {
    console.log(e);
  }
}

function execSwitchTab(tabId) {
  try {
    const activeReactTab = getProperty(window, 'eb.component.SmartTab.activeReactTab');
    activeReactTab($('#UTB'), { tabId });
  } catch (e) {
    console.log(e);
  }
}

function closeTab(arg) {
  try {
    window.$(`${arg} .close`).click();
  } catch (e) {
    console.log(e);
  }
}

function removeTabMenu(tabId) {
  try {
    const removeTab = getProperty(window, 'eb.component.SmartTab.remove');
    removeTab($('#UTB'), { tabId });
  } catch (e) {
    console.log(e);
  }
}

const fspGlobal = {
  /* // 待办流程列表中进入详情页
  openAuditPage: (args) => {
    exec('openAuditPage', args);
  }, */

  // 打开fsp的mot任务列表的方法
  myMotTask: (args) => {
    exec('myMotTask', args);
  },
  /**
   *  在fsp中新开一个tab
   */
  openFspTab({ url, param }) {
    execOpenTab(
      'loadPageInTab',
      url,
      {
        closable: true,
        ...param,
      },
    );
  },

  switchFspTab({ tabId }) {
    execSwitchTab(tabId);
  },

  /**
   *  在fsp中新开一个iframe的tab
   */
  /* openFspIframeTab(obj) {
    execOpenTab('loadPageInIframeTab', obj.url, obj.param);
  }, */

  /**
   *  在fsp中新开一个react的tab
   */
  openRctTab({ url, param }) {
    execOpenTab(
      'loadPageInTabnavTo',
      url,
      {
        closable: true,
        isSpecialTab: true,
        ...param,
      },
    );
  },

  // 关闭fsp中原有的tab
  // 参数 hrefValue 为对应标签页关闭按钮的父级元素href的属性值
/*   closeFspTabByHref(hrefValue) {
    closeTab(`a[href="${hrefValue}"]`);
  }, */

  // 关闭fsp中由react生成的tab
  // 参数 id 为对应得tab标签的id
  closeRctTabById({ id }) {
    closeTab(`#exApp_${id}`);
  },

  closeTabMenu({ tabId }) {
    removeTabMenu(tabId);
  },

  navtoOtherAndClose({ id, url, param }) {
    fspGlobal.openRctTab({ url, param });
    fspGlobal.closeRctTabById({ id });
  },
};

/**
 * 负责处理所有与tab相关的主函数
 * 同时兼容fsp与react框架
 * @param {any} options 配置对象
 * @param {any} routerAction react用来操作location的方法，如push，replace等,fsp不需要传递该参数
 */
function dispatchTabPane(options) {
  // 如果是Fsp则执行Fsp对应的tab操作
  if (env.isInFsp()) {
    const {
      fspAction,
    } = options;
    // do fspAction
    fspGlobal[fspAction](options);
  } else { // 如果是react则执行react操作
    const {
      routerAction, // {function} react框架必须传入该参数，通常是push方法，或者replace方法,fsp框架不需要传入该参数
      url, // {string} 需要打开的path,如果有查询字字符串直接写在后面
      pathname, // pathname
      query, // query对象
      addPanes = [],   // 可选参数, 要打开的tabpane的key标识与显示名称以及关联路径，支持同时打开多个
      removePanes = [], // 可选参数， 数组元素为key值，string类型，需要移除的tabpane，支持同时移除多个
      activeKey = '', // 可选参数，string类型，表示当前活动的tabPane，值需要与key值相对应
      data, // 可选参数，其他可附加的数据
    } = options;
    if (!routerAction) {
      return;
    }
    if (pathname) {
      routerAction({
        pathname,
        query,
        state: {
          addPanes,
          removePanes,
          activeKey,
          ...data,
        },
      });
    } else {
      routerAction(
        url,
        {
          addPanes,
          removePanes,
          activeKey,
          ...data,
        },
      );
    }
  }
}

export default dispatchTabPane;

