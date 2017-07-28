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
  openAuditPage: (args) => {
    exec('openAuditPage', args);
  },
};

export default fspGlobal;
