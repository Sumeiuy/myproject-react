/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:45:29
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-12-14 10:08:42
 * @description 此处存放与DOM相关(除事件绑定)的公用方法
 */
import _ from 'lodash';

const dom = {
  /**
   * 获取DOM节点的某个CSS属性的最终值
   * @author sunweibin
   * @param {HTMLElement} ele DOM节点元素
   * @param {String} css 需要获取的CSS属性值
   * @returns {String}
   */
  getCssStyle(ele, css) {
    return window.getComputedStyle(ele, null).getPropertyValue(css);
  },

  /**
   * 查找某个DOM元素上是否存在该类名
   * @author sunweibin
   * @param {HTMLElement} elem 需要查找的DOM元素
   * @param {String} cls 类名
   */
  hasClass(elem, cls) {
    return elem.className.indexOf(cls) > -1;
  },

  /**
   * 给DOM元素添加一个CSS class
   * @author sunweibin
   * @param {HTMLElement} elem 需要查找的DOM元素
   * @param {String} className 类名
   */
  addClass(elem, cls) {
    const ele = elem;
    if (!dom.hasClass(ele, cls)) {
      const oldCls = ele.className;
      ele.className = _.isEmpty(oldCls) ? cls : `${oldCls} ${cls}`;
    }
  },

  /**
   * 删除DOM元素上的某个class类名
   * @author sunweibin
   * @param {HTMLElement} elem 需要查找的DOM元素
   * @param {String} cls 类名
   */
  removeClass(elem, cls) {
    const ele = elem;
    if (dom.hasClass(ele, cls)) {
      const oldCls = ` ${ele.className} `;
      const newCls = oldCls.replace(` ${cls} `, ' ');
      ele.className = newCls.trim();
    }
  },

  /**
   * 给DOM元素添加自定义属性
   * @author sunweibin
   * @param {HTMLElement} ele DOM圆度
   * @param {String} key 属性的键
   * @param {*} value 属性的值
   */
  setAttribute(ele, key, value) {
    ele.setAttribute(key, value);
  },

  /**
   * 给DOM元素设置 style 属性
   * @author sunweibin
   * @param {HTMLElement} ele DOM元素
   * @param {String} prop 属性名称
   * @param {String} value 属性的值
   */
  setStyle(ele, prop, value) {
    const tempEle = ele;
    if (ele) {
      tempEle.style[prop] = value;
    }
  },
};

export default dom;
