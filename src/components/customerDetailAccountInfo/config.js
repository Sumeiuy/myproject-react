/*
 * @Author: sunweibin
 * @Date: 2018-10-11 18:37:20
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-23 11:52:38
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
  splitNumber: 3,
  splitArea: {
    areaStyle: {                            // 分隔区域的样式设置。
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
        color : '#ff8008',
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

// 交易流水下3个Tab的显示配置
export const TRADE_FLOW_TABS = {
  standardAccountTrade: '普通账户历史交易',
  creditAccountTrade: '信用账户历史交易',
  optionAccountTrade: '期权账户历史交易',
};

export const STOCK_HISTORY_HOLDING_TABLE_SCROLL = { x: 2000 };
export const PRODUCT_HISTORY_HOLDING_TABLE_SCROLL= { x: 2000 };
export const OPTION_HISTORY_HOLDING_TABLE_SCROLL = { x: 2500 };
export const STANDARD_TRADE_FLOW_TABLE_SCROLL = { x: 2100 };
export const CREDIT_TRADE_FLOW_TABLE_SCROLL= { x: 1800 };
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
    width: 160,
    key: 'industry',
    dataIndex: 'industry',
    title: '所属行业',
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '名称',
  },
  {
    width: 160,
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
    width: 120,
    title: '产品大类',
    key: 'firstType',
    dataIndex: 'firstType',
  },
  {
    width: 160,
    title: '产品二级类别',
    key: 'secondType',
    dataIndex: 'secondType',
  },
  {
    title: '名称',
    key: 'name',
    dataIndex: 'name',
  },
  {
    width: 160,
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
    width: 140,
    title: '持仓占比',
    key: 'holdPercent',
    dataIndex: 'holdPercent',
    align: 'right',
  },
];

// 期权历史持仓表格显示的columns
export const OPTION_HISTORY_HOLDING_COLUMNS = [
  {
    width: 120,
    title: '类别',
    key: 'type',
    dataIndex: 'type',
  },
  {
    width: 200,
    title: '期权名称',
    key: 'optionName',
    dataIndex: 'optionName',
  },
  {
    width: 180,
    title: '期权代码',
    key: 'optionCode',
    dataIndex: 'optionCode',
  },
  {
    width: 140,
    title: '期权种类',
    key: 'optionKind',
    dataIndex: 'optionKind',
  },
  {
    width: 160,
    title: '证劵代码',
    key: 'stockCode',
    dataIndex: 'stockCode',
  },
  {
    width: 140,
    title: '证券类别',
    key: 'stockKind',
    dataIndex: 'stockKind',
  },
  {
    width: 160,
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
    width: 140,
    title: '持仓占比',
    key: 'holdPercent',
    dataIndex: 'holdPercent',
    align: 'right',
  },
];

// 交易流水中普通账户流水的columns
export const STANDARD_TRADE_FLOW_COLUMNS = [
  {
    title: '交易日期',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    className: 'tradeDate',
    fixed: 'left',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    className:'productName',
    fixed: 'left',
  },
  {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    className:'productCode',
    fixed: 'left',
  },
  {
    title: '业务类别',
    dataIndex: 'bussinessType',
    key: 'bussinessType',
    className:'bussinessType',
  },
  {
    title: '成交价格',
    dataIndex: 'dealPrice',
    key: 'dealPrice',
    className:'dealPrice',
    align: 'right',
    isNumber: true,
  },
  {
    title: '成交数量',
    dataIndex: 'dealNumber',
    key: 'dealNumber',
    className:'dealNumber',
    align: 'right',
    isAmount: true,
  },
  {
    title: '成交金额',
    dataIndex: 'dealMoney',
    key: 'dealMoney',
    className: 'dealMoney',
    align: 'right',
    isNumber: true,
  },
  {
    title: '佣金',
    dataIndex: 'commission',
    key: 'commission',
    className: 'commission',
    align: 'right',
    isNumber: true,
  },
  {
    title: '净佣金',
    dataIndex: 'realCommission',
    key: 'realCommission',
    className: 'realCommission',
    align: 'right',
    isNumber: true,
  },
  {
    title: '印花税',
    dataIndex: 'stampTax',
    key: 'stampTax',
    className: 'stampTax',
    align: 'right',
    isNumber: true,
  },
  {
    title: '风险金',
    dataIndex: 'riskMoney',
    key: 'riskMoney',
    className: 'riskMoney',
    align: 'right',
    isNumber: true,
  },
  {
    title: '产品类型',
    dataIndex: 'productType',
    key: 'productType',
    className: 'productType',
  },
  {
    title: '交易渠道',
    dataIndex: 'tradeChannel',
    key: 'tradeChannel',
    className: 'tradeChannel',
  },
];
// 交易流水中信用账户流水的columns
export const CREDIT_TRADE_FLOW_COLUMNS = [
  {
    title: '交易日期',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    className: 'tradeDate',
    fixed: 'left',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    className:'productName',
    fixed: 'left',
  },
  {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    className:'productCode',
    fixed: 'left',
  },
  {
    title: '业务类别',
    dataIndex: 'bussinessType',
    key: 'bussinessType',
    className:'bussinessType',
  },
  {
    title: '成交价格',
    dataIndex: 'dealPrice',
    key: 'dealPrice',
    className:'dealPrice',
    align: 'right',
    isNumber: true,
  },
  {
    title: '成交数量',
    dataIndex: 'dealNumber',
    key: 'dealNumber',
    className:'dealNumber',
    align: 'right',
    isAmount: true,
  },
  {
    title: '成交金额',
    dataIndex: 'dealMoney',
    key: 'dealMoney',
    className: 'dealMoney',
    align: 'right',
    isNumber: true,
  },
  {
    title: '佣金',
    dataIndex: 'commission',
    key: 'commission',
    className: 'commission',
    align: 'right',
    isNumber: true,
  },
  {
    title: '净佣金',
    dataIndex: 'realCommission',
    key: 'realCommission',
    className: 'realCommission',
    align: 'right',
    isNumber: true,
  },
  {
    title: '印花税',
    dataIndex: 'stampTax',
    key: 'stampTax',
    className: 'stampTax',
    align: 'right',
    isNumber: true,
  },
  {
    title: '交易渠道',
    dataIndex: 'tradeChannel',
    key: 'tradeChannel',
    className: 'tradeChannel',
  },
];
// 交易流水中期权账户流水的columns
export const OPTION_TRADE_FLOW_COLUMNS = [
  {
    title: '交易日期',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    className: 'tradeDate',
    fixed: 'left',
  },
  {
    title: '期权合约简称',
    dataIndex: 'optionContractName',
    key: 'optionContractName',
    className:'optionContractName',
    fixed: 'left',
  },
  {
    title: '期权合约编码',
    dataIndex: 'optionContractCode',
    key: 'optionContractCode',
    className:'optionContractCode',
    fixed: 'left',
  },
  {
    title: '业务类别',
    dataIndex: 'bussinessType',
    key: 'bussinessType',
    className:'bussinessType',
  },
  {
    title: '成交价格',
    dataIndex: 'dealPrice',
    key: 'dealPrice',
    className:'dealPrice',
    isNumber: true,
  },
  {
    title: '成交数量',
    dataIndex: 'dealNumber',
    key: 'dealNumber',
    className:'dealNumber',
    align: 'right',
    isAmount: true,
  },
  {
    title: '成交金额',
    dataIndex: 'dealMoney',
    key: 'dealMoney',
    className: 'dealMoney',
    align: 'right',
    isNumber: true,
  },
  {
    title: '佣金',
    dataIndex: 'commission',
    key: 'commission',
    className: 'commission',
    align: 'right',
    isNumber: true,
  },
  {
    title: '净佣金',
    dataIndex: 'realCommission',
    key: 'realCommission',
    className: 'realCommission',
    align: 'right',
    isNumber: true,
  },
  {
    title: '一级经手费',
    dataIndex: 'oneLevelBrokerage',
    key: 'oneLevelBrokerage',
    className: 'oneLevelBrokerage',
    align: 'right',
    isNumber: true,
  },
  {
    title: '其他费(结算费)',
    dataIndex: 'otherCost',
    key: 'otherCost',
    className: 'otherCost',
    align: 'right',
    isNumber: true,
  },
  {
    title: '期权种类',
    dataIndex: 'optionCategory',
    key: 'optionCategory',
    className: 'optionCategory',
  },
  {
    title: '期权持仓类别',
    dataIndex: 'optionPositionsCategory',
    key: 'optionPositionsCategory',
    className: 'optionPositionsCategory',
  },
  {
    title: '证券代码',
    dataIndex: 'stockCode',
    key: 'stockCode',
    className: 'stockCode',
  },
  {
    title: '买卖方向',
    dataIndex: 'businessDirection',
    key: 'businessDirection',
    className: 'businessDirection',
  },
  {
    title: '开平仓方向',
    dataIndex: 'openStorageDirection',
    key: 'openStorageDirection',
    className: 'openStorageDirection',
  },
];
// 交易流水资金变动columns
export const CAPITAL_CHANGE_COLUMNS = [
  {
    title: '交易日期',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    className: 'tradeDate',
    width: '14%' ,
  },
  {
    title: '资金账号',
    dataIndex: 'accountNumber',
    key: 'accountNumber',
    className:'accountNumber',
    width: '14%' ,
  },
  {
    title: '币种',
    dataIndex: 'currency',
    key: 'currency',
    className:'currency',
    width: '14%',
  },
  {
    title: '交易渠道',
    dataIndex: 'tradeChannel',
    key: 'tradeChannel',
    className:'tradeChannel',
    width: '14%',
  },
  {
    title: '业务标志',
    dataIndex: 'serviceIndication',
    key: 'serviceIndication',
    className:'serviceIndication',
    width: '15%',
  },
  {
    title: '交易金额(元)',
    dataIndex: 'ammount',
    key: 'ammount',
    align: 'right',
    className:'ammount',
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

// 证券实时持仓columns
export const STOCK_REALTIME_COLUMNS = [
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
];
// 产品实时持仓columns
export const PRODUCT_REALTIME_COLUMNS = [
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
];

// 实时持仓的Tab的显示配置
export const REALTIME_HOLDING_TABS = {
  stockRealTimeHolding: '证券实时持仓',
  productRealTimeHolding: '产品实时持仓',
};
