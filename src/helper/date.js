/**
 * @Author: wangjunjun
 * 日期相关
 */

/**
 * 计算两个时间的差距
 * start 开始时间的时间戳
 * end   结束时间的时间戳
 */
function calculateDuration(start, end) {
  const duration = end - start;
  const dayDuration = Math.floor(duration / (24 * 3600 * 1000));
  // 计算天数后剩余的毫秒数
  const msecOfDay = duration % (24 * 3600 * 1000);
  const hourDuration = Math.floor(msecOfDay / (3600 * 1000));
  // 计算小时数后剩余的毫秒数
  const msecOfHour = msecOfDay % (3600 * 1000);
  const minuteDuration = Math.floor(msecOfHour / (60 * 1000));
  // 计算分钟数后剩余的毫秒数
  const msecOfMinute = msecOfHour % (60 * 1000);
  const secondDuration = Math.round(msecOfMinute / 1000);

  if (dayDuration !== 0) {
    return `${dayDuration}天${hourDuration}时${minuteDuration}分${secondDuration}秒`;
  }
  if (hourDuration !== 0) {
    return `${hourDuration}时${minuteDuration}分${secondDuration}秒`;
  }
  if (minuteDuration !== 0) {
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
