/**
 * @Author: sunweibin
 * @Date: 2017-11-03 10:32:58
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-03 10:43:03
 * @description 增加一个输出日志的工具箱，做配置项来确认所有的开发日志打印是否可用
 */

const canUseConsole = true;

const tool = {
  log(...rest) {
    if (canUseConsole) {
      console.log(rest);
    }
  },
  warn(...rest) {
    if (canUseConsole) {
      console.warn(rest);
    }
  },
  error(...rest) {
    if (canUseConsole) {
      console.warn(rest);
    }
  },
};

export default tool;
