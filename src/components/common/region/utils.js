/**
 * @Author: sunweibin
 * @Date: 2018-05-14 15:12:37
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-14 15:16:28
 * @description 区间组件的通用函数
 */

const utils = {
  /**
   * 获取区间值得显示文本
   * @param {String} start 区间开始值
   * @param {String} end 区间结束值
   */
  getRegionText(start = '', end = '') {
    if (start === '' && end === '') {
      // 两个都是空，则显示一个不限
      return '不限';
    } if (start === '' && end !== '') {
      // 开始为空，结束不为空
      return `不限-${end}`;
    } if (start !== '' && end === '') {
      // 开始不为空，结束为空
      return `${start}-不限`;
    }
    return `${start}-${end}`;
  },
};

export default utils;

export const {
  getRegionText,
} = utils;
