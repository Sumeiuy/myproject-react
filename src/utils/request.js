/**
 * @file utils/request
 * @author maoquan(maoquan@htsc.com)
 */

import 'whatwg-fetch';
import _ from 'lodash';

import { request as config, excludeCode, constants } from '../config';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 * @param  {object} options 针对请求在后期需要做的特殊处理
 * options含有属性
 * ignoreCatch boolen， 默认为false，表示需要经过全局Catch，true表示忽略全局捕获
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response, options) {
  const {
    ignoreCatch = false,
    isFullUrl,
  } = options;

  return response.json().then(
    (res) => {
      if (isFullUrl) {
        const { data } = res;
        return data;
      }
      // messageType代表错误类型，默认是0，如果后端不传，默认也是0，前端用message提示
      // 如果是1，则用自定义的dialog弹出错误信息
      const { code, msg, succeed, messageType = 0 } = res;
      const existExclude = _.findIndex(excludeCode, o => o.code === code) > -1;
      const isThrowError = !existExclude && !succeed && !ignoreCatch;
      if (isThrowError) {
        // 抛出以分隔符为分隔的错误字符串信息
        throw new Error([msg, messageType, code].join(config.ERROR_SEPARATOR));
      }
      return res;
    }
  ).catch(
    (e) => {
      const isFSPRequest = /^\/fsp\//.test(options.currentUrl);
      if (!isFSPRequest) {
        // 抛出以分隔符为分隔的错误字符串信息
        throw e;
      }
      // 静默处理，返回一个空的resultData
      const res = {
        resultData: {},
      };
      return res;
    }
  );
}

function parseText(response) {
  return response.text();
}
/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  console.log(error);
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
const request = (url, options) => {
  const timeoutMessage = constants.inHTSCDomain ? '' : ` - ${url}`;
  return Promise.race([
    fetch(url, { credentials: 'include', ...options })
      .then(checkStatus)
      .then(response => parseJSON(response, { ...options, currentUrl: url})),
    new Promise(
      (rosolve, reject) => {// eslint-disable-line
        setTimeout(
          () => reject(`请求超时${timeoutMessage}`),
          options.timeout || config.timeout,
        );
      },
    ),
  ]);
};

const myHeaders = new Headers({
  'Content-Type': 'text/html',
});

const fspRequest = (url, options) => (
  Promise.race([
    fetch(url, { credentials: 'include', ...options, myHeaders })
      .then((res) => {
        if(res.status === 302) {
          if(/\/fsp\/login/.test(res.headers.location)) {
            window.href = res.headers.location;
          }
        }
        return res;
      })
      .then(parseText),
    new Promise(
      (rosolve, reject) => {// eslint-disable-line
        setTimeout(
          () => reject('请求超时'),
          options.timeout || config.timeout,
        );
      },
    ),
  ])
);

/**
 * 发送日志专用, 不考虑超时报错
 */
const logRequest = (url, options) => (
  fetch(url, { credentials: 'include', ...options })
    .then(checkStatus)
);

const exported = {
  request,
  fspRequest,
  logRequest,
};

export default exported;
