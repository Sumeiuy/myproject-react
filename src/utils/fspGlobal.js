/**
 * @file utils/fspGLobal.js
 *  封装fsp系统中window方法
 * @author wangjunjun
 */
import _ from 'lodash';
import { data } from '../helper';

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
  // 全局的data有溢出，这里不用try catch，作用域变了
  if (!_.isEmpty(data)) {
    if ('getChainPropertyFromObject' in data) {
      const activeReactTab = data.getChainPropertyFromObject(window, 'eb.component.SmartTab.activeReactTab');
      if (!_.isEmpty(activeReactTab)) {
        activeReactTab($('#UTB'), { tabId });
      }
    }
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
  // 全局的data有溢出，这里不用try catch，作用域变了
  if (!_.isEmpty(data)) {
    if ('getChainPropertyFromObject' in data) {
      const removeTab = data.getChainPropertyFromObject(window, 'eb.component.SmartTab.remove');
      if (!_.isEmpty(removeTab)) {
        removeTab($('#UTB'), { tabId });
      }
    }
  }
}

const fspGlobal = {
  // 待办流程列表中进入详情页
  openAuditPage: (args) => {
    exec('openAuditPage', args);
  },

  // 打开fsp的mot任务列表的方法
  myMotTask: (args) => {
    exec('myMotTask', args);
  },

  /**
   * 初始化暴露给fsp的方法
   * @param  {object} store app.store
   */
  initFspMethod(store) {
    window.dispatch = (action) => {
      store.dispatch(action);
    };
  },

  /**
   *  在fsp中新开一个tab
   */
  openFspTab(obj) {
    const { url, param } = obj;
    execOpenTab(
      'loadPageInTab',
      url,
      {
        closable: true,
        ...param,
      },
    );
  },

  switchFspTab(tabId) {
    execSwitchTab(tabId);
  },

  /**
   *  在fsp中新开一个iframe的tab
   */
  openFspIframeTab(obj) {
    execOpenTab('loadPageInIframeTab', obj.url, obj.param);
  },

  /**
   *  在fsp中新开一个react的tab
   */
  openRctTab(obj) {
    const { url, param } = obj;
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
  closeFspTabByHref(hrefValue) {
    closeTab(`a[href="${hrefValue}"]`);
  },

  // 关闭fsp中由react生成的tab
  // 参数 id 为对应得tab标签的id
  closeRctTabById(id) {
    closeTab(`#exApp_${id}`);
  },

  closeTabMenu(tabId) {
    removeTabMenu(tabId);
  },
};

export default fspGlobal;
