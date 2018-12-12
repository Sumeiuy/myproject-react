/*
 * @Author: sunweibin
 * @Date: 2018-10-11 18:37:20
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-12 13:08:27
 * @description 新版客户360详情的账户信息Tab下页面的配置项
 */

// 表格滚动的配置
export const TABLE_SCROLL_SETTING = { x: 400, y: 220 }; // eslint-disable-line

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
        color: '#108ee9',
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
  splitNumber: 3,
  splitArea: {
    areaStyle: { // 分隔区域的样式设置。
      show: true,
      color: ['#f4f6f9', '#e9eaec'],
    }
  },
  triggerEvent: true,
};

export const CHART_SERIES_OPTIONS = {
  type: 'radar',
  itemStyle: {
    normal: {
      lineStyle: {
        color: '#ff8008',
      },
      areaStyle: {
        color: '#fec965',
        opacity: 1
      },
    }
  },
  symbol: 'circle',
};

// 初始化查询指定指标的详情数据的key,默认为股票，其key=PA040000
export const SPECIFIC_INITIAL_KEY = 'PA040000';
export const SPECIFIC_INITIAL_NAME = '股票';

// 账户信息下的账户概览、普通账户、信用账户、期权账户Tab显示配置
export const ACCOUNT_INFO_TABS = {
  accountSummary: '账户概览',
  normalAccount: '普通账户',
  creditAccount: '信用账户',
  optionAccount: '期权账户',
};

// 历史持仓下3个Tab的显示配置
export const HISTORY_HOLDING_TABS = {
  stockHistoryHolding: '证券持仓明细',
  productHistoryHolding: '产品持仓明细',
  optionHistoryHolding: '期权持仓明细',
};

// 交易流水下4个Tab的显示配置
export const TRADE_FLOW_TABS = {
  normal: '普通账户历史交易',
  credit: '信用账户历史交易',
  option: '期权账户历史交易',
  capitalChange: '资金变动',
};

// 历史持仓的表格的滚动props
export const STOCK_HISTORY_HOLDING_TABLE_SCROLL = { x: 1900 };
export const PRODUCT_HISTORY_HOLDING_TABLE_SCROLL = { x: 2000 };
export const OPTION_HISTORY_HOLDING_TABLE_SCROLL = { x: 2200 };

// 交易流水三个表格的滚动props
export const STANDARD_TRADE_FLOW_TABLE_SCROLL = { x: 2100 };
export const CREDIT_TRADE_FLOW_TABLE_SCROLL = { x: 1800 };
export const OPTION_TRADE_FLOW_TABLE_SCROLL = { x: 2500 };

// 证券历史持仓表格显示的columns
export const STOCK_HISTORY_HOLDING_COLUMNS = [
  {
    width: 100,
    key: 'type',
    dataIndex: 'type',
    title: '类型',
  },
  {
    width: 140,
    key: 'industry',
    dataIndex: 'industry',
    title: '所属行业',
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '名称',
    width: 160,
  },
  {
    width: 80,
    key: 'code',
    dataIndex: 'code',
    title: '代码',
  },
  {
    width: 160,
    key: 'usableAmount',
    dataIndex: 'usableAmount',
    title: '可用数量',
    align: 'right',
    isAmount: true,
  },
  {
    width: 160,
    key: 'freezeAmount',
    dataIndex: 'freezeAmount',
    title: '冻结数量',
    align: 'right',
    isAmount: true,
  },
  {
    width: 160,
    key: 'costPrice',
    dataIndex: 'costPrice',
    title: '成本价(元)',
    align: 'right',
    isNumber: true,
  },
  {
    width: 160,
    key: 'marketPrice',
    dataIndex: 'marketPrice',
    title: '市价(元)',
    align: 'right',
    isNumber: true,
  },
  {
    width: 160,
    key: 'marketValue',
    dataIndex: 'marketValue',
    title: '市值(元)',
    align: 'right',
    isNumber: true,
  },
  {
    width: 200,
    key: 'profit',
    dataIndex: 'profit',
    title: '账面盈利(元)',
    align: 'right',
    isNumber: true,
  },
  {
    width: 140,
    key: 'holdPercent',
    dataIndex: 'holdPercent',
    title: '持仓占比',
    align: 'right',
  },
  {
    width: 120,
    key: 'holdDate',
    dataIndex: 'holdDate',
    title: '持仓时间',
  },
  {
    width: 120,
    key: 'sharesNature',
    dataIndex: 'sharesNature',
    title: '股份性质',
  },
];

