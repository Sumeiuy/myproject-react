/*
 * @Author: zhangjun
 * @Date: 2018-12-08 15:34:15
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-08 21:02:26
 * @description 风控能力分析配置项
 */

// Tab列表
const TAB_LIST = [
  {
    tabName: '年化波动率',
    key: '1',
  },
  {
    tabName: '年化夏普比率',
    key: '2',
  },
];

// TabKey值集合
const TabKeys = {
  // 年化波动率
  WAVERATE: '1',
  // 年化夏普比率
  SHARP_RATE: '2',
};

// 账户风险收益对比
const RISK_PROFIT_CONTRAST = '账户风险收益对比';

// 年化波动率
const WAVERATE = '年化波动率';

// 年化波动率简介
const WAVERATE_SUMMARY = `年化波动率是账户收益的波动程度，是对资产收益率不确定性的衡量，从一定程度上可反应金融资产的风险水平。
  年化波动率越高，表明该账户日收益率在统计期内波动越剧烈，账户资产收益率的不确定性就越强；波动率越低，
  表明该账户日收益率在统计期波动越平缓，账户资产收益的确定性就越强。`;

// 年化波动率计算方法
const WAVERATE_COMPUTE_METHOD_DATA = {
  WAVERATE_COMPUTE_METHOD1: '计算波动率，即计算账户日收益率关于其均值的平均偏差（又称标准差），其中',
  WAVERATE_COMPUTE_METHOD2: '为统计期内每日日收益率的平均值；n为统计期总日期数。',
};

// 年化夏普比率
const SHARP_RATE = '年化夏普比率';

// 年化夏普比率简介
const SHARP_RATE_SUMMARY = `夏普比率是指统计期内，组合的平均收益率中超过无风险收益率的部分与该组合收益率的标准差之比，
衡量的是单位风险下该账户配置所创造收益的能力。
夏普比率即投资回报与多承担风险的比例，其值越高，表明投资组合越佳。`;

// 年化夏普比率计算方法
const SHARP_RATE_COMPUTE_METHOD_DATA = {
  SHARP_RATE_COMPUTE_METHOD1: '计算夏普比率，其中',
  SHARP_RATE_COMPUTE_METHOD2: '为统计期间无风险利率（指将资金投资于某一项没有任何风险的投资对象而能得到的利息率，此处取定存无风险利率）；',
  SHARP_RATE_COMPUTE_METHOD3: '为账户的日收益率均值；',
  SHARP_RATE_COMPUTE_METHOD4: '为账户的日收益率标准差。',
};

// 最大回撤比率简介
const RETREAT_SUMMARY = `回撤比率用于衡量变量从历史峰值衰减的剧烈程度，常针对金融行业投资组合的累计收益或净资产计算，
一定程度上反应投资组合的抗风险能力。最大回撤比率即在统计期内衰减程度最大值`;

// 最大回撤比率计算方法
const RETREAT_COMPUTE_METHOD = '最大回撤比率=max（Di-Dj）/Di，其中Di为第i天的资产单位净值，Dj为第j天的资产单位净值。';

export {
  TAB_LIST,
  TabKeys,
  RISK_PROFIT_CONTRAST,
  WAVERATE,
  WAVERATE_SUMMARY,
  WAVERATE_COMPUTE_METHOD_DATA,
  SHARP_RATE,
  SHARP_RATE_SUMMARY,
  SHARP_RATE_COMPUTE_METHOD_DATA,
  RETREAT_SUMMARY,
  RETREAT_COMPUTE_METHOD,
};
