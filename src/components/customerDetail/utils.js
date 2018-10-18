/*
 * @Author: sunweibin
 * @Date: 2018-10-16 11:08:03
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-18 11:24:36
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

export {
  calcSameTimeRate,
};
