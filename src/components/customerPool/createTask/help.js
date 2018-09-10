/*
 * @Description: 为新版客户列表发起任务在新建任务提示框中默认的展示信息提供的方法
 * @Author: WangJunjun
 * @Date: 2018-07-06 15:59:29
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-09-07 13:55:20
 */

import _ from 'lodash';
import m from 'moment';
import { isSightingScope } from '../helper';
import {
  basicInfoList, commonFilterList, singleWithSearchFilterList,
  serviceCustomerState, dateRangeFilterList, buyAmtFilterList, capitalFilterList,
} from '../config';

const FORMAT = 'YYYY年M月D日';

// 根据url中primaryKeyLabels参数和全量的标签信息，生成当前url的primaryKeyLabels中id集合所对应的标签信息
function getLabel(filterObj, labelInfos) {
  let aimLabelList = [];
  let normalLabelList = [];
  if (filterObj.primaryKeyLabels) {
    const labelList = _.compact([].concat(filterObj.primaryKeyLabels));
    // 瞄准镜标签
    aimLabelList = _.filter(
      labelInfos,
      item => _.includes(labelList, item.id) && isSightingScope(item.source),
    );
    // 普通标签
    normalLabelList = _.filter(
      labelInfos,
      item => _.includes(labelList, item.id) && !isSightingScope(item.source),
    );
  }
  return { aimLabelList, normalLabelList };
}

// 生成一个格式为 瞄准镜标签#id# 的集合
function getNameAndIdList(list) {
  return _.map(list, item => `瞄准镜标签#${item.id}#`);
}

// 按照现有代码需要的格式生成suggestion数据
function getFormattedData(data) {
  return _.map([].concat(data), item => ({ name: item, type: item }));
}

/**
 * // 获取标签的信息
 * @param {*} filterObj url中解析出来的filter字段
 * @param {*} labelInfos 字典中全量标签字段
 */
function getLabelInfo(filterObj, labelInfos) {
  let labelHtmlStrList = [];
  let labelSuggestionList = [];
  // 标签: aimLabelList瞄准镜， normalLabelList普通标签
  const { aimLabelList = [], normalLabelList = [] } = getLabel(filterObj, labelInfos);
  const nameAndIdList = getNameAndIdList(aimLabelList);
  if (!_.isEmpty(nameAndIdList)) {
    labelSuggestionList = getFormattedData(nameAndIdList);
    const list = _.map(nameAndIdList, item => `瞄准镜标签： $${item} `);
    labelHtmlStrList = [...labelHtmlStrList, ...list];
  }
  if (!_.isEmpty(normalLabelList)) {
    const list = _.map(normalLabelList, item => `标签条件： ${item.name} `);
    labelHtmlStrList = [...labelHtmlStrList, ...list];
  }

  return {
    labelHtmlStrList,
    labelSuggestionList,
  };
}

/**
 * 持仓产品的信息
 * @param {*} filterObj url中解析出来的filter字段
 */
function getHoldingProductInfo(filterObj) {
  let holdingProductHtmlStr = '';
  let holdingProductSuggestionList = [];
  const holdingProduct = filterObj.primaryKeyPrdts;
  if (!_.isEmpty(holdingProduct)) {
    const list = [`持仓数量#${holdingProduct[0]}#`, `持仓市值#${holdingProduct[0]}#`];
    holdingProductSuggestionList = getFormattedData(list);
    holdingProductHtmlStr += `持仓产品 ${holdingProduct[1]}, 数量为 $${list[0]} ，市值为 $${list[1]} `;
  }
  return {
    holdingProductHtmlStr,
    holdingProductSuggestionList,
  };
}

/**
 * 获取普通筛选过滤器的信息
 * @param {*} filterField url中解析出来的filter字段中当前要获取信息的字段
 * @param {*} dicField 当前要获取字段在字典中对应的字段
 * @param {*} labelName 要显示在页面中的名称
 * @param {*} filterObj url中解析出来的filter字段
 * @param {*} dict 字典
 */
function getCommonFilterInfo({ filterField, dictField, labelName }, filterObj, dict) {
  let htmlStr = '';
  const tempFilterField = filterObj[filterField];
  let tempDictField = dict[dictField];
  // 持仓行业需要给字典字段上加一个key字段
  if (filterField === 'primaryKeyIndustry') {
    tempDictField = _.map(tempDictField, item => ({
      ...item,
      key: item.induCode,
      value: item.induName,
    }));
  }
  if (!_.isEmpty(tempFilterField)) {
    const list = _.filter(
      tempDictField,
      item => _.includes(_.compact([].concat(tempFilterField)), item.key),
    );
    const displayValue = _.map(list, item => item.value).join('、');
    htmlStr += `${labelName}： ${displayValue}`;
  }
  return htmlStr;
}

