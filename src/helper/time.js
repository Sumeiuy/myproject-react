/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:13:53
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-27 16:21:25
 * @description 此处存放与时间相关的公用方法
 */
import moment from 'moment';

const time = {
  /**
   * 将时间格式字符串修改为YYYY-MM-DD格式
   * @author sunweibin
   * @param {String} str 后端接口返回的时间格式字符串
   * @param {String} formatter='YYYY-MM-DD' 需要装换成的时间格式
   * @returns {String} 格式化后的时间字符串
   */
  format(str, formatter = 'YYYY-MM-DD') {
    let date = '';
    if (str) {
      date = moment(str).format(formatter);
    }
    return date;
  },
  /**
   * 获取今天是周几
   * @author sunweibin
   * @param {Number| Date} d Date对象或者是数字(0,1,2,3,4,5,6)
   */
  weekDay(d) {
    const weekLocals = ['日', '一', '二', '三', '四', '五', '六'];
    if (typeof d === 'number') return `周${weekLocals[d]}`;
    return `周${weekLocals[d.getDay()]}`;
  },
};

export default time;
