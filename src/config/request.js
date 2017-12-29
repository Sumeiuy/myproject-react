/**
 * @file config/request.js
 *  request配置文件
 * @author maoquan(maoquan@htsc.com)
 */

export default {
  timeout: 15000,
  prefix: process.env.REMOVE_PREFIX === true ? '/mcrm/api' : '/fspa/mcrm/api',
  ERROR_SEPARATOR: '$%^#%^#$^%#%$#',
};