/**
 * 开通业务的信息
 * @param {*} filterObj url中解析出来的filter字段
 * @param {*} kPIDateScopeType 字典中时间周期字段
 * @param {*} singleBusinessTypeList 字典中首页开通业务中的字段信息
 */
function getBusinessOpenedInfo(filterObj, kPIDateScopeType, singleBusinessTypeList) {
  let htmlStr = '';
  const businessOpened = filterObj.businessOpened;
  if (!_.isEmpty(businessOpened)) {
    const { value: time } = _.find(kPIDateScopeType, item => item.key === businessOpened[0]);
    const { value: business } =
      _.find(singleBusinessTypeList, item => item.key === businessOpened[1]);
    htmlStr += `${time}开通业务： ${business}`;
  }
  return htmlStr;
}

/**
 * 获取关键词的信息
 * @param {*} filterField url中解析出来的filter字段中的属性名称
 * @param {*} labelName  要显示的名称
 * @param {*} filterObj url中解析出来的filter字段
 */
function getKeywordInfo({ filterField, labelName }, filterObj) {
  let htmlStr = '';
  if (!_.isEmpty(filterObj[filterField])) {
    htmlStr += `${labelName}：${filterObj[filterField]}`;
  }
  return htmlStr;
}

/**
 * 获取带搜索的筛选过滤器的信息
 * @param {*} filterField url中解析出来的filter字段中当前要获取信息的字段
 * @param {*} labelName 要显示在页面中的名称
 * @param {*} filterObj url中解析出来的filter字段
 */
function getSingleWithSearchFilterInfo({ filterField, labelName }, filterObj) {
  let htmlStr = '';
  const tempFilterField = filterObj[filterField];
  if (!_.isEmpty(tempFilterField)) {
    htmlStr += `${labelName}： ${tempFilterField[1]}`;
  }
  return htmlStr;
}

/**
 * 获取年龄范围筛选过滤器的信息
 * @param {*} ageRange url中解析出来的filter字段中当前要获取信息的字段
 */
function getAgeFilterInfo(ageRange) {
  if (!_.isEmpty(ageRange)) {
    if (ageRange[0] && ageRange[1]) {
      return `年龄范围： ${ageRange[0]}岁 - ${ageRange[1]}岁`;
    }
    if (ageRange[0]) {
      return `年龄范围： 大于等于${ageRange[0]}岁`;
    }
    if (ageRange[1]) {
      return `年龄范围： 小于等于${ageRange[1]}岁`;
    }
  }
  return '';
}

/**
 * 获取最后一次服务的信息
 * @param {*} lastServDt url中解析出来的filter字段中当前要获取信息的字段
 * @param {*} serviceCustomerState 服务状态map code => name
 */
function getLatestServiceInfo(lastServDt, serviceCustState) {
  if (lastServDt) {
    return `最近一次服务时间：${m(lastServDt[0]).format(FORMAT)}后${serviceCustState[lastServDt[1]]}`;
  }
  return '';
}

/**
 * 获取日期范围过滤器的信息
 * @param {*} filterField url中解析出来的filter字段中当前要获取信息的字段
 * @param {*} labelName 要显示在页面中的名称
 * @param {*} filterObj url中解析出来的filter字段
 */
function getDateRangInfo({ filterField, labelName }, filterObj) {
  const dateRange = filterObj[filterField];
  if (!_.isEmpty(dateRange)) {
    if (dateRange[0] && dateRange[1]) {
      return `${labelName}： ${dateRange[0]} - ${dateRange[1]}`;
    }
    if (dateRange[0]) {
      return `${labelName}： ${dateRange[0]}之后`;
    }
    if (dateRange[1]) {
      return `${labelName}： ${dateRange[1]}之前`;
    }
  }
  return '';
}

/**
 * 获取佣金率信息
 * @param {*} minFee url中解析出来的filter字段中当前要获取信息的字段
 */
function getMinfeeInfo(minFee) {
  if (!_.isEmpty(minFee)) {
    if (minFee[0] && minFee[1]) {
      return `佣金率： ${minFee[0]}‰ - ${minFee[1]}‰`;
    }
    if (minFee[0]) {
      return `佣金率： 大于等于${minFee[0]}‰`;
    }
    if (minFee[1]) {
      return `佣金率： 小于等于${minFee[1]}‰`;
    }
  }
  return '';
}

/**
 * 获取购买金额范围的信息
 * @param {*} filterField url中解析出来的filter字段中当前要获取信息的字段
 * @param {*} labelName 要显示在页面中的名称
 * @param {*} filterObj url中解析出来的filter字段
 * @param {*} kPIDateScopeType 字典中时间周期字段
 */
