/**
 * @Author: wangjunjun
 * 日期相关
 */

import moment from 'moment';

/**
 * 计算两个时间的差距
 * start 开始时间的时间戳
 * end   结束时间的时间戳
 */
function calculateDuration(start, end) {
  const duration = moment('000000', 'HHmmss').add(end - start, 'ms');
  const hourDuration = duration.format('HH');
  const minuteDuration = duration.format('mm');
  const secondDuration = duration.format('ss');
  if (hourDuration !== '00') {
    return `${hourDuration}时${minuteDuration}分${secondDuration}秒`;
  }
  if (minuteDuration !== '00') {
    return `${minuteDuration}分${secondDuration}秒`;
  }
  return `${secondDuration}秒`;
}
/**
 * 生成年月日
 * @param {*} momentTime:moment() 时间
 */
function generateDate(momentTime) {
  const year = momentTime.get('Y');
  const month = momentTime.get('M') + 1;
  const day = momentTime.get('D');
  return `${year}年${month}月${day}日`;
}

export default {
  calculateDuration,
  generateDate,
};
