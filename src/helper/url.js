/**
 * @Author: sunweibin
 * @Date: 2017-11-22 11:14:36
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-22 14:59:01
 * @description 此处存放与url数据相关的通用方法
 */
import qs from 'query-string';
import pathToRegexp from 'path-to-regexp';

const routerPrefix = '/customerPool';

const url = {
  /**
   * 将url上的参数字符串，转化成JS对象
   * @author sunweibin
   * @param {String} search url上的参数字符串
   * @returns {Objcet}
   */
  parse(search) {
    return qs.parse(search) || {};
  },
  /**
   * 将JS对象转化成url上的参数字符串
   * @author sunweibin
   * @param {Object} query={} 需要转换成字符串的对象
   * @returns {String} 无?号的url参数字符串
   */
  stringify(query = {}) {
    return qs.stringify(query);
  },
  /**
   * 检查当前页面路径是否匹配指定子路由
   * @author xuxiaoqin
   * @param {*} route 当前子路由
   * @param {*} pathname 当前页面路径
   * @returns {String} 全路径
   */
  matchRoute(route, pathname) {
    return pathToRegexp(`${routerPrefix}/${route}`).exec(pathname);
  },
};

export default url;
