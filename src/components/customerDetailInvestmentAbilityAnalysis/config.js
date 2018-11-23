/*
 * @Author: zhangjun
 * @Date: 2018-11-20 14:30:09
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-23 18:59:28
 */

import moment from 'moment';

// 资金投入
const FUND_INVEST = '资金投入';

// 资产市值
const ASSET_MARKET = '资产市值';

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

const assetChangeChartTip = [
  '1.上图为统计期内资金投入与资产市值的变化情况。',
  '2. 期初资产为统计期前一日资产市值。',
  '3. 资金投入为每日累计净流入值。',
];

const investmentAbilityAnalysis = {
  endDateOfLastMonth,
  lastYearDataOfLastMonth,
  profitAbilityLevelList,
  FUND_INVEST,
  ASSET_MARKET,
  assetChangeChartTip,
};



export default investmentAbilityAnalysis;
export {
  endDateOfLastMonth,
  lastYearDataOfLastMonth,
  profitAbilityLevelList,
  FUND_INVEST,
  ASSET_MARKET,
  assetChangeChartTip,
};
