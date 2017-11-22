/**
 * @Author: sunweibin
 * @Date: 2017-11-22 15:11:41
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-22 15:16:44
 * @description 此处存放不能放到其他分类中去的一些系统性的方法
 */

// 是否可以使用浏览器Console打印日志
const canUseConsoleFlag = true;

const os = {
  /**
   * 将字符串添加到剪贴板中
   * @author sunweibin
   * @param  {string} value 需要将复制的字符串
   */
  copyToClipBoard(value) {
    // 选中元素中的文本
    const selectElementText = (element) => {
      if (document.selection) {
        const range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
      } else if (window.getSelection) {
        const range = document.createRange();
        range.selectNode(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
    };
    const element = document.createElement('DIV');
    element.textContent = value;
    document.body.appendChild(element);
    selectElementText(element);
    document.execCommand('copy');
    element.remove();
  },

  /**
   * 日志工具log
   * @param {*} rest
   */
  log(...rest) {
    if (canUseConsoleFlag) {
      console.log(rest);
    }
  },
  /**
   * 日志工具warn
   * @param {*} rest
   */
  warn(...rest) {
    if (canUseConsoleFlag) {
      console.warn(rest);
    }
  },
  /**
   * 日志工具error
   * @param {*} rest
   */
  error(...rest) {
    if (canUseConsoleFlag) {
      console.warn(rest);
    }
  },
};

export default os;
