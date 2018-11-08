/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:23:58
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-06 15:26:09
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
  convertNumToLetter(num) {
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

  /**
   * 将数字转成成百分比
   * @param {*number} num 当前需要转换的数字
   * @param {*} toFixedNum 当前需要保留的位数
   */
  toPercent(num, toFixedNum = 0) {
    return `${(Math.round(num * 10000) / 100).toFixed(toFixedNum)}%`;
  },

  /**
   *
   * 给数组data补足时使用空行数据补足，用于在表格上默认显示几行
   * @param {Array} data 原始数据
   * @param {number} [padNum=10]
   */
  padEmptyDataForList(data = [], padNum = 10) {
    const size = _.size(data);
    if (size >= padNum) {
      return data;
    }
    let emptyRowNum = padNum - size;
    let newData = [...data];
    while (emptyRowNum > 0) {
      const uuid = this.uuid();
      newData.push({
        // 空白行标志
        flag: true,
        key: `empty_row_${uuid},`
      });
      --emptyRowNum;
    }
    return newData;
  },

  /**
   * 生成一个唯一的ID值
   * @param {*} len
   * @param {*} radix
   */
  uuid(len = 8, radix = 16) {
    /* eslint-disable */
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const uuid = [];

    if (len) {
      // Compact form
      for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
     // rfc4122, version 4 form
      let r;

     // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

     // Fill in random data. At i==19 set the high bits of clock sequence as
     // per rfc4122, sec. 4.1.5
      for (let i = 0; i < 36; i++) {
        if (!uuid[i]) {
         let r = 0 | Math.random() * 16;
         uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
       }
      }
    }

    return uuid.join('');
    /* eslint-enable */
  },
};

export default data;

export const {
  getStrLen,
  walk,
  pickOrgInfo,
  convertCustRange2Array,
  convertNumToLetter,
  toPercent,
  uuid,
} = data;