// 产品历史持仓表格显示的columns
export const PRODUCT_HISTORY_HOLDING_COLUMNS = [
  {
    width: 140,
    title: '产品大类',
    key: 'firstType',
    dataIndex: 'firstType',
  },
  {
    width: 150,
    title: '产品二级类别',
    key: 'secondType',
    dataIndex: 'secondType',
  },
  {
    title: '名称',
    key: 'name',
    dataIndex: 'name',
    width: 240,
  },
  {
    width: 90,
    title: '产品代码',
    key: 'code',
    dataIndex: 'code',
  },
  {
    width: 160,
    title: '可用份额',
    key: 'usableShare',
    dataIndex: 'usableShare',
    align: 'right',
    isAmount: true,
  },
  {
    width: 180,
    title: '净值/7日年化收益率',
    key: 'yearRate',
    dataIndex: 'yearRate',
    align: 'right',
  },
  {
    width: 180,
    title: '成本(元)',
    key: 'costPrice',
    dataIndex: 'costPrice',
    align: 'right',
    isNumber: true,
  },
  {
    width: 180,
    title: '市值(元)',
    key: 'marketValue',
    dataIndex: 'marketValue',
    align: 'right',
    isNumber: true,
  },
  {
    width: 180,
    title: '累计收益(元)',
    key: 'totalProfit',
    dataIndex: 'totalProfit',
    align: 'right',
    isNumber: true,
  },
  {
    width: 160,
    title: '分红方式',
    key: 'dividendWay',
    dataIndex: 'dividendWay',
  },
  {
    width: 140,
    title: '持仓时间',
    key: 'holdDate',
    dataIndex: 'holdDate',
  },
  {
    width: 120,
    title: '持仓占比',
    key: 'holdPercent',
    dataIndex: 'holdPercent',
    align: 'right',
  },
];

// 期权历史持仓表格显示的columns
export const OPTION_HISTORY_HOLDING_COLUMNS = [
  {
    width: 100,
    title: '类别',
    key: 'type',
    dataIndex: 'type',
  },
  {
    width: 150,
    title: '期权名称',
    key: 'optionName',
    dataIndex: 'optionName',
  },
  {
    width: 90,
    title: '期权代码',
    key: 'optionCode',
    dataIndex: 'optionCode',
  },
  {
    width: 150,
    title: '期权种类',
    key: 'optionKind',
    dataIndex: 'optionKind',
  },
  {
    width: 90,
    title: '证劵代码',
    key: 'stockCode',
    dataIndex: 'stockCode',
  },
  {
    width: 160,
    title: '证券类别',
    key: 'stockKind',
    dataIndex: 'stockKind',
  },
  {
    width: 100,
    title: '权益持仓类别',
    key: 'rightsHoldingType',
    dataIndex: 'rightsHoldingType',
  },
  {
    width: 180,
    title: '可用数量',
    key: 'usableAmount',
    dataIndex: 'usableAmount',
    align: 'right',
    isAmount: true,
  },
  {
    width: 180,
    title: '成本价(元)',
    key: 'costPrice',
    dataIndex: 'costPrice',
    align: 'right',
    isNumber: true,
  },
  {
    width: 180,
    title: '最新价(元)',
    key: 'newestPrice',
    dataIndex: 'newestPrice',
    align: 'right',
    isNumber: true,
  },
  {
    width: 180,
    title: '市值(元)',
    key: 'marketValue',
    dataIndex: 'marketValue',
    align: 'right',
    isNumber: true,
  },
  {
    width: 180,
    title: '账面盈利(元)',
    key: 'profit',
    dataIndex: 'profit',
    align: 'right',
    isNumber: true,
  },
  {
    width: 140,
    title: '持仓时间',
    key: 'holdDate',
    dataIndex: 'holdDate',
  },
  {
    width: 140,
    title: '到期日期',
    key: 'holdEndDate',
    dataIndex: 'holdEndDate',
  },
  {
    width: 120,
    title: '持仓占比',
    key: 'holdPercent',
    dataIndex: 'holdPercent',
    align: 'right',
  },
];

