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

const fspGlobal = {
  // 待办流程列表中进入详情页
  openAuditPage: (args) => {
    exec('openAuditPage', args);
  },
  // 打开fsp的mot任务列表的方法
  myMotTask: (args) => {
    exec('myMotTask', args);
  },
};

export default fspGlobal;
