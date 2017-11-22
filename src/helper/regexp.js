/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:16:02
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-22 14:31:22
 * @description 此处存放与正则表达式相关的校验公用方法
 */
const regexp = {
  /**
   * 中文字符的正则表达式
   */
  chinese: /[\u4e00-\u9fa5]/g,
  /**
   * 手机号码的正则表达式
   */
  cellPhone: /^((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-8]{1})|(18[0-9]{1}))+\d{8}$/,
  /**
   * 座机号码的正则表达式
   */
  tellPhone: /^(00?[0-9]{2,3}-?)?([2-9][0-9]{6,7})(-[0-9]{1,8})?$/,
  /**
   * 电子邮箱的正则表达式
   */
  email: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
};

export default regexp;
