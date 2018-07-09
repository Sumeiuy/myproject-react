/*
 * @Description: 为新版客户列表发起任务在新建任务提示框中默认的展示信息提供的方法
 * @Author: WangJunjun
 * @Date: 2018-07-06 15:59:29
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-07-09 09:27:59
 */

import _ from 'lodash';
import m from 'moment';
import { isSightingScope } from '../helper';
import {
  basicInfoList, commonFilterList, singleWithSearchFilterList,
  serviceCustomerState, dateRangeFilterList, buyAmtFilterList, capitalFilterList,
} from './config';

const FORMAT = 'YYYY年M月D日';

// 根据url中primaryKeyLabels参数和全量的标签信息，生成当前url的primaryKeyLabels中id集合所对应的标签信息
function getLabel(filterObj, labelInfos) {
  if (filterObj.primaryKeyLabels) {
    const labelList = _.compact([].concat(filterObj.primaryKeyLabels));
    // 瞄准镜标签
    const aimLabelList = _.filter(
      labelInfos,
      item => _.includes(labelList, item.id) && isSightingScope(item.source),
    );
    // 普通标签
    const normalLabelList = _.filter(
      labelInfos,
      item => _.includes(labelList, item.id) && !isSightingScope(item.source),
    );
    return { aimLabelList, normalLabelList };
  }
  return {};
}

// 生成一个格式为 名称#id# 的集合
function getNameAndIdList(list) {
  return _.map(list, item => `${item.name}#${item.id}#`);
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
  let htmlStr = '';
  let suggestionList = [];
  // 标签: aimLabelList瞄准镜， normalLabelList普通标签
  const { aimLabelList = [], normalLabelList = [] } = getLabel(filterObj, labelInfos);
  const nameAndIdList = getNameAndIdList(aimLabelList);
  if (!_.isEmpty(nameAndIdList)) {
    suggestionList = getFormattedData(nameAndIdList);
    _.each(nameAndIdList, (item) => {
      htmlStr += `<div>瞄准镜标签： $${item} </div>`;
    });
  }
  if (!_.isEmpty(normalLabelList)) {
    _.each(normalLabelList, (item) => {
      htmlStr += `<div>标签条件： ${item.name} </div>`;
    });
  }

  return {
    htmlStr,
    suggestionList,
  };
}

/**
 * 持仓产品的信息
 * @param {*} filterObj url中解析出来的filter字段
 */
