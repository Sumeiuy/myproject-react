/*
 * @Author: zuoguangzu
 * @Date: 2018-11-08 14:56:43
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-11-13 20:42:13
 */

import moment from 'moment';

 // 日期格式
const dateFormat = 'YYYY-MM-DD';
 // 筛选项默认开始时间
const defaultStartTime = moment().subtract(61, 'days').format(dateFormat) + ' 00:00';
// 筛选项默认结束时间
const defaultEndTime = moment().subtract(1, 'days').format(dateFormat) + ' 23:59';

export {
  defaultStartTime,
  defaultEndTime
};
