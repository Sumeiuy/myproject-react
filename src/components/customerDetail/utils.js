/*
 * @Author: sunweibin
 * @Date: 2018-10-16 11:08:03
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 13:39:41
 * @description 客户360详情部分辅助函数
 */
import _ from 'lodash';

// 计算概要信息中指标的去年同期比率
function calcSameTimeRate(current, last) {
  if (_.isNumber(current) && _.isNumber(last) && last !== 0) {
    return (current - last) / last;
  }
  return 0;
}

// 计算百分比，乘以100后保留2位小数的字符串
function convertRate(rate) {
  if (_.isNumber(rate)) {
    const rate100 = (rate * 100).toFixed(2);
    return `${rate100}%`;
  }
  return '';
}

export {
  convertRate,
  calcSameTimeRate,
};