function getHoldingProductInfo(filterObj) {
  let htmlStr = '';
  let suggestionList = [];
  const holdingProduct = filterObj.primaryKeyPrdts;
  if (!_.isEmpty(holdingProduct)) {
    const list = [`持仓数量#${holdingProduct[0]}#`, `持仓市值#${holdingProduct[0]}#`];
    suggestionList = getFormattedData(list);
    htmlStr += `<div>持仓产品 ${holdingProduct[1]}, 数量为 $${list[0]} ，市值为 $${list[1]} </div>`;
  }
  return {
    htmlStr,
    suggestionList,
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
  if (filterField === 'holdingIndustry') {
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
    htmlStr += `<div>${labelName}： ${displayValue} </div>`;
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
    htmlStr += `<div>${time}开通业务： ${business} </div>`;
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
    htmlStr += `<div>${labelName}：${filterObj[filterField]} </div>`;
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
    htmlStr += `<div>${labelName}： ${tempFilterField[1]} </div>`;
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
      return `<div>年龄范围： ${ageRange[0]}岁 - ${ageRange[1]}岁 </div>`;
    }
    if (ageRange[0]) {
      return `<div>年龄范围： 大于等于${ageRange[0]}岁 </div>`;
    }
    if (ageRange[1]) {
      return `<div>年龄范围： 小于等于${ageRange[1]}岁 </div>`;
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
    return `<div>最近一次服务时间：${m(lastServDt[0]).format(FORMAT)}后${serviceCustState[lastServDt[1]]}</div>`;
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
  if (!_.isEmpty(dateRange) && dateRange[0] && dateRange[1]) {
    return `<div>${labelName}： ${dateRange[0]} - ${dateRange[1]} </div>`;
  }
  return '';
}

/**
 * 获取佣金率信息
 * @param {*} minfee url中解析出来的filter字段中当前要获取信息的字段
 */
function getMinfeeInfo(minFee) {
  if (!_.isEmpty(minFee)) {
    if (minFee[0] && minFee[1]) {
      return `<div>佣金率： ${minFee[0]}‰ - ${minFee[1]}‰ </div>`;
    }
    if (minFee[0]) {
      return `<div>佣金率： 大于等于${minFee[0]}‰ </div>`;
    }
    if (minFee[1]) {
      return `<div>佣金率： 小于等于${minFee[1]}‰ </div>`;
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
      return `<div>${time}${labelName}： ${start}元 - ${end}元 </div>`;
    }
    if (start) {
      return `<div>${time}${labelName}： 大于等于${start}元 </div>`;
    }
    if (end) {
      return `<div>${time}${labelName}： 小于等于${end}元 </div>`;
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
      return `<div>${labelName}： ${range[0]}元 - ${range[1]}元 </div>`;
    }
    if (range[0]) {
      return `<div>${labelName}： 大于等于${range[0]}元 </div>`;
    }
    if (range[1]) {
      return `<div>${labelName}： 小于等于${range[1]}元 </div>`;
    }
  }
  return '';
}

// 新版客户表发起任务，在新建任务的任务提示的显示的信息
function getFilterInfo({ filterObj, dict, industryList }) {
  const {
    labelInfos, kPIDateScopeType,
    singleBusinessTypeList,
  } = dict;
  let htmlStr = '<div><div>该客户通过淘客筛选，并满足以下条件：</div>';
  let suggestionList = [];
  // url中filter没有值时，只显示’可开通业务‘
  if (_.isEmpty(filterObj)) {
    htmlStr += '<div>可开通业务： $可开通业务 </div>';
  } else {
    const {
      htmlStr: labelHtmlStr,
      suggestionList: labelSuggestionList,
    } = getLabelInfo(filterObj, labelInfos);
    const {
      htmlStr: holdingProductHtmlStr,
      suggestionList: holdingProductSuggestionList,
    } = getHoldingProductInfo(filterObj);
    const businessOpenedHtmlStr =
      getBusinessOpenedInfo(filterObj, kPIDateScopeType, singleBusinessTypeList);
    const ageHtmlStr = getAgeFilterInfo(filterObj.age);
    const lastServiceHtmlStr = getLatestServiceInfo(filterObj.lastServDt, serviceCustomerState);
    const minFeeHtmlStr = getMinfeeInfo(filterObj.minFee);
    htmlStr += labelHtmlStr + holdingProductHtmlStr + businessOpenedHtmlStr + ageHtmlStr
      + lastServiceHtmlStr + minFeeHtmlStr;
    _.each(commonFilterList, (item) => {
      htmlStr += getCommonFilterInfo(item, filterObj, { ...dict, industryList });
    });
    _.each(basicInfoList, (item) => {
      htmlStr += getKeywordInfo(item, filterObj);
    });
    _.each(singleWithSearchFilterList, (item) => {
      htmlStr += getSingleWithSearchFilterInfo(item, filterObj);
    });
    _.each(dateRangeFilterList, (item) => {
      htmlStr += getDateRangInfo(item, filterObj);
    });
    _.each(buyAmtFilterList, (item) => {
      htmlStr += getBuyAmtInfo(item, filterObj, kPIDateScopeType);
    });
    _.each(capitalFilterList, (item) => {
      htmlStr += getCapitalRangInfo(item, filterObj);
    });
    suggestionList = [...labelSuggestionList, ...holdingProductSuggestionList];
  }
  htmlStr += '</div>';
  return {
    htmlStr,
    suggestionList,
  };
}

export default { getFilterInfo };
