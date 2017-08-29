/**
 * @file utils/helper.js
 *  常用工具方法
 * @author maoquan(maoquan@htsc.com)
 */

import moment from 'moment';
import bowser from 'bowser';
import _ from 'lodash';

import { ZHUNICODE, constants } from '../config';

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
  // 获取元素CSS的样式
  getCssStyle(ele, css) {
    return window.getComputedStyle(ele, null).getPropertyValue(css);
  },

  // 计算字符串长度
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

  // 获取 empId
  getEmpId() {
    // 临时 ID
    const tempId = '001423';
    const nativeQuery = helper.getQuery(window.location.search);
    const empId = window.curUserCode || nativeQuery.empId || tempId;
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
     * @return { bool } isCommissionRate  对佣金率指标作特殊处理
  */
  toUnit(value, unit, per = 5, isCommissionRate) {
    const PERCENT = ZHUNICODE.PERCENT;
    const PERMILLAGE = ZHUNICODE.PERMILLAGE;
    const obj = {};
    let minus = '';
    // 如果 value 有值
    if (value) {
      if (value === 'null') {
        // value 没值
        obj.value = '暂无';
        obj.unit = '';
      } else {
        let newValue = Number(value);
        // 如果 newValue 是负数
        if (newValue < 0) {
          minus = '-';
          newValue = Math.abs(newValue);
        }
        // 如果 value 的值是 0
        if (newValue === 0) {
          obj.value = newValue;
          obj.unit = unit;
        } else if (newValue < 1) {
          // 如果 value 的值小于 0
          // 如果 单位是 %
          obj.unit = unit;
          if (unit === PERCENT) {
            obj.value = Number.parseFloat((newValue * 100).toFixed(isCommissionRate ? 3 : 2));
          } else if (unit === PERMILLAGE) {
            // 如果是 千分符
            obj.value = Number.parseFloat((newValue * 1000).toFixed(isCommissionRate ? 3 : 2));
          } else {
            // 其他情况均保留两位小数
            obj.value = Number.parseFloat(newValue.toFixed(2));
          }
        } else {
          // 分割成数组
          const arr = newValue.toString().split('.');
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
            let tempValue;
            if (arr[1]) {
              // 数组中的两个值长度相加
              const allLength = arr[0].length + arr[1].length;
              // 计算出需要裁剪的长度，如果大于需要的长度
              if (allLength >= per) {
                const floatIndex = allLength - per;
                arr[1] = arr[1].substr(0, floatIndex);
              } else {
                arr[1] = arr[1].substr(0, 2);
              }
              const tempStr = arr.join('.');
              tempValue = Number.parseFloat(Number(_.trimEnd(tempStr, '.')).toFixed(2));
              tempValue = tempValue === 0.00 ? 0 : tempValue;
            }
            obj.value = tempValue || value;
            obj.unit = unit;
          }
        }
      }
      obj.value = minus ? `${minus}${obj.value}` : obj.value;
    } else {
      // value 没值
      obj.value = '暂无';
      obj.unit = '';
    }
    return obj;
  },

  /**
   * 构造入参
   * @param {*} query 查询
   * @param {*} newPageNum 当前页
   * @param {*} newPageSize 当前分页条目数
   */
  constructPostBody(query, newPageNum, newPageSize) {
    let finalPostData = {
      page: {
        curPageNum: newPageNum,
        pageSize: newPageSize,
      },
    };

    const omitData = _.omit(query, ['currentId', 'feedbackCreateTimeFrom', 'feedbackCreateTimeTo', 'curPageNum', 'curPageSize', 'isResetPageNum']);
    finalPostData = _.merge(finalPostData, omitData);

    const { feedbackCreateTimeTo, feedbackCreateTimeFrom } = query;
    const formatedTime = {
      feedbackCreateTimeFrom: feedbackCreateTimeFrom && helper.formatTime(feedbackCreateTimeFrom),
      feedbackCreateTimeTo: feedbackCreateTimeTo && helper.formatTime(feedbackCreateTimeTo),
    };

    if (formatedTime.feedbackCreateTimeFrom &&
      formatedTime.feedbackCreateTimeTo
      && (formatedTime.feedbackCreateTimeFrom === formatedTime.feedbackCreateTimeTo)) {
      delete formatedTime.feedbackCreateTimeTo;
    }

    // 对反馈状态做处理
    if (!('feedbackStatusEnum' in finalPostData)
      || _.isEmpty(finalPostData.feedbackStatusEnum)) {
      finalPostData = _.merge(finalPostData, { feedbackStatusEnum: 'PROCESSING' });
    }

    // 对经办人做过滤处理
    if ('processer' in finalPostData) {
      if (finalPostData.processer === 'ALL') {
        finalPostData.processer = '';
      } else if (finalPostData.processer === 'SELF') {
        finalPostData.processer = helper.getEmpId();
      }
    }

    return _.merge(finalPostData, formatedTime);
  },

  /**
   * 格式化时间戳
   * @param {*} time 中国标准时间
   */
  formatTime(time) {
    return moment(time).format('YYYY/MM/DD');
  },

  // 格式化数字，逢三位加一个逗号
  formatNum(num) {
    let newStr = '';
    let count = 0;
    let str = num.toString();

    if (str.indexOf('.') === -1) {
      for (let i = str.length - 1; i >= 0; i--) {
        if (count % 3 === 0 && count !== 0) {
          newStr = `${str.charAt(i)},${newStr}`;
        } else {
          newStr = `${str.charAt(i)}${newStr}`;
        }
        count++;
      }
      str = newStr;
    } else {
      for (let i = str.indexOf('.') - 1; i >= 0; i--) {
        if (count % 3 === 0 && count !== 0) {
          newStr = `${str.charAt(i)},${newStr}`;
        } else {
          newStr = `${str.charAt(i)}${newStr}`; // 逐个字符相接起来
        }
        count++;
      }
      str = `${newStr}${str.substr(str.indexOf('.'), 3)}`;
    }
    return str;
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

  // 获取事件段事件
  getDurationString(cycleType) {
    const fomater = 'YYYY/MM/DD';
    let durationEnd = '';
    let durationStart = '';
    const quarter = moment().quarter();
    let lastQuarter = quarter - 1;
    let year = moment().year();
    const lastYear = year - 1;

    const temp = moment().subtract(1, 'days');
    const dateText = temp.format('YYYY/MM/DD');
    switch (cycleType) {
      case 'beforeLastMonth':
        durationStart = moment(dateText, fomater).subtract(2, 'month').startOf('month');
        durationEnd = moment(dateText, fomater).subtract(2, 'month').endOf('month');
        break;
      case 'lastMonth':
        durationStart = moment(dateText, fomater).subtract(1, 'month').startOf('month');
        durationEnd = moment(dateText, fomater).subtract(1, 'month').endOf('month');
        break;
      case 'lastQuarter':
        if (quarter <= 1) {
          year--;
          lastQuarter = 4;
        }
        durationStart = moment(moment().year(year).startOf('quarter').quarter(lastQuarter));
        durationEnd = moment(moment().year(year).endOf('quarter').quarter(lastQuarter));
        break;
      case 'lastYear':
        durationStart = moment(moment().year(lastYear).startOf('year'));
        durationEnd = moment(moment().year(lastYear).endOf('year'));
        break;
      default:
        durationStart = moment(dateText, fomater).startOf(cycleType);
        durationEnd = moment(dateText, fomater);
        break;
    }
    const duration = {
      cycleType,
      durationStr: `${durationStart.format(fomater)}-${durationEnd.format(fomater)}`,
      begin: durationStart.format('YYYYMMDD'),
      end: durationEnd.format('YYYYMMDD'),
    };
    return duration;
  },
  // 获取环比时间段事件
  queryMoMDuration(begin, end, duration) {
    let tempDuration;
    if (duration === 'month' || duration === 'lastMonth') {
      tempDuration = 'month';
    } else if (duration === 'quarter' || duration === 'lastQuarter') {
      tempDuration = 'quarter';
    } else if (duration === 'year' || duration === 'lastYear') {
      tempDuration = 'year';
    } else {
      tempDuration = null;
    }
    let lastBeginMoment;
    let lastEndMoment;
    let lastDurationStr;
    if (tempDuration) {
      lastBeginMoment = moment(begin).subtract(1, tempDuration);
      lastEndMoment = moment(end).subtract(1, tempDuration);
      lastDurationStr = `${lastBeginMoment.format('YYYY/MM/DD')}-${lastEndMoment.format('YYYY/MM/DD')}`;
    } else {
      console.warn('用户自己选择的时间段');
      // console.warn('begin', begin);
      // console.warn('end', end);
      // console.warn(moment(end).diff(moment(begin)));
      // // const distanceYear = moment(end).diff(moment(begin), 'years');
      // console.warn(moment(end).diff(moment(begin), 'years'));
      // console.warn(moment(end).diff(moment(begin), 'months'));
      // console.warn(moment(end).diff(moment(begin), 'days'));
    }

    const compareDuration = {
      durationStr: lastDurationStr,
      begin: lastBeginMoment,
      end: lastEndMoment,
    };
    return compareDuration;
  },
};

export default helper;
