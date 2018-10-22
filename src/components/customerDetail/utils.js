/*
 * @Author: sunweibin
 * @Date: 2018-10-16 11:08:03
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-19 10:26:05
 * @description 客户360详情部分辅助函数
 */
import _ from 'lodash';
import constant from '../../config/specialConstants';
import { displayMoney } from '../customerDetailAccountInfo/utils';
import { number } from '../../helper';

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

// 在交易数据中针对需要计算增长率的三个指标值，当去年的值为0的时候需要展示的数据
function getRateTipWhenLastEqual0(current) {
  let rateText = '';
  // 因为去年同期值为0，所以当前值 >= 0时候显示增长
  const isAsc = current > 0;
  if (current > 0) {
    rateText = constant.BIG_RATE_MSG;
  } else if (current < 0) {
    rateText = constant.SMALL_RATE_MSG;
  } else {
    rateText = constant.ZERO_RATE_MSG;
  }
  return {
    isAsc,
    tip: `去年同期0元，同比${rateText}`,
    rateText,
  };
}

// 在交易数据中，当去年同期值不为0时，需要展示的数据
function getRateTip(last, current) {
  // 针对超大数据进行特殊处理
  const rate = calcSameTimeRate(current, last);
  const lastText = displayMoney(last);
  let rateText = '';
  const isAsc = rate >= 0;
  const actionText = isAsc ? constant.ASC_MSG : constant.DESC_MSG;
  if (rate > 10) {
    rateText = constant.BIG_RATE_MSG;
  } else if (rate < -10) {
    rateText = constant.DESC_MSG;
  } else {
    rateText = number.convertRate(rate);
  }

  return {
    isAsc,
    tip: `去年同期${lastText}，同比${actionText}${rateText}`,
    rateText,
  };
}

export {
  calcSameTimeRate,
  getRateTip,
  getRateTipWhenLastEqual0,
};
