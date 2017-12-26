/**
 * @Author: sunweibin
 * @Date: 2017-12-19 11:01:47
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-12-26 14:56:08
 * @description 用于神策日志统一记录的装饰器函数，用于需要记录日志的方法上
 */
import _ from 'lodash';
import { dva } from '../helper';

/**
 *
 * @param {Object} action
 * @param {String} action.type action的类型字符串
 * @param {object} action.payload action的参数对象
 * @returns {Function}
 */
function logable({ type, payload = {} }) {
  return (target, name, descriptor) => {
    const originalFn = descriptor.value;
    function logFn(...args) {
      originalFn.apply(this, args);
      if (!_.isString(type) || _.isEmpty(type)) return;
      dva.dispatch({ type, payload });
    }
    return {
      ...descriptor,
      value: logFn,
    };
  };
}

export default logable;
