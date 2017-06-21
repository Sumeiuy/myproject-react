/**
* @file utils/apiCreator
* @author maoquan(maoquan@htsc.com)
*/

import request from './request';

import config from '../config/request';
import { queryToString } from './helper';

/**
 * api生成器
 *
 * @return {Fucntion}
 */
export default function createApi() {
  const { prefix } = config;

  // 如果没有前缀，自动补上
  const padPrefix = (url) => {
    if (url.indexOf(prefix) === -1) {
      return prefix + url;
    }
    return url;
  };

  // 授权信息: empId, deviceId, token
  const authInfo = {
    empId: '002332',
    deviceId: '1002',
    token: 'UAL9EZFG7ZGI4HJ6XXGG8GUMZU3Q6TYX',
  };

  return {

    /**
     * @param {string} url API url
     * @param {Object} query 请求参数
     *
     * @return {Promise}
     */
    get(url, query) {
      const finalUrl = padPrefix(url);
      const queryString = queryToString(query);
      return request(
        `${finalUrl}?${queryString}`,
        {
          method: 'GET',
        },
      );
    },

    /**
     * @param {string} url API url
     * @param {Object} query 请求参数
     *
     * @return {Promise}
     */
    post(url, query) {
      const finalUrl = padPrefix(url);
      return request(
        finalUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            empId: '002332',
            ...authInfo,
          },
          body: JSON.stringify(query),
        },
      );
    },

    /**
     * @param {string} url 神策日志接收服务器url
     * @param {Object} query 日志参数
     *
     * @return {Promise}
     */
    sendLog(url, query) {
      return request(
        url,
        {
          method: 'POST',
          body: JSON.stringify(query),
        },
      );
    },
  };
}
