/**
 * @Author: sunweibin
 * @Date: 2018-07-10 09:36:44
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-12 18:11:22
 * @description 线上销户工具函数
 */
import _ from 'lodash';

import {
  LOSTREASON as lostReasonText,
  INVESTVARS as investVarsText,
  LOSTDIRECTION as lostDirectionMap,
} from './config';

const util = {
  // 将后端流失原因数据拼接成字符串
  combineLostReason(lostReason) {
    if (_.isEmpty(lostReason)) {
      return '';
    }
    // 如果lostReason中的key对应的值是'Y'或者true则显示相应的Text
    const text = [];
    _.each(lostReason, (value, key) => {
      // 如果是其他需要显示其他的详情
      if (key !== 'churnOtheReason' && (value === 'Y' || value === true)) {
        if (key === 'churnOther') {
          text.push(lostReason.churnOtheReason);
        } else {
          text.push(lostReasonText[key]);
        }
      }
    });
    return text.join('、');
  },

  // 将后端返回的投资品种数据拼接成字符串
  combineInvestVars(investVars) {
    if (_.isEmpty(investVars)) {
      return '';
    }
    // 如果investVars中的key对应的值是'Y'或者true则显示相应的Text
    const text = [];
    _.each(investVars, (value, key) => {
      // 如果是其他需要显示其他的详情
      if (key !== 'churnInvestOtherDetail' && (value === 'Y' || value === true)) {
        if (key === 'churnInvestmentOther') {
          text.push(investVars.churnInvestOtherDetail);
        } else {
          text.push(investVarsText[key]);
        }
      }
    });
    return text.join('、');
  },

  // 判断当前流失去向是否转户
  isTransferLostDirection(lostDirection) {
    return lostDirection === lostDirectionMap.transfer;
  },

  // 判断当前流失去向是否投资其他
  isInvestLostDirection(lostDirection) {
    return lostDirection === lostDirectionMap.invest;
  },

  // 驳回后修改页面获取选择的投资品种/流失原因的 key 值数组
  getSelectedKeys(obj = {}) {
    const isEmpty = _.isEmpty(obj);
    if (isEmpty) {
      return [];
    }
    const keys = [];
    _.each(obj, (value, key) => {
      if (
        key !== 'churnInvestOtherDetail'
        && key !== 'churnOtheReason'
        && (value === 'Y' || value === true)
      ) {
        keys.push(key);
      }
    });
    return keys;
  },

  // 判断是否选择了其他投资品种，其他流失原因
  isSelectedOtherOption(obj = {}, key) {
    const isEmpty = _.isEmpty(obj);
    if (isEmpty) {
      return false;
    }
    return obj[key] === 'Y' || obj[key] === true;
  },
};

export default util;
