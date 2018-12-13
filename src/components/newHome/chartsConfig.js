/*
 * @Author: yuanhaojie
 * @Date: 2018-12-06 09:32:56
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-12-13 13:37:21
 * @Description: 图表相关的配置选项
 */

import _ from 'lodash';
import { isNumberEmpty } from '../../helper/check';
import {
  thousandFormat,
  formatByBorders,
  toFixed,
} from '../../helper/number';

const EMPTY_VALUE = '--';
// 投顾绩效重点指标
const POINT_INDICATORS_CONFIG = [
  {
    name: '新开客户新增有效户',
    key: 'newEffCust', // 返回中的字段名称
    isAsset: false, // 是否为资产值
  },
  {
    name: '净新增有效户',
    key: 'netAddedEffCust',
    isAsset: false,
  },
  {
    name: '新增激活客户数',
    key: 'newActiveCustNum',
    isAsset: false,
  },
  {
    name: '新增金融产品客户数',
    key: 'newCustBuyFinaNum',
    isAsset: false,
  },
  {
    name: '新开客户净新增资产',
    key: 'newAddCustAset',
    isAsset: true,
  },
  {
    name: '净新增客户资产',
    key: 'newCustAset',
    isAsset: true,
  },
];

// 客户及资产
const CUSTOMER_AND_ASSET_CONFIG = [
  {
    name: '服务客户数',
    key: 'custNum',
    isAsset: false,
  },
  {
    name: '服务客户资产',
    key: 'totAset',
    isAsset: true,
  },
  {
    name: '签约客户数',
    key: 'currSignCustNum',
    isAsset: false,
  },
  {
    name: '签约客户资产',
    key: 'currSignCustAset',
    isAsset: true,
  },
  {
    name: '存量新增日均资产',
    key: 'clCustNewAvgAset',
    isAsset: true,
  },
  {
    name: '产品日均保有市值',
    key: 'avgPrdtMktValCreate',
    isAsset: true,
  },
];

// 金融产品
const FINANCIAL_PRODUCT_CONFIG = [
  {
    name: '销量合计',
    key: 'allPrdtBuyAmt',
    isAsset: true,
  },
  {
    name: '公募基金',
    key: 'kfTranAmt',
    isAsset: true,
  },
  {
    name: '紫金产品',
    key: 'taTranAmt',
    isAsset: true,
  },
  {
    name: 'OTC',
    key: 'otcTranAmt',
    isAsset: true,
  },
  {
    name: '私募基金',
    key: 'smTranAmt',
    isAsset: true,
  },
  {
    name: '重点创新产品',
    key: 'zdcxPrdt',
    isAsset: true,
  },
];

// 业务开通（户）
const OPEN_ACCOUNTS_CONFIG = [
  {
    name: '融资融券',
    key: 'rzrqBusiCurr',
    isAsset: false,
  },
  {
    name: '天天发',
    key: 'ttfBusiCurr',
    isAsset: false,
  },
  {
    name: '沪港通',
    key: 'hgtBusiCurr',
    isAsset: false,
  },
  {
    name: '深港通',
    key: 'sgtBusiCurr',
    isAsset: false,
  },
  {
    name: '个股期权',
    key: 'gpqqBusiCurr',
    isAsset: false,
  },
  {
    name: '新三板',
    key: 'xsbBusiCurr',
    isAsset: false,
  },
];

// 净创收
const NET_INCOME_CONFIG = [
  {
    name: '代理买卖证券净创收',
    key: 'dlmmZqIncome',
    isAsset: true,
  },
  {
    name: '产品净手续费收入',
    key: 'prdtPurFee',
    isAsset: true,
  },
  {
    name: '净利息收入',
    key: 'purInteIncome',
    isAsset: true,
  },
];

// 服务指标
const SERVICE_INDICATOR_CONFIG = [
  {
    name: '必做MOT完成率',
    key: 'motCompletePercent',
    isAsset: false,
    color: 'orange',
    isPercent: true,
  },
  {
    name: '服务覆盖率',
    key: 'serviceCompPercent',
    isAsset: false,
    color: 'yellow',
    isPercent: true,
  },
  {
    name: '归集率',
    key: 'shzNpRate',
    isAsset: false,
    color: 'red',
    isPercent: true,
  },
];

// 根据返回值和配置参数获取实际的值
function getValueByResponse(indicators, configs) {
  return _.map(configs, (config) => {
    const indicatorValue = indicators[config.key];
    const value = Number((indicatorValue && indicatorValue.value) || config.defaultValue);
    const unit = (indicatorValue && indicatorValue.unit);
    let formatedValue;
    if (isNumberEmpty(value)) {
      formatedValue = EMPTY_VALUE;
    } else if (config.isAsset) {
      formatedValue = formatByBorders({ num: value });
    } else {
      formatedValue = config.isPercent ? `${toFixed(value)}%` : `${thousandFormat(value)}${unit}`;
    }
    return {
      ...config,
      value,
      formatedValue,
      description: indicatorValue && indicatorValue.description,
    };
  });
}

export {
  EMPTY_VALUE,
  POINT_INDICATORS_CONFIG,
  CUSTOMER_AND_ASSET_CONFIG,
  FINANCIAL_PRODUCT_CONFIG,
  OPEN_ACCOUNTS_CONFIG,
  NET_INCOME_CONFIG,
  SERVICE_INDICATOR_CONFIG,
  getValueByResponse,
};
