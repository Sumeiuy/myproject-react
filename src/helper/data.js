/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:23:58
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-22 15:08:30
 * @description 此处存放通用的数据格式/类型处理的方法
 */

const data = {
  /**
   * 计算字符串的字节长度
   * @param {String} str 需要计算长度的字符串
   * @returns {Number}
   */
  getStrLen(str) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      // 单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        len++;
      } else {
        len += 2;
      }
    }
    return len;
  },

  /**
   * 查找object上某个链式属性的值
   * 类似于在对象a上查找 b.c.d的值，即返回 a.b.c.d的值
   * @author sunweibin
   * @param {Object} object 查找的基对象数据
   * @param {String} chain key值得链式字符串
   */
  getChainPropertyFromObject(object, chain) {
    const paths = chain.split('.');
    let property = object[paths.shift()];
    while (paths.length) {
      if (property === null || property === undefined) {
        return property;
      }
      property = property[paths.shift()];
    }
    return property;
  },

  /**
   * 将CustRange转换成一维数组
   * @param {Array} arr CustRange机构树
   */
  convertCustRange2Array(arr) {
    let tmpArr = arr.slice();
    arr.forEach((v) => {
      if (v.children) {
        tmpArr = [...tmpArr, ...v.children];
      }
    });
    return tmpArr;
  },
};

export default data;
