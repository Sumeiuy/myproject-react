/*
 * @Author: sunweibin
 * @Date: 2018-10-11 18:37:20
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-10-23 16:50:19
 * @description 新版客户360详情的账户信息Tab下页面的配置项
 */

// 表格滚动的配置
export const TABLE_SCROLL_SETTING = { x: 400, y: 220 };

// 资产分布雷达图配置
export const CHART_RADAR_OPTIONS = {
  radius: '65%',
  center: ['50%', '50%'],
  name: {
    textStyle: {
      color: '#108ee9',
      borderRadius: 3,
      padding: [3, 5]
    },
    rich: {
      name: {
        color:'#108ee9',
        lineHeight: 14,
        fontSize: 12,
        align: 'center',
      },
      value: {
        color: '#333333',
        lineHeight: 14,
        align: 'center',
        fontSize: 12,
      },
      hightLightName: {
        fontSize: 16,
        lineHeight: 18,
        color: '#e75806',
      },
      hightLightValue: {
        fontSize: 14,
        lineHeight: 16,
        color: '#333',
      },
    },
  },
  nameGap: 0,
  axisLine: {
    show: false,
  },
  splitNumber: 3,
  splitArea: {
    show: false,
  },
  triggerEvent: true,
};

export const CHART_SERIES_OPTIONS = {
  type: 'radar',
  itemStyle: {
    normal: {
      opacity: 0,
    },
  },
  lineStyle: {
    normal: {
      color: '#f8af87',
    },
  },
  areaStyle: {
    normal: {
      color: '#ffede2',
      opacity: 1,
    },
  }
};

// 初始化查询指定指标的详情数据的key,默认为股票，其key=PA040000
export const SPECIFIC_INITIAL_KEY = 'PA040000';
export const SPECIFIC_INITIAL_NAME = '股票';

// 资产分布雷达图必须显示的五个指标的IDs
export const RADAR_MUST_DISPLAY_INDICATORS = [
  // 股票
  'PA040000',
  // 现金
  '99',
  // 开放式基金
  'PA050000',
  // 债券
  'PA030000',
  // 理财产品
  'PA070000',
];

const config = {
  //实时持仓中单选框list
 list: [
  {
    value: 'all',
    label: '全部'
  },
  {
    value: 'normal',
    label: '普通'
  },
  {
    value: 'credit',
    label: '信用'
  },
],
//实时持仓中证券实时持仓表格
 columns: [
  {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    className: 'productCode',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    className: 'productCode',
  },
  {
    title: '持仓数',
    dataIndex: 'holdingNumber',
    key: 'holdingNumber',
    align: 'right',
    className: 'dataInterval',
  },
  {
    title: '可用数',
    dataIndex: 'availableNumber',
    key: 'availableNumber',
    align: 'right',
    className: 'dataInterval',
  },
  {
    title: '成本',
    dataIndex: 'cost',
    key: 'cost',
    align: 'right',
    className: 'dataInterval',
  },
  {
    title: '现价',
    dataIndex: 'presentPrice',
    key: 'presentPrice',
    align: 'right',
    className: 'dataInterval',
  },
  {
    title: '市值',
    dataIndex: 'marketValue',
    key: 'marketValue',
    align: 'right',
    className: 'dataInterval',
  },
  {
    title: '盈亏',
    dataIndex: 'profitAndLoss',
    key: 'profitAndLoss',
    align: 'right',
    className: 'dataInterval',
  },
  {
    title: '货币类型',
    dataIndex: 'currencyType',
    key: 'currencyType',
    className: 'currencyType',
  },
],
//实时持仓中产品实时持仓的表格
 productColumns: [
  {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    className: 'productCode',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    className:'productName'
  },
  {
    title: '份额',
    dataIndex: 'share',
    key: 'share',
    align: 'right',
    className:'share'
  },
  {
    title: '收益率/净值',
    dataIndex: 'netWorth',
    key: 'netWorth',
    align: 'right',
    className:'netWorth'
  },
  {
    title: '市值',
    dataIndex: 'marketValue',
    key: 'marketValue',
    align: 'right',
    className:'marketValue'
  },
  {
    title: '盈亏',
    dataIndex: 'profitAndLoss',
    key: 'profitAndLoss',
    align: 'right',
    className:'profitAndLoss'
  },
  {
    title: '货币类型',
    dataIndex: 'currencyType',
    key: 'currencyType',
    className: 'currencyType'
  },
],
};
export default config;
export const {
  list,
  productColumns,
  columns
} = config;
