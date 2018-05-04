/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:16:02
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-30 16:09:08
 * @description 此处存放通用的正则表达式
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
  /**
   * 整数部分千分位格式化的正则表达式
   * 例子：12345604 => 12,345,604
   */
  thousandInteger: /(\d{1,3})(?=(\d{3})+(?:$|\D))/g,
  /**
   * 小数部分千分位格式化的正则表达式
   * 例子： 12345604 => 123,456,04
   */
  thousandDecimal: /(\d{3})(?=(\d{1,3})+)/g,
  /**
   * 正整数
   */
  positiveInteger: /^\+?[1-9][0-9]*$/,
  /**
   * desc: 将pathname分割成集合
   * pathname: '/a/b/c'
   * ['/a', '/b', '/c']
   */
  matchPathList: /\/([^/]*)(?=(\/|$))/g,
  /**
   * @desc: 全量匹配内容中的换行符
   * window换行: \r\n
   * Unix和OS X : \n
   * Classic Mac: \r
   * */
  returnLine: /[\n\r]/g,
  /**
   * @desc：全量匹配文本中的URL
   * 至汉字、空格 结束
   */
  url: /((?:https?:\/\/)|(?:www\.))[0-9A-Za-z.]+(\/?[^\s\u4e00-\u9fa5/\r\n]*)*/g,
};

export default regexp;
