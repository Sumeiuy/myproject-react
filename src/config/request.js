/**
 * @file config/request.js
 *  request配置文件
 * @author maoquan(maoquan@htsc.com)
 */
import { apiPrefix, fspPrefix } from './constants';

export default {
  timeout: 15000,
  // 这里的接口处理是为了调试的方便，一般情况下该标志都是false
  apiPrefix: '/mcrm/api',
  fspPrefix,
  prefix: '/mcrm/api',
  ERROR_SEPARATOR: '$%^#%^#$^%#%$#',
};
