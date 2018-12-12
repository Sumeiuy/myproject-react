/**
* @file utils/apiCreator
* @author maoquan(maoquan@htsc.com)
*/

import requestUtils from './request';
import { apiPrefix, fspPrefix } from '../config/constants';
import { emp, url as urlHelper, encode } from '../helper';

const { request, logRequest, fspRequest } = requestUtils;

/**
 * api生成器
 *
 * @return {Fucntion}
 */
export default function createApi() {
  // 如果没有前缀，自动补上
  const padPrefix = (url) => {
    if (url.indexOf(apiPrefix) === -1) {
      return apiPrefix + url;
    }
    return url;
  };

  // 补充fsp页面请求的前缀
  const fillPrefix = (url) => {
    if (url.indexOf(fspPrefix) === -1) {
      return fspPrefix + url;
    }
    return url;
  };

  return {

    /**
     * @param {string} url API url
     * @param {Object} query 请求参数
     * @param {Number} timeout 超时时间，单位ms
     * @return {Promise}
     */
    get(url, query = {}, options) {
      const finalUrl = padPrefix(url);
      const { ignoreCatch = false, ...resetQuery } = query;
      const queryString = urlHelper.stringify(resetQuery);
      return request(
        `${finalUrl}?${queryString}&empId=${emp.getId()}`,
        {
          method: 'GET',
          ignoreCatch,
          ...options,
        },
      );
    },

    /**
     * @param {string} url API url
     * @param {Object} query 请求参数
     * @param {Number} timeout 超时时间，单位ms
     * @return {Promise}
     */
    post(url, query = {}, options = {}) {
      let finalUrl = padPrefix(url);
      let requestHeader = {
        'Content-Type': 'application/json',
      };
      const { ignoreCatch = false, ...resetQuery } = query;
      if (!options.noEmpId) {
        finalUrl = `${finalUrl}?empId=${emp.getId()}`;
        requestHeader = {
          'Content-Type': 'application/json',
          empId: emp.getId(),
        };
      }

      return request(
        finalUrl,
        {
          method: 'POST',
          headers: requestHeader,
          ignoreCatch,
          body: JSON.stringify({ ...resetQuery, empId: emp.getId() }),
          ...options,
        },
      );
    },

    /**
     * @param {string} url API url
     * @param {Object} query 请求参数
     * @param {Number} timeout 超时时间，单位ms
     * @return {Promise}
     */
    sendLog(url, query = {}, options) {
      let data = JSON.stringify(query);
      data = encode.base64(data);
      data = encodeURIComponent(data);
      return logRequest(
        url,
        {
          method: 'POST',
          body: `data_list=${data}`,
          ...options,
        },
      );
    },
    /**
     * @param {string} url API url
     * @param {Object} query 请求参数
     * @param {Number} timeout 超时时间，单位ms
     * @return {Promise}
     */
    getFspData(url, query, options) {
      const finalUrl = fillPrefix(url);
      return fspRequest(
        `${finalUrl}`,
        {
          method: 'GET',
          ...options,
        },
      );
    },
    /**
     * @param {string} url API url
     * @param {Object} query 请求参数
     * @param {Number} timeout 超时时间，单位ms
     * @return {Promise}
     */
    postFspData(url, query = {}, options = {}) {
      let fullUrl;
      let requestHeader = {
        'Content-Type': 'application/json',
      };
      const finalUrl = fillPrefix(url);
      if (options.isFullUrl || options.noEmpId) {
        fullUrl = finalUrl;
      } else {
        fullUrl = `${finalUrl}?empId=${emp.getId()}`;
        requestHeader = {
          'Content-Type': 'application/json',
          empId: emp.getId(),
        };
      }

      const { ignoreCatch = false, ...resetQuery } = query;
      return request(
        fullUrl,
        {
          method: 'POST',
          headers: requestHeader,
          ignoreCatch,
          body: JSON.stringify({ ...resetQuery, empId: emp.getId() }),
          ...options,
        },
      );
    },
  };
}
