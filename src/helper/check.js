/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:17:50
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-15 11:02:18
 * @description 此处存放与校验相关的公用方法(非直接与正则表达式相关)
 */
import reg from './regexp';

const check = {
  /**
   * 判断单个字符是否中文
   * @author sunweiibin
   * @param {String} char 需要进行判断的单个字符
   * @returns {Boolean}
   */
  isChinese(char) {
    return reg.chinese.test(char);
  },

  // 判断是否为瞄准镜标签
  isSightingTelescope(str) {
    return str.indexOf('J') === 0;
  },
  /**
   * 判断一个值是否为空，null || undefined || 'null' || ''
   * @author sunweibin
   * @param {*} v 传递的值
   * @returns {Boolean}
   */
  isNull(v) {
    if (v === null || v === 'null' || v === '' || v === undefined || v === 'undefined') {
      return true;
    }
    return false;
  },
  /**
   * 判断一个字符串是否手机号码
   * @author sunweibin
   * @param {String} v 要验证的字符串
   */
  isCellPhone(v) {
    return reg.cellPhone.test(v);
  },
  /**
   * 判断一个字符串是否座机
   * @author sunweibin
   * @param {String} v 要验证的字符串
   */
  isTelPhone(v) {
    return reg.tellPhone.test(v);
  },
  /**
   * 判断一个字符串是否电子邮箱
   * @author sunweibin
   * @param {String} v 要验证的字符串
   */
  isEmail(v) {
    return reg.email.test(v);
  },

  /**
   * 判断一个字符串是否符合统一社会信用码的格式
   * @author sunweibin
   * @param {String} v 要验证的字符串
   * @return {Boolean}
   */
  isUnifiedSocialCreditCode(v) {
    return reg.uscc.test(v);
  },

  /**
   * 判断一个字符串是否符合18位身份证号码的格式
   * @author sunweibin
   * @param {String} v 要验证的字符串
   * @return {Boolean}
   */
  is18gitiIDCardCode(v) {
    return reg.idNo18Digit.test(v);
  },

  /**
   * 判断一个字符串是否符合15位身份证号码的格式
   * @author sunweibin
   * @param {String} v 要验证的字符串
   * @return {Boolean}
   */
  is15gitiIDCardCode(v) {
    return reg.idNo15Digit.test(v);
  },
  /**
   * 判断一个字符串是否只含有字母和数字
   * @author sunweibin
   * @param {String} v 要验证的字符串
   * @return {Boolean}
   */
  isOnlyAlphabetAndNumber(v) {
    return reg.onlyAlphabetAndNumber.test(v);
  },
};

export default check;
