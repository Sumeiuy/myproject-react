/*
 * @Author: sunweibin
 * @Date: 2018-10-12 14:08:27
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-24 13:47:23
 * @description 资产分布使用的数字转化
 */
import _ from 'lodash';
import { number, data } from '../../helper';

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
function formaterMoney(money, options) {
  if (typeof money !== 'number') {
    return null;
  }
  return convertMoney(money, { formater: true, ...options });
}

// 格式化金额
function displayMoney(money) {
  const result = formaterMoney(money, { unit: '元' });
  return _.isEmpty(result) ? '' : `${result.formatedValue}${result.unit}`;
}

// 格式化金额不带单位
function displayMoneyWithoutUnit(money) {
  const result = formaterMoney(money);
  return _.isEmpty(result) ? '' : `${result.formatedValue}${result.unit}`;
}

// 给数据添加唯一的key
function addKeyForData(item) {
  return {
    ...item,
    key: data.uuid(),
  };
}

// 给资产分布详情表格里面的数据添加唯一的key
function updateSpecificIndexData(data) {
  return _.map(data, item => {
    const { children } = item;
    const childrenData = _.map(children, addKeyForData);
    const newItem = addKeyForData(item);
    return {
      ...newItem,
      children: childrenData,
    };
  });
}

// 生成rowNumber数量的空白数据
function generateEmptyRow(rowNumber) {
  let emptyRow = [];
  for (let i = 0; i < rowNumber; i++) {
    emptyRow.push({
      isEmptyRow: true,
      rowName: 'empty_row',
    });
  }
  return emptyRow;
}

// 普通账户、信用账户、期权账户中表格中数据默认展示两条空行，所以需要将数据进行不足两行的填满两行
function supplyEmptyRow(data) {
  const len = _.size(data);
  if (len < 2) {
    const newRows = [...data, ...generateEmptyRow(2 - len)];
    return _.map(newRows, addKeyForData);
  }
  return _.map(data, addKeyForData);
}

export {
  convertMoney,
  displayMoney,
  displayMoneyWithoutUnit,
  updateSpecificIndexData,
  supplyEmptyRow,
};
