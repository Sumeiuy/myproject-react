/*
 * @Author: zhangjun
 * @Date: 2018-11-20 14:30:09
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-12-10 18:38:38
 */

import moment from 'moment';

// 资金投入
const FUND_INVEST = '资金投入';

// 资产市值
const ASSET_MARKET = '资产市值';

// 账户日收益率
const ACCOUNT_DAILY_RATE = '账户日收益率';

// 沪深300日收益率
const HS300_DAILY_RATE = '沪深300日收益率 ';

// 账户累计收益率
const ACCOUNT_CUMULATIVE_RATE = '账户累计收益率';

// 沪深300累计收益率
const HS300_CUMULATIVE_RATE = '沪深300累计收益率';

// 日期格式
const dateFormat = 'YYYY/MM/DD';

// 上个月月末的日期
const endDateOfLastMonthNotFormat = moment().subtract(1, 'month').endOf('month');
const endDateOfLastMonth = moment().subtract(1, 'month').endOf('month').format(dateFormat);

// 截止上月月末为一年的时间
const lastYearDataOfLastMonth = endDateOfLastMonthNotFormat.subtract(1, 'year').add(1, 'days').format(dateFormat);

// 盈利能力等级
const profitAbilityLevelList = [
  {
    level: 0,
    levelName: '弱',
    levelDesc: '客户在华泰同资产段中同期收益率排名后20%',
    levelClassName: 'levelWeak',
  },
  {
    level: 1,
    levelName: '较弱',
    levelDesc: '客户在华泰同资产段中同期收益率排名前50%-80%（含80%）',
    levelClassName: 'levelWeaker',
  },
  {
    level: 2,
    levelName: '较强',
    levelDesc: '客户在华泰同资产段中同期收益率排名前50%-80%（含80%）',
    levelClassName: 'levelStronger',
  },
  {
    level: 3,
    levelName: '强',
    levelDesc: '客户在华泰同资产段中同期收益率排名前20%（含20%）',
    levelClassName: 'levelStrong',
  }
];

// 资产变动情况注解说明
const assetChangeChartTip = [
  '1.上图为统计期内资金投入与资产市值的变化情况。',
  '2. 期初资产为统计期前一日资产市值。',
  '3. 资金投入为每日累计净流入值。',
];

// 账户收益走势注解说明
const profitTrendChartTip = [
  '1.上图为统计期内账户收益与沪深300指数的收益对比图。',
  '2.账户日收益计算基准为账户前一日资产净值。',
];

// 未能超额收益文本
const NOT_EXCESS_BENEFIT_TEXT = '客户投资收益未能战胜基准，未取得超额收益。';

// 超额收益文本
const EXCESS_BENEFIT_TEXT = '客户投资收益战胜基准收益，取得超额收益。';

// 图表通用配置项
const chartOption = {
  grid: {
    left: 10,
    right: 10,
    top: 10,
    bottom: 0,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#666',
      fontSize: 12,
      interval: 30,
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      lineStyle: {
        color: '#ccc',
        type: 'dotted',
      }
    },
    axisLabel: {
      color: '#666',
      fontSize: 12,
    },
  },
  smooth: true,
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(2, 22, 55, 0.8)',
    padding: 10,
    textStyle: {
      fontSize: 12,
    },
  },
};

// 归因收益类型
const EQUITY_TYPE = '权益类';
const SOLID_RECOVERY_TYPE = '固收类';
const CURRENCY_TYPE = '货币类';

// 归因表格列
const attributionTableColumns = [
  {
    dataIndex: 'type',
    width: 125,
  },
  {
    title: EQUITY_TYPE,
    dataIndex: 'equityRate',
  },
  {
    title: SOLID_RECOVERY_TYPE,
    dataIndex: 'solidRecoveryRate',
  },
  {
    title: CURRENCY_TYPE,
    dataIndex: 'currencyRate',
  },
];
// 归因分析标题
const ATTRIBUTION_INVEST_TITLE = 'Brinson归因分析';
// 归因投资风格
const ATTRIBUTION_INVEST_STYLE_LIST = ['保守型', '谨慎型', '稳健型', '积极型', '激进型'];

// 简介
const SUMMARY = '简介';

// 计算方法
const COMPUTE_METHOD = '计算方法';

