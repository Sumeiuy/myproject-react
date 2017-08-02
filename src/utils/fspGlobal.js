/**
 * @file utils/fspGLobal.js
 *  封装fsp系统中window方法
 * @author wangjunjun
 */


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
    execOpenTab('loadPageInTab', obj.url, obj.param);
  },
  /**
   *  在fsp中新开一个react的tab
   */
  openRctTab(obj) {
    execOpenTab('loadPageInTabnavTo', obj.url, obj.param);
  },
};

export default fspGlobal;
