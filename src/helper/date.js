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
  if (!start || !end) {
    return '0秒';
  }
  // 毫秒间隔
  const intervalMs = end - start;
  if (!intervalMs) {
    return '0秒';
  }
  const duration = moment('000000', 'HHmmss').add(intervalMs, 'ms');
  if (intervalMs <= 60 * 1000) {
    return duration.format('ss秒');
  }
  if (intervalMs <= 60 * 60 * 1000) {
    return duration.format('mm分ss秒');
  }
  return duration.format('HH时mm分ss秒');
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

const exported = {
  calculateDuration,
  generateDate,
};

export default exported;
export { calculateDuration, generateDate };
