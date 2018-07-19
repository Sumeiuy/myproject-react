/**
 * @Author: sunweibin
 * @Date: 2018-07-10 09:36:44
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-19 13:53:27
 * @description 线上销户工具函数
 */
import _ from 'lodash';

import {
  LOSTDIRECTION as lostDirectionMap,
} from './config';

const util = {
  // 将后端流失原因数据拼接成字符串
  combineLostReason(lostReason, reasonList) {
    if (_.isEmpty(lostReason) || _.isEmpty(reasonList)) {
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
          const v = _.find(reasonList, item => item.value === key) || {};
          text.push(v.label);
        }
      }
    });
    return text.join('、');
  },

  // 将后端返回的投资品种数据拼接成字符串
  combineInvestVars(investVars, investVarsList) {
    if (_.isEmpty(investVars) || _.isEmpty(investVarsList)) {
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
          const v = _.find(investVarsList, item => item.value === key) || {};
          text.push(v.label);
        }
      }
    });
    return text.join('、');
  },

  // 判断当前流失去向是否转户
  isTransferLostDirection(lostDirection) {
    // 因为后端存在与字典值不一样的地方，所以全部转化成大写来判断
    return _.toUpper(lostDirection) === _.toUpper(lostDirectionMap.transfer);
  },

  // 判断当前流失去向是否投资其他
  isInvestLostDirection(lostDirection) {
    // 因为后端存在与字典值不一样的地方，所以全部转化成大写来判断
    return _.toUpper(lostDirection) === _.toUpper(lostDirectionMap.invest);
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

  // 将选中的投资品种，按照字典值转换成obj
  convertSubmitInvestVars(vars, dict, churnInvestmentOtherDetail) {
    const submitData = _.reduce(dict, (data, item) => {
      const { value } = item;
      const hasThisValue = _.isEmpty(_.find(vars, (o) => {
        const result = _.isString(o) ? o === value : o.key === value;
        return result;
      }));
      return {
        ...data,
        [value]: !hasThisValue,
      };
    }, { churnInvestmentOtherDetail });
    return submitData;
  },

  // 将选中的流失原因，按照字典转换成对象
  convertSubmitLostReason(reasons, dict, churnOtheReason) {
    const submitData = _.reduce(dict, (data, item) => {
      const { value } = item;
      const hasThisValue = _.isEmpty(_.find(reasons, (o) => {
        const result = _.isString(o) ? o === value : o.key === value;
        return result;
      }));
      return {
        ...data,
        [value]: !hasThisValue,
      };
    }, { churnOtheReason });
    return submitData;
  },
};

export default util;
