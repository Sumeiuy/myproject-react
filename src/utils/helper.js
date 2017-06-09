/**
 * @file utils/helper.js
 *  常用工具方法
 * @author maoquan(maoquan@htsc.com)
 */

import bowser from 'bowser';
import moment from 'moment';

import constants from '../config/constants';

function getOS() {
  const osList = ['mac', 'windows', 'windowsphone'];
  for (let i = 0, len = osList.length; i < len; i++) {
    const os = osList[i];
    if (bowser[os]) {
      return os;
    }
  }
  return 'unknown';
}

const helper = {

  // 获取 empId
  getEmpId() {
    // 临时 ID
    const tempId = '002727';
    const nativeQuery = helper.getQuery(window.location.search);
    const empId = window.curUserCode || (nativeQuery.empId || tempId);
    return empId;
  },
  /**
   * 将{ a: 1, b: 2 } => a=1&b=2
   * @param {object} query
   */
  queryToString(query = {}) {
    const encode = encodeURIComponent;
    return Object.keys(query).map(
      key => (`${encode(key)}=${encode(query[key])}`),
    ).join('&');
  },

  /**
   * 由?a=1&b=2 ==> {a:1, b:2}
   * @param {string} search 一般取自location.search
   */
  getQuery(search) {
    const query = {};
    // 去掉`?`
    const searchString = search.slice(1);
    if (searchString) {
      searchString.split('&').map(
        item => item.split('='),
      ).forEach(
        item => (query[item[0]] = item[1]),
      );
    }
    return query;
  },

  isLocalStorageSupport() {
    const KEY = 'STORAGE_TEST_KEY';
    try {
      localStorage.setItem(KEY, KEY);
      localStorage.removeItem(KEY);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * 获取属性的属性值
   * 针对类似 `a.b.c` 的命名路径，获取最后的 `c` 的属性
   *
   * @param {object} object 要获取值的对象
   * @param {string} name 属性名
   * @return {*}
   */
  getProperty(object, name) {
    const paths = name.split('.');
    let property = object[paths.shift()];

    while (paths.length) {
      if (property === null || property === undefined) {
        return property;
      }
      property = property[paths.shift()];
    }

    return property;
  },


  hasClass(elem, className) {
    return elem.className.indexOf(className) > -1;
  },
  /**
     * toUnit('123456', '元', 5) => {vale: 12.34, unit:'万元'}
     * @param  { string } str  需要转换的字符串数字
     * @param  { string } unit 单位
     * @return { number } per  以显示几位为转换依据，默认 5 位
  */
  toUnit(value, unit, per = 5) {
    const obj = {};
    if (Number(value)) {
      // 如果是 %
      if (unit === '%') {
        obj.value = Number.parseFloat((value * 100).toFixed(2));
        obj.unit = unit;
      } else if (unit === '\u2030') {
        // 如果是 千分符
        obj.value = Number.parseFloat((value * 1000).toFixed(2));
        obj.unit = unit;
      } else {
        // 分割成数组
        const arr = value.toString().split('.');
        // 取出整数部分长度
        const length = arr[0].length;
        // 整数部分大于等于 依据 长度
        if (length >= per) {
          // 按照依据长度取出 依据 数字，超出长度以 0 补足
          const num = arr[0].substr(0, per) + arr[0].substr(per).replace(/\d/g, '0');
          switch (true) {
            case length < 9:
              obj.value = `${Number.parseFloat((num / 10000).toFixed(2))}`;
              obj.unit = `万${unit}`;
              break;
            case length >= 9 && length < 13:
              obj.value = `${Number.parseFloat((num / 100000000).toFixed(2))}`;
              obj.unit = `亿${unit}`;
              break;
            default:
              obj.value = `${Number.parseFloat((num / 1000000000000).toFixed(2))}`;
              obj.unit = `万亿${unit}`;
              break;
          }
        } else {
          // 计算小数部分长度
          // 如果有小数，小数部分取 依据 长度减整数部分长度
          if (arr[1]) {
            arr[1] = arr[1].substr(0, 2);
          }
          obj.value = arr.join('.');
          obj.unit = unit;
        }
      }
    } else {
      obj.value = '暂无';
      obj.unit = '';
    }
    return obj;
  },

  /**
   * 将字符串添加到剪贴板中
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

  getEnv() {
    // $app_version 字符串 应用的版本
    // $os 字符串 操作系统，例如iOS
    // $screen_height  数值  屏幕高度，例如1920
    // $screen_width 数值  屏幕宽度，例如1080
    // $browser  字符串 浏览器名，例如Chrome
    // $browser_version  字符串 浏览器版本，例如Chrome 45
    return {
      $app_version: constants.version,
      $os: getOS(),
      $screen_width: screen.width,
      $screen_height: screen.height,
      $browser: bowser.name,
      $browser_version: `${bowser.name} ${bowser.version}`,
    };
  },

  getDurationString(cycleType) {
    let durationEnd = '';
    let durationStart = '';
    switch (cycleType) {
      case 'beforeLastMonth':
        durationStart = moment().subtract(2, 'month').startOf('month');
        durationEnd = moment().subtract(2, 'month').endOf('month');
        break;
      case 'lastMonth':
        durationStart = moment().subtract(1, 'month').startOf('month');
        durationEnd = moment().subtract(1, 'month').endOf('month');
        break;
      default:
        durationStart = moment().startOf(cycleType);
        durationEnd = moment();
        break;
    }
    const duration = {
      cycleType,
      durationStr: `${durationStart.format('YYYY/MM/DD')}-${durationEnd.format('YYYY/MM/DD')}`,
      begin: durationStart.format('YYYYMMDD'),
      end: durationEnd.format('YYYYMMDD'),
    };
    return duration;
  },
};

export default helper;