function getBuyAmtInfo({ filterField, labelName }, filterObj, kPIDateScopeType) {
  const currentItem = filterObj[filterField];
  if (!_.isEmpty(currentItem)) {
    const [dateScope = '', start = '', end = ''] = currentItem;
    const { value: time } = _.find(kPIDateScopeType, item => item.key === dateScope);
    if (start && end) {
      return `${time}${labelName}： ${start}元 - ${end}元`;
    }
    if (start) {
      return `${time}${labelName}： 大于等于${start}元`;
    }
    if (end) {
      return `${time}${labelName}： 小于等于${end}元`;
    }
  }
  return '';
}

/**
 * 获取日期范围过滤器的信息
 * @param {*} filterField url中解析出来的filter字段中当前要获取信息的字段
 * @param {*} labelName 要显示在页面中的名称
 * @param {*} filterObj url中解析出来的filter字段
 */
function getCapitalRangInfo({ filterField, labelName }, filterObj) {
  const range = filterObj[filterField];
  if (!_.isEmpty(range)) {
    if (range[0] && range[1]) {
      return `${labelName}： ${range[0]}元 - ${range[1]}元`;
    }
    if (range[0]) {
      return `${labelName}： 大于等于${range[0]}元`;
    }
    if (range[1]) {
      return `${labelName}： 小于等于${range[1]}元`;
    }
  }
  return '';
}

/**
 * 获取自定义标签
 * @param {*} customLabels url中解析出来的filter字段中当前要获取信息的字段
 * @param {*} definedLabelsInfo 自定义标签全量的数据
 */
function getCustomLabel(customLabels, definedLabelsInfo) {
  if (_.isEmpty(customLabels)) {
    return '';
  }
  const selectedLabelList = _.filter(
    definedLabelsInfo,
    item => _.includes([].concat(customLabels), item.id),
  );
  const selectedNameList = _.map(selectedLabelList, labelItem => labelItem.labelName);
  return `自定义标签: ${selectedNameList.join(',')}`;
}

// 新版客户表发起任务，在新建任务的任务提示的显示的信息
function getFilterInfo({ filterObj, dict, industryList, definedLabelsInfo }) {
  const {
    labelInfos, kPIDateScopeType,
    singleBusinessTypeList,
  } = dict;
  let htmlStr = '';
  let suggestionList = [];
  // url中filter没有值时，只显示’可开通业务‘
  if (!_.isEmpty(filterObj)) {
    const {
      labelHtmlStrList,
      labelSuggestionList,
    } = getLabelInfo(filterObj, labelInfos);
    const {
      holdingProductHtmlStr,
      holdingProductSuggestionList,
    } = getHoldingProductInfo(filterObj);
    const businessOpenedHtmlStr =
      getBusinessOpenedInfo(filterObj, kPIDateScopeType, singleBusinessTypeList);
    const ageHtmlStr = getAgeFilterInfo(filterObj.age);
    const lastServiceHtmlStr = getLatestServiceInfo(filterObj.lastServDt, serviceCustomerState);
    const minFeeHtmlStr = getMinfeeInfo(filterObj.minFee);
    // 自定义标签
    const customLabel = getCustomLabel(filterObj.customLabels, definedLabelsInfo);
    let list = [
      holdingProductHtmlStr, businessOpenedHtmlStr,
      ageHtmlStr, lastServiceHtmlStr, minFeeHtmlStr,
      customLabel,
    ];
    list = [...list, ...labelHtmlStrList];
    _.each(commonFilterList, (item) => {
      list.push(getCommonFilterInfo(item, filterObj, { ...dict, industryList }));
    });
    _.each(basicInfoList, (item) => {
      list.push(getKeywordInfo(item, filterObj));
    });
    _.each(singleWithSearchFilterList, (item) => {
      list.push(getSingleWithSearchFilterInfo(item, filterObj));
    });
    _.each(dateRangeFilterList, (item) => {
      list.push(getDateRangInfo(item, filterObj));
    });
    _.each(buyAmtFilterList, (item) => {
      list.push(getBuyAmtInfo(item, filterObj, kPIDateScopeType));
    });
    _.each(capitalFilterList, (item) => {
      list.push(getCapitalRangInfo(item, filterObj));
    });
    suggestionList = [...labelSuggestionList, ...holdingProductSuggestionList];
    const tempList = _.compact(list);
    if (!_.isEmpty(tempList)) {
      htmlStr += '<div><div>该客户通过淘客筛选，满足以下条件：</div>';
      _.each(tempList, (item, index) => {
        htmlStr += `<div>${index + 1}.${item}</div>`;
      });
      htmlStr += '</div>';
    }
  }
  return {
    htmlStr,
    suggestionList,
  };
}

const exported = {
  getFilterInfo,
};

export default exported;
export { getFilterInfo };
