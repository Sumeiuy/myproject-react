/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:08:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-22 15:10:10
 * @description 此处存放公用的事件相关的方法
 */
const event = {
  /**
   * 给DOM元素添加滚轮事件
   * @param {HTMLElement} ele DOM元素
   * @param {Function} handler 事件回调函数
   */
  addWheelEvent(ele, handler) {
    ele.addEventListener('wheel', handler, false);
    ele.addEventListener('mousewheel', handler, false);
    ele.addEventListener('DOMMouseScroll', handler, false);
  },
  /**
   * 移除DOM元素的滚轮事件
   * @param {HTMLElement} ele DOM元素
   * @param {Function} handler 事件回调函数
   */
  removeWheelEvent(ele, handler) {
    ele.removeEventListener('wheel', handler);
    ele.removeEventListener('mousewheel', handler);
    ele.removeEventListener('DOMMouseScroll', handler);
  },
  /**
   * 给DOM元素添加点击事件
   * @param {HTMLElement} ele DOM元素
   * @param {Function} handler 事件回调函数
   */
  addClickEvent(ele, handler) {
    ele.addEventListener('click', handler, false);
  },
  /**
   * 移除DOM元素的点击事件
   * @param {HTMLElement} ele DOM元素
   * @param {Function} handler 事件回调函数
   */
  removeClickEvent(ele, handler) {
    ele.removeEventListener('click', handler);
  },

  /**
   * 模拟鼠标点击事件
   * @param  ele 触发事件的html节点
   * @param  eventType 事件类型 例如 ‘click’
   * @param  canBubble  canBubble
   * @param  cancelable 是否可以用 preventDefault() 方法取消事件。
   */
  trigger(ele, eventType, canBubble = true, cancelable = true) {
    const evt = document.createEvent('MouseEvent');
    evt.initEvent(eventType, canBubble, cancelable);
    ele.dispatchEvent(evt);
  },
};

export default event;
