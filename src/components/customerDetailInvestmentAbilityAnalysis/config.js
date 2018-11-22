/*
 * @Author: zhangjun
 * @Date: 2018-11-20 14:30:09
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-21 17:07:04
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
  },
  {
    level: 1,
    levelName: '较弱',
  },
  {
    level: 2,
    levelName: '较强',
  },
  {
    level: 3,
    levelName: '强',
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