// 交易流水资金变动columns
export const CAPITAL_CHANGE_COLUMNS = [
  {
    title: '交易日期',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    className: 'tradeDate',
    width: '14%',
  },
  {
    title: '资金账号',
    dataIndex: 'accountNumber',
    key: 'accountNumber',
    className: 'accountNumber',
    width: '14%',
  },
  {
    title: '币种',
    dataIndex: 'currency',
    key: 'currency',
    className: 'currency',
    width: '14%',
  },
  {
    title: '交易渠道',
    dataIndex: 'tradeChannel',
    key: 'tradeChannel',
    className: 'tradeChannel',
    width: '14%',
  },
  {
    title: '业务标志',
    dataIndex: 'serviceIndication',
    key: 'serviceIndication',
    className: 'serviceIndication',
    width: '15%',
  },
  {
    title: '交易金额(元)',
    dataIndex: 'ammount',
    key: 'ammount',
    align: 'right',
    className: 'ammount',
    isNumber: true,
    width: '14%',
  },
  {
    title: '余额(元)',
    dataIndex: 'balance',
    key: 'balance',
    align: 'right',
    className: 'balance',
    isNumber: true,
    width: '14%',
  },
];

function renderRealTimeColumn(text) {
  if (text === 'null' || text === null) {
    return '';
  }
  return text;
}

// 证券实时持仓columns
export const STOCK_REALTIME_COLUMNS = [
  {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    className: 'productCode',
    render: renderRealTimeColumn,
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    className: 'productCode',
    render: renderRealTimeColumn,
  },
  {
    title: '持仓数',
    dataIndex: 'holdingNumber',
    key: 'holdingNumber',
    align: 'right',
    className: 'dataInterval',
    render: renderRealTimeColumn,
  },
  {
    title: '可用数',
    dataIndex: 'availableNumber',
    key: 'availableNumber',
    align: 'right',
    className: 'dataInterval',
    render: renderRealTimeColumn,
  },
  {
    title: '成本',
    dataIndex: 'cost',
    key: 'cost',
    align: 'right',
    className: 'dataInterval',
    render: renderRealTimeColumn,
  },
  {
    title: '现价',
    dataIndex: 'presentPrice',
    key: 'presentPrice',
    align: 'right',
    className: 'dataInterval',
    render: renderRealTimeColumn,
  },
  {
    title: '市值',
    dataIndex: 'marketValue',
    key: 'marketValue',
    align: 'right',
    className: 'dataInterval',
    render: renderRealTimeColumn,
  },
  {
    title: '盈亏',
    dataIndex: 'profitAndLoss',
    key: 'profitAndLoss',
    align: 'right',
    className: 'dataInterval',
    render: renderRealTimeColumn,
  },
  {
    title: '货币类型',
    dataIndex: 'currencyType',
    key: 'currencyType',
    className: 'currencyType',
    render: renderRealTimeColumn,
  },
];
// 产品实时持仓columns
export const PRODUCT_REALTIME_COLUMNS = [
  {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    className: 'productCode',
    render: renderRealTimeColumn,
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    className: 'productName',
    render: renderRealTimeColumn,
  },
  {
    title: '份额',
    dataIndex: 'share',
    key: 'share',
    align: 'right',
    className: 'share',
    render: renderRealTimeColumn,
  },
  {
    title: '收益率/净值',
    dataIndex: 'netWorth',
    key: 'netWorth',
    align: 'right',
    className: 'netWorth',
    render: renderRealTimeColumn,
  },
  {
    title: '市值',
    dataIndex: 'marketValue',
    key: 'marketValue',
    align: 'right',
    className: 'marketValue',
    render: renderRealTimeColumn,
  },
  {
    title: '盈亏',
    dataIndex: 'profitAndLoss',
    key: 'profitAndLoss',
    align: 'right',
    className: 'profitAndLoss',
    render: renderRealTimeColumn,
  },
  {
    title: '货币类型',
    dataIndex: 'currencyType',
    key: 'currencyType',
    className: 'currencyType',
    render: renderRealTimeColumn,
  },
];

// 实时持仓的Tab的显示配置
export const REALTIME_HOLDING_TABS = {
  stockRealTimeHolding: '证券实时持仓',
  productRealTimeHolding: '产品实时持仓',
};

// 下拉框的style
export const COMMON_DROPDOWN_STYLE = {
  maxHeight: 324,
  overflowY: 'auto',
  width: 252,
};
