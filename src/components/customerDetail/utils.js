/*
 * @Author: sunweibin
 * @Date: 2018-10-16 11:08:03
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-18 17:05:44
 * @description 客户360详情部分辅助函数
 */
import _ from 'lodash';

// 计算概要信息中指标的去年同期比率
function calcSameTimeRate(current, last) {
  // 如果被除数为0，则显示Infinity
  if (last === 0) {
    return 'Infinity';
  }
  if (_.isNumber(current) && _.isNumber(last)) {
    return (current - last) / last;
  }
  // 显示非数字
  return 'NaN';
}

export {
  calcSameTimeRate,
};