// Brison归因简介
const ATTRIBUTION_SUMMARY_LIST = [
  `不同的投资组合会有不同的收益表现，而同一投资组合在不同时期内也有不同收益表现，业绩归因的意义即分析出上述现象的本质原因。
  Brison归因是应用较为广泛的归因计算模型之一。Brison归因本质为业绩拆分，即寻找一个基准收益作为对比，考察与基准相比，
  账户组合在权重配置和股票选择上存在的差异，并认为这些差异是账户获得与基准不同收益的原因`,
  ` 对账户投资作Brison归因分析，首先应当进行基准的设定，然后对比基准中的各个资产类别权重超配或者低配，最后在这些资产类别中进行个股的选择，
  这一系列选择造成的投资组合与基准组合的差异，就是账户最终超额收益的来源，收益来源可分为三部分。`,
  '1. 配置业绩：账户投资组合中对资产类别（或板块）相较基准进行超配或者低配带来的超额收益；',
  '2. 选股业绩：在同一资产类别（或板块）种，账户组合对股票权重的设定与基准不同，导致账户与基准收益不同；',
  '3. 叠加业绩：实质上是选股业绩和配置业绩的一种叠加效应，比如超配有正向选股能力的资产类别（或板块）、低配负向选股能力的资产类别（或板块）。',
  '该报告着重分析资产配置对账户收益的影响，因此本报告中涉及的超额收益计算仅针对配置业绩部分。',
];

// Brison归因计算方法
const ATTRIBUTION_COMPUTE_METHOD_LIST = [
  `选择基准，该分析报告选取的计算基准为“三大类资产配置方案”（由经纪及财富管理部策略研究团队提供）。
  策略研究团队基于保守型、谨慎型、稳健型、积极型、激进型五种投资风格，配置国内权益类、固定收益类、
  货币类三大资产类别的投资比例生成三大类资产配置方案，且每月更新一次配置方案。
  针对三大类资产配置方案中五种不同风格的投资组合基准，计算账户投资组合的超额收益，即得到Brison归因结果。`,
  `针对与客户风险承受能力相匹配的配置基准，计算得到每月账户资产配置业绩=（账户权益类产品权重-基准权益产品权重）*沪深300指数+
  （账户固收类产品权重-基准固收类产品权重）*中证全债指数+（账户现金类产品权重-基准现金类产品权重）*中证货币型基金指数，即Brison归因趋势。`,
];

// 账户收益走势
const ACCOUNT_PROFIT_TREND = '账户收益走势';
// 账户收益走势简介
const PROFIT_TREND_SUMMARY = '账户日收益率用于衡量账户当日的收益情况；账户累计收益率用于衡量统计期期初至当日期间的收益情况。';
// 账户收益走势计算方法
const PROFIT_TREND_COMPUTE_METHOD1 = '账户日收益率=账户当日收益/（账户前一日日资产+当日净流入），当日净流入为负，则取零计算。';
const PROFIT_TREND_COMPUTE_METHOD2 = '账户累计收益率=账户区间收益/（账户前一日日资产+ 账户区间的最大成本），其中最大成本为历史累计净流入最大值；当日净流入为负，则取零计算。';

const ACCUMULATED_PROFIT = '累计盈利额（元）';
const STOCKPERIOD_UPDOWN = '股票期间涨跌';
const SHAREHOLDING_YIELD = '持股收益率';

export {
  endDateOfLastMonth,
  lastYearDataOfLastMonth,
  profitAbilityLevelList,
  FUND_INVEST,
  ASSET_MARKET,
  assetChangeChartTip,
  ACCOUNT_DAILY_RATE,
  HS300_DAILY_RATE,
  ACCOUNT_CUMULATIVE_RATE,
  HS300_CUMULATIVE_RATE,
  profitTrendChartTip,
  NOT_EXCESS_BENEFIT_TEXT,
  EXCESS_BENEFIT_TEXT,
  chartOption,
  EQUITY_TYPE,
  SOLID_RECOVERY_TYPE,
  CURRENCY_TYPE,
  attributionTableColumns,
  ACCUMULATED_PROFIT,
  STOCKPERIOD_UPDOWN,
  SHAREHOLDING_YIELD,
  ATTRIBUTION_INVEST_STYLE_LIST,
  ATTRIBUTION_INVEST_TITLE,
  SUMMARY,
  COMPUTE_METHOD,
  ATTRIBUTION_SUMMARY_LIST,
  ATTRIBUTION_COMPUTE_METHOD_LIST,
  ACCOUNT_PROFIT_TREND,
  PROFIT_TREND_SUMMARY,
  PROFIT_TREND_COMPUTE_METHOD1,
  PROFIT_TREND_COMPUTE_METHOD2,
};
