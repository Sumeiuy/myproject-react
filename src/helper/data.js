/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:23:58
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2017-12-22 20:02:11
 * @description 此处存放通用的数据格式/类型处理的方法
 */
import _ from 'lodash';

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
   * 递归遍历组织机构树
   * @param {Array} orgArr 组织机构数
   * @param {*} func 对组织机构数进行的处理
   */
  walk(orgArr, func, parent) {
    func(orgArr, parent);
    if (Array.isArray(orgArr)) {
      const childrenLen = orgArr.length;
      for (let i = 0; i < childrenLen; i++) {
        const children = orgArr[i].children;
        data.walk(children, func, orgArr[i]);
      }
    }
  },

  /**
   * 提取组织机构数中的信息
   * @param {Array} orgArr 组织机构树
   */
  pickOrgInfo(prev, next) {
    const newPrev = [...prev];
    const { children, ...reset } = next;
    newPrev.push(reset);
    return newPrev;
  },

  /**
   * 将CustRange转换成一维数组
   * @param {Array} arr CustRange机构树
   */
  convertCustRange2Array(arr) {
    let tmpArr = [];
    function reduce(orgArr) {
      const result = _.reduce(orgArr, data.pickOrgInfo, []);
      tmpArr = [...tmpArr, ...result];
    }
    data.walk(arr, reduce);
    return tmpArr;
  },

  /**
   * 数字转换成26个字母，1输出A
   * @param {*number} num 需要转换的数字
   */
  convert(num) {
    const result = [];
    let n = num;
    while (n) {
      let t = n % 26;
      if (!t) {
        t = 26;
        --n;
      }
      result.push(String.fromCodePoint(t + 64));
      n = ~~(n / 26); // eslint-disable-line
    }
    return result.reverse().join('');
  },
};

export default data;
