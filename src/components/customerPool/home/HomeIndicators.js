/**
 * @fileOverview home/homeIndictors.js
 * @author zhangjunli
 * @description 封装首页指标数据
 */
import _ from 'lodash';
import { fspContainer } from '../../../config';
import { fspGlobal, helper } from '../../../utils';
import getSeries, { tooltipConfig, singleColorBar } from './chartOption';
import { toFixedCust, getPercentage, toFixedMoney } from '../../chartRealTime/FixNumber';

export function filterEmptyToInteger(number) {
  return ((_.isEmpty(number)) ? 0 : _.parseInt(number, 10));
}

export function filterEmptyToNumber(number) {
  return ((_.isEmpty(number)) ? 0 : _.toNumber(number));
}

// 数字千分位格式化(只格式化整数部分，小数部分不格式化)
function toThousands({ isNegative = false, integerStr = '', floatStr = '' }) {
  let formaterStr = '';
  let count = 0;
  for (let i = integerStr.length - 1; i >= 0; i--) {
    if (count % 3 === 0 && count !== 0) {
      formaterStr = `${integerStr.charAt(i)},${formaterStr}`;
    } else {
      formaterStr = `${integerStr.charAt(i)}${formaterStr}`;
    }
    count++;
  }
  if (_.isEmpty(floatStr)) {
    return isNegative ? `-${formaterStr}` : formaterStr;
  }
  return isNegative ? `-${formaterStr}${floatStr}` : `${formaterStr}${floatStr}`;
}

// 格式化数字，逢三位加一个逗号
export function numFormat(num) {
  const isNegative = num < 0;
  const positiveNum = Math.abs(num);
  const numStrArray = _.split(positiveNum.toString(), '.');
  let integerStr = '';
  let floatStr = '';
  if (!_.isEmpty(numStrArray)) {
    integerStr = numStrArray[0];
    if (numStrArray.length === 2) {
      floatStr = `.${numStrArray[1]}`;
    }
  }
  return toThousands({ isNegative, integerStr, floatStr });
}

function getProgressDataSource({
  dataArray,
  categoryArray,
  colorArray,
  formatterMethod,
}) {
  const percenteArray = getPercentage(dataArray);
  const { newUnit, newSeries } = formatterMethod(dataArray);
  const thousandsFormatSeries = _.map(
    newSeries,
    item => numFormat(item),
  );
  const items = _.map(
    categoryArray,
    (item, index) => ({
      cust: item,
      thousandsCount: thousandsFormatSeries[index],
      count: newSeries[index],
      percent: percenteArray[index],
      color: colorArray[index],
      id: index,
    }),
  );
  return { newUnit, items };
}

// 经营指标的新增客户
export function getPureAddCust({ pureAddData }) {
  const param = {
    dataArray: pureAddData,
    categoryArray: ['净新增有效户', '净新增非零售客户', '净新增高端产品户', '新增产品客户'],
    colorArray: ['#38d8e8', '#60bbea', '#7d9be0', '#756fb8'],
    formatterMethod: toFixedCust,
  };
  return getProgressDataSource(param);
}

// type：manage（经营指标）/ performance（投顾绩效）
// 产品销售
export function getProductSale({
  productSaleData,
  nameArray = ['公募基金', '证券投资类私募', '资金产品', 'OTC'],
}) {
  const param = {
    dataArray: productSaleData,
    categoryArray: nameArray,
    colorArray: ['#38d8e8', '#60bbea', '#7d9be0', '#756fb8'],
    formatterMethod: toFixedMoney,
  };
  return getProgressDataSource(param);
}

// 经营指标的开通业务数
// 一柱多彩
export function getClientsNumber({
  clientNumberData,
  names = ['天天发', '港股通', '两融', '期权', '创业版'],
  colourfulIndex,
  colourfulData,
  colourfulTotalNumber,
}) {
  const {
    newUnit,
    newSeries,
  } = toFixedCust(clientNumberData);
  // const thousandsFormatSeries = _.map(
  //   newSeries,
  //   item => numFormat(item),
  // );
  const items = {
    tooltip: {},    // 使用默认值
    grid: {
      left: '10px',
      right: '10px',
      bottom: '34px',
      top: '32px',
      containLabel: false,
    },
    xAxis: [
      {
        data: names,
        axisTick: { show: false },
        axisLabel: {
          interval: 0,
          margin: 6,
          fontFamily: 'PingFangSC-Regular',
          fontSize: 12,
          color: '#666666',
          showMinLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: '#999',
          },
        },
      },
    ],
    yAxis: [{ show: false }],
    series: singleColorBar({
      data: newSeries,
      width: 13,
      basicColor: '#7d9be0',
      colourfulTotal: colourfulTotalNumber,
      colourfulData,
      colourfulIndex,
    }),
  };
  return { newUnit, items };
}

