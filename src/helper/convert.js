/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:06:59
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-09 13:52:38
 * @description 根据Code值转换成相应的数据
 */
import _ from 'lodash';

import status from './config/status';

const convert = {
  /**
   * 根据状态的 Code 返回对应的 type, text 对象
   * @param code {String} 状态值Code
   * @returns {Object} 返回type、text属性的对象
   */
  getStatusByCode(code) {
    return _.find(status, item => item.code === code);
  },
};

export default convert;

export const {
 getStatusByCode,
} = convert;
