/**
 * @Author: sunweibin
 * @Date: 2017-11-22 13:38:29
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-27 16:13:20
 * @description 此处存放针对数字的通用处理方法
 */
import _ from 'lodash';
import reg from './regexp';
// 百
const hundred = 100;
// 千
const thousand = 1000;
// 万
const wan = 10000;
// 百万
const million = 1000000;
// 亿
const yi = 100000000;
// 十亿
const billion = 100000000;
// 万亿
const trillion = 1000000000000;
// 百分号
const percent = '%';
// 千分号
const permillage = '\u2030';

const number = {
  /**
   * 数字格式化
   * @author sunweibin
   * @param {String|Number} no 需要进行千分位格式化的数字或者数字字符串
   * @param {String} thousandSeq=',' 千分位格式化符号
   * @returns {String|null} 格式化后的字符串
   */
  thousandFormat(no, thousandSeq = ',') {
    if (_.isEmpty(no)) return null;
    const replacement = `$1${thousandSeq}`;
    // 将数字差分成整数部分和小数部分
    const nArr = String(no).split('.');
    const itegerF = nArr[0].replace(reg.thousand_integer, replacement);
    let decimalF = !_.isEmpty(nArr[1]) && nArr[1].replace(reg.thousand_decimal, replacement);
    if (!decimalF) {
      decimalF = '';
    } else {
      decimalF = `.${decimalF}`;
    }
    return `${itegerF}${decimalF}`;
  },
};

export default number;
export {
  hundred,
  thousand,
  wan,
  million,
  yi,
  billion,
  trillion,
  percent,
  permillage,
};