// 经营指标的资产和交易量
export function getTradingVolume({ tradeingVolumeData }) {
  const { newUnit, newSeries } = toFixedMoney(tradeingVolumeData);
  const thousandsFormatSeries = _.map(
    newSeries,
    item => numFormat(item),
  );
  return { newUnit, items: thousandsFormatSeries || [] };
}

// 经营指标的服务指标
export function getServiceIndicatorOfManage({ motOkMnt, motTotMnt, taskCust, totCust }) {
  let motPercent = 0;
  let taskPercent = 0;
  if (!_.isEmpty(motTotMnt) && filterEmptyToNumber(motOkMnt) > 0) {
    motPercent = (_.toNumber(motOkMnt) / _.toNumber(motTotMnt)) * 100;
  }
  if (!_.isEmpty(totCust) && filterEmptyToNumber(taskCust) > 0) {
    taskPercent = (_.toNumber(taskCust) / _.toNumber(totCust)) * 100;
  }
  return [
    { category: '必做MOT完成率', percent: motPercent },
    { category: '客户服务覆盖率', percent: taskPercent },
  ];
}

// 投顾绩效的服务指标
export function getServiceIndicatorOfPerformance({ performanceData }) {
  return {
    ...tooltipConfig,
    grid: {
      left: '15px',
      right: '15px',
      bottom: '40px',
      top: '30px',
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      data: ['MOT\n完成率', '服务\n覆盖率', '多元配\n置覆盖率', '信息\n完备率'],
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: '#999',
        fontSize: '12',
        interval: 0,
        margin: 6,
      },
    },
    yAxis: {
      show: false,
      splitLine: { show: false },
    },
    series: getSeries({
      data: performanceData,
      width: 25,
      maxValue: 100,
      bgColor: '#d8d8d8',
    }),
  };
}

// 投顾绩效的客户及资产
export function getCustAndProperty(dataArray) {
  const custArray = [];
  const properyArray = [];
  for (let i = 0; i < dataArray.length; i += 2) {
    const custItem = dataArray[i];
    const propertyItem = dataArray[(i + 1)];
    custArray.push({ value: filterEmptyToInteger(custItem.value), name: custItem.name });
    properyArray.push(filterEmptyToNumber(propertyItem.value));
  }
  // formatter 资产数据，获得 unit
  const { newUnit: propertyUnit, newSeries } = toFixedMoney(properyArray);
  const datas = _.map(
    newSeries,
    (item, index) => ({ ...(custArray[index]), property: item }),
  );
  // 降序排列
  const descData = _.orderBy(datas, ['value'], ['desc']);
  // formatter 客户数，获得 unit
  const custNumberArray = [];
  _.forEach(descData, item => custNumberArray.push(item.value));
  const { newUnit: custUnit, newSeries: newCustArray } = toFixedCust(custNumberArray);
  // 设置背景色
  const colors = ['#756fb8', '#7d9be0', '#38d8e8'];
  const newDatas = _.map(
    descData,
    (item, index) => ({ ...item, bgColor: colors[index], value: newCustArray[index] }),
  );
  return { color: '#000', custUnit, propertyUnit, data: newDatas };
}

// 投顾绩效/经营指标的沪深归集率
export function getHSRate(array) {
  return {
    tooltip: { show: true },
    series: [{
      type: 'liquidFill',
      name: '沪深归集率',
      amplitude: '3%',
      waveLength: '40%',
      waveAnimation: false,
      animationDuration: 0,
      animationDurationUpdate: 0,
      data: array,
      outline: { show: false },
      backgroundStyle: {
        borderWidth: 5,
        borderColor: '#ccc',
        color: 'white',
      },
      itemStyle: {
        normal: {
          opacity: 0.95,
          color: '#60bbea',
        },
        emphasis: { opacity: 0.8 },
      },
      label: {
        normal: {
          show: true,
          color: '#294D99',
          insideColor: '#fff',
          fontSize: 50,
          align: 'center',
          baseline: 'middle',
          position: ['50%', '70%'],
        },
      },
    }],
  };
}

export function linkTo({ value, bname, cycle, push, location }) {
  if (_.isEmpty(location)) {
    return;
  }
  const { query: { orgId, cycleSelect } } = location;
  const pathname = '/customerPool/list';
  const obj = {
    source: 'numOfCustOpened',
    rightType: value,
    bname: encodeURIComponent(bname),
    orgId: orgId || '',
    cycleSelect: cycleSelect || (cycle[0] || {}).key,
  };
  if (document.querySelector(fspContainer.container)) {
    const url = `${pathname}?${helper.queryToString(obj)}`;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'RCT_FSP_CUSTOMER_LIST',
      title: '目标客户',
    };
    fspGlobal.openRctTab({ url, param });
  } else {
    push({
      pathname,
      query: obj,
    });
  }
}
