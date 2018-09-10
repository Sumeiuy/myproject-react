/**
 * @Author: sunweibin
 * @Date: 2017-11-22 13:38:29
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-07-10 15:43:51
 * @description 此处存放针对数字的通用处理方法
 */
import _ from 'lodash';
import { thousandInteger, thousandDecimal } from './regexp';
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
  hundred,
  thousand,
  wan,
  million,
  yi,
  billion,
  trillion,
  percent,
  permillage,
  /**
   * 数字格式化
   * @author sunweibin
   * @param {String|Number} no 需要进行千分位格式化的数字或者数字字符串
   * @param {String} thousandSeq=',' 千分位格式化符号
   * @param {Boolean} decimalNeedFormat=true 小数部分是否进行格式化
   * @param {Boolean} isRemoveZero=false 小数部分多余的0是否移除
   * @returns {String|null} 格式化后的字符串
   */
  thousandFormat(no = 0, decimalNeedFormat = true, thousandSeq = ',', isRemoveZero) {
    let numberString = String(no);
    if (isRemoveZero) {
      if (/\./.test(numberString)) {
        numberString = numberString.replace(/0*$/, '').replace(/\.$/, '');
      }
    }
    const replacement = `$1${thousandSeq}`;
    // 将数字差分成整数部分和小数部分
    const nArr = numberString.split('.');
    const itegerF = nArr[0].replace(thousandInteger, replacement);
    let decimalF = !_.isEmpty(nArr[1]) && nArr[1].replace(thousandDecimal, replacement);
    if (!decimalNeedFormat) {
      decimalF = !_.isEmpty(nArr[1]) && nArr[1];
    }
    if (!decimalF) {
      decimalF = '';
    } else {
      decimalF = `.${decimalF}`;
    }
    return `${itegerF}${decimalF}`;
  },

  /**
   * 数字取小数点后几位
   * @author Liujianshu
   * @param {String|Number} 需要操作的数字
   * @param {String|Number} 需要取小数点后几位，默认为两位
   * @returns {String} 格式化后的字符串
   */
  toFixed(value = '', length = 2) {
    let newValue = value;
    if (_.isNumber(newValue)) {
      newValue = newValue.toFixed(length);
      // 数字过小时，取两位小数可能等于 0 ，等于 0 时，显示 0.00
      if (Math.abs(newValue) === 0) {
        newValue = '0.00';
      }
    }
    return newValue;
  },
};

export default number;
export { hundred, thousand, wan, million, yi, billion, trillion, percent, permillage };

export const {
  thousandFormat,
  toFixed,
} = number;
