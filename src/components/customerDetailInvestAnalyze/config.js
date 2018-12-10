/*
 * @Author: zhangjun
 * @Date: 2018-11-20 14:30:09
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-12-10 09:33:53
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
      formatter: '{value}%',
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
};
