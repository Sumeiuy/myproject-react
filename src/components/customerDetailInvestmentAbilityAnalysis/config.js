/*
 * @Author: zhangjun
 * @Date: 2018-11-20 14:30:09
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-22 16:34:23
 */

import moment from 'moment';

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

const investmentAbilityAnalysis = {
  endDateOfLastMonth,
  lastYearDataOfLastMonth,
  profitAbilityLevelList,
};



export default investmentAbilityAnalysis;
export {
  endDateOfLastMonth,
  lastYearDataOfLastMonth,
  profitAbilityLevelList,
};
