/*
 * @Author: zuoguangzu
 * @Date: 2018-11-08 14:56:43
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-11-14 21:30:05
 */

import moment from 'moment';

 // 日期格式
const dateFormat = 'YYYY-MM-DD';
 // 筛选项默认开始时间
const defaultStartTime = moment().subtract(61, 'days').format(dateFormat);
// 筛选项默认结束时间
const defaultEndTime = moment().subtract(1, 'days').format(dateFormat);

const typeOption = [
  {
    key: '',
    value: '不限'
  },
  {
    key: '1',
    value: '自定义投资建议'
  },
  {
    key: '2',
    value: '投顾个性化信息',
  },
];

export {
  defaultStartTime,
  defaultEndTime,
  typeOption,
};
