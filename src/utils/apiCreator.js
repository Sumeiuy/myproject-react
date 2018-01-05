/**
* @file utils/apiCreator
* @author maoquan(maoquan@htsc.com)
*/

import { request, logRequest, fspRequest } from './request';

import config from '../config/request';
import { emp, url as urlHelper, encode } from '../helper';

/**
 * api生成器
 *
 * @return {Fucntion}
 */
export default function createApi() {
  const { apiPrefix, fspPrefix } = config;
  // 如果没有前缀，自动补上
  const padPrefix = (url) => {
    if (url.indexOf(apiPrefix) === -1) {
      return apiPrefix + url;
    }
    return url;
  };

  const fillPrefix = (url) => {
    if (url.indexOf(fspPrefix) === -1) {
      return fspPrefix + url;
    }
    return url;
  };
  // 授权信息: empId, deviceId, token
  // const authInfo = {
  //   empId: '002332',
  //   deviceId: '1002',
  //   token: 'LKOP1SLGT3PPB9ZAV47YAF2WPEJUKZG4',
  // };

  return {

    /**
     * @param {string} url API url
     * @param {Object} query 请求参数
     *
     * @return {Promise}
     */
    get(url, query = {}) {
      const finalUrl = padPrefix(url);
      const { ignoreCatch = false, ...resetQuery } = query;
      const queryString = urlHelper.stringify(resetQuery);
      return request(
        `${finalUrl}?${queryString}&empId=${emp.getId()}`,
        {
          method: 'GET',
          ignoreCatch,
        },
      );
    },

    /**
     * @param {string} url API url
     * @param {Object} query 请求参数
     *
     * @return {Promise}
     */
    post(url, query = {}) {
      const finalUrl = padPrefix(url);
      const { ignoreCatch = false, ...resetQuery } = query;
      return request(
        finalUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            empId: emp.getId(),
          },
          ignoreCatch,
          body: JSON.stringify({ ...resetQuery, empId: emp.getId() }),
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
      return logRequest(
        url,
        {
          method: 'POST',
          body: `data_list=${encodeURIComponent(encode.base64(JSON.stringify(query)))}`,
        },
      );
    },
     /**
     * @param {string} url fsp 数据请求url
     * @param {Object} query 可能的一些参数
     *
     * @return {Promise}
     */
    getFspData(url) {
      const finalUrl = fillPrefix(url);
      return fspRequest(
        `${finalUrl}`,
        {
          method: 'GET',
        },
      );
    },
  };
}
