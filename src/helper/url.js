/**
 * @Author: sunweibin
 * @Date: 2017-11-22 11:14:36
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-01 21:38:55
 * @description 此处存放与url数据相关的通用方法
 */
import qs from 'query-string';
import _ from 'lodash';
import { matchPathList } from './regexp';

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
   * 将url转化为对象
   * @param {String} url
   * @returns {Object} 包含pathname,query的对象
   */
  parseUrl(inputUrl = '') {
    const match = /([^?]*)\?(.*)/.exec(inputUrl);
    const pathname = match[1];
    const query = url.parse(match[2]);
    return {
      pathname,
      query,
    };
  },
  /**
   * 检查当前页面路径是否匹配指定路径的子路由
   * @author xuxiaoqin
   * @param {String} route 当前子路由
   * @param {String} pathname 当前页面路径
   */
  matchRoute(route, pathname) {
    return RegExp(route).test(pathname);
  },
  /**
   * desc: 获取菜单匹配的pathItem列表
   * @param pathname: '/a/b/c'
   * @param matchPath: '/a'
   * @return ['/b', '/c']
   */
  backRoutePathList(pathname, matchPath = '') {
    return pathname.substring(matchPath.length).match(matchPathList) || [];
  },

  // 从url query上解析出filter对象
  transfromFilterValFromUrl(filters, seperator = {
    filterSeperator: '|', // 在location上filter对象之间使用该变量分割
    filterInsideSeperator: '#^$', // 在location上filter的name与value之间使用该变量分割
    filterValueSeperator: ',', // filter value对应多个
  }) {
    // 处理由‘|’分隔的多个过滤器
    const filtersArray = filters ? filters.split(seperator.filterSeperator) : [];

    return _.reduce(filtersArray, (result, value) => {
      const [name, code] = value.split(seperator.filterInsideSeperator);
      let filterValue = code;

      // 如果是多选，需要继续处理','分割的多选值
      if (code && code.indexOf(seperator.filterValueSeperator) > -1) {
        filterValue = code.split(seperator.filterValueSeperator);
      }

      result[name] = filterValue; // eslint-disable-line
      return result;
    }, {});
  },
};

export default url;

export const {
  parse,
  stringify,
  parseUrl,
  matchRoute,
  backRoutePathList,
  transfromFilterValFromUrl,
} = url;
