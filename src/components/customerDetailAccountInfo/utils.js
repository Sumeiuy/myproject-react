/*
 * @Author: sunweibin
 * @Date: 2018-10-12 14:08:27
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-15 12:31:42
 * @description 资产分布使用的数字转化
 */
import _ from 'lodash';
import { number } from '../../helper';

 // 格式化金额，返回金额数字以及单位，并且金额数字整数部分千分位分割
function convertMoney(money = 0, { unit = '', formater = false, toFixed = 2}) {
  let formatedMoney = money;
  let newMoneyValue = money;
  let newUnit = unit;
  if (Math.abs(money) >= number.yi) {
    // 如果数字超过一亿，则以亿为单位
    newMoneyValue = money / number.yi;
    newUnit = `亿${unit}`;
  } else if (Math.abs(money) >= number.wan) {
    // 如果数字超过一万，则以万为单位
    newMoneyValue = money / number.wan;
    newUnit = `万${unit}`;
  }
  newMoneyValue = Number(newMoneyValue.toFixed(toFixed));
  if (formater) {
    formatedMoney = newMoneyValue.toLocaleString();
  }
  return {
    formatedValue: formatedMoney,
    value: newMoneyValue,
    unit: newUnit,
  };
}

// 用于转化负债详情的金额数据,
function convertDebtMoney(money) {
  if (typeof money !== 'number') {
    return null;
  }
  return convertMoney(money, { unit: '元',  formater: true});
}

// 将转化后的负债详情的金额数据拼接成字符串
function displayDebtMony(money) {
  const result = convertDebtMoney(money);
  return _.isEmpty(result) ? '' : `${result.value}${result.unit}`;
}

export {
  convertMoney,
  convertDebtMoney,
  displayDebtMony,
};
