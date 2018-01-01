/**
 * @file utils/helper.js
 *  常用工具方法
 * @author maoquan(maoquan@htsc.com)
 */

import moment from 'moment';
import bowser from 'bowser';
import pathToRegexp from 'path-to-regexp';
import _ from 'lodash';

import { hasPermissionOfPostion } from './permission';

import { ZHUNICODE, constants, seibelConfig, fspContainer } from '../config';

const routerPrefix = '/customerPool';

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
  // 判断参数是否为null
  // TODO 该方法已经提取
  isNull(v) {
    if (v === null || v === 'null' || v === '' || v === undefined || v === 'undefined') {
      return true;
    }
    return false;
  },
  /**
   * 检查当前页面路径是否为外部链接
   * @param {*} key 当前路由的src
   */
  isExternal(key) {
    return key && !(key.indexOf('http') === -1);
  },
  // 获取元素CSS的样式
  // TODO 该方法已经提取
  getCssStyle(ele, css) {
    return window.getComputedStyle(ele, null).getPropertyValue(css);
  },

  // 计算字符串长度
  // TODO 该方法已经提取
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

  // 格式化日期为 YYYY-MM-DD 格式
  // TODO 该方法已经提取
  dateFormat(str) {
    let date = '';
    if (str) {
      date = moment(str).format('YYYY-MM-DD');
    } else {
      date = '';
    }
    return date;
  },

  // 获取 empId
  // TODO 该方法已经提取
  getEmpId() {
    // 临时 ID
    const tempId = '001206'; // '001423''002727','002332' '001206' '001410';
    const nativeQuery = helper.getQuery(window.location.search);
    const empId = window.curUserCode || nativeQuery.empId || tempId;
    return empId;
  },
  /**
   * 将{ a: 1, b: 2 } => a=1&b=2
   * @param {object} query
   */
  // TODO 该方法已经提取
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
  // TODO 该方法已经提取
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
  // TODO 该方法已经提取
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

  // TODO 该方法已经提取
  hasClass(elem, className) {
    return elem.className.indexOf(className) > -1;
  },

  // TODO 该方法已经提取
  addClass(elem, cls) {
    const ele = elem;
    if (!helper.hasClass(ele, cls)) {
      const oldCls = ele.className;
      ele.className = _.isEmpty(oldCls) ? cls : `${oldCls} ${cls}`;
    }
  },

  // TODO 该方法已经提取
  removeClass(elem, cls) {
    const ele = elem;
    if (helper.hasClass(ele, cls)) {
      const oldCls = ` ${ele.className} `;
      const newCls = oldCls.replace(` ${cls} `, ' ');
      ele.className = newCls.trim();
    }
  },

  /**
     * toUnit('123456', '元', 5) => {vale: 12.34, unit:'万元'}
     * @param  { string } str  需要转换的字符串数字
     * @param  { string } unit 单位
     * @return { number } per  以显示几位为转换依据，默认 5 位
     * @return { bool } isCommissionRate  对佣金率指标作特殊处理
  */
  // TODO 该方法已经提取
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
            obj.value = tempValue || newValue;
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
  // TODO 该方法已经提取
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
   * 构造入参
   * @param {*} query 查询
   * @param {*} newPageNum 当前页
   * @param {*} newPageSize 当前分页条目数
   */
  // TODO 该方法已经提取
  constructSeibelPostBody(query, newPageNum, newPageSize) {
    let finalPostData = {
      pageNum: _.parseInt(newPageNum, 10),
      pageSize: _.parseInt(newPageSize, 10),
    };

    const omitData = _.omit(query, ['currentId', 'pageNum', 'pageSize', 'isResetPageNum']);
    finalPostData = _.merge(finalPostData, omitData);

    return finalPostData;
  },

  /**
   * 获取合约、佣金、权限的列表请求参数
   * @param  {[string]} page  [页面名称]
   * @param  {[object]} query [查询参数]
   * @return {[object]}       [接口查询需要的最终参数]
   */
  // TODO 该方法已经提取
  getSeibelQuery(page, query) {
    const type = seibelConfig[page].pageType;
    const defaultQuery = {
      keyword: '',
      subType: '',
      status: '',
      orgId: '',
      pageSize: 10,
      pageNum: 1,
      empId: '',
    };
    const { drafter, ...reset } = query;
    return {
      type,
      ...defaultQuery,
      ...reset,
      empId: drafter,
    };
  },

  /**
   * 格式化时间戳
   * @param {*} time 中国标准时间
   */
  // TODO 该方法已经提取
  formatTime(time) {
    return moment(time).format('YYYY/MM/DD');
  },

  // 格式化数字，逢三位加一个逗号
  // TODO 该方法已经提取
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
  // TODO 该方法已经提取
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

  // TODO 该方法已经提取
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
  // TODO 该方法已经提取
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

  /**
   * 添加滚动监听
  */
  // TODO 该方法已经提取
  addWheelEvent(obj, handler) {
    obj.addEventListener('mousewheel', handler, false);
    obj.addEventListener('DOMMouseScroll', handler, false);
  },
  /**
   * 删除滚动监听
  */
  // TODO 该方法已经提取
  removeWheelEvent(obj, handler) {
    obj.removeEventListener('mousewheel', handler, false);
    obj.removeEventListener('DOMMouseScroll', handler, false);
  },

  /**
   * 添加点击监听
  */
  // TODO 该方法已经提取
  addClickEvent(obj, handler) {
    obj.addEventListener('click', handler, false);
  },
  /**
   * 删除点击监听
  */
  // TODO 该方法已经提取
  removeClickEvent(obj, handler) {
    obj.removeEventListener('click', handler, false);
  },

  // 获取环比时间段事件
  // TODO 该方法已经提取
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
    }

    const compareDuration = {
      durationStr: lastDurationStr,
      begin: lastBeginMoment,
      end: lastEndMoment,
    };
    return compareDuration;
  },

  // 根据Date的对象获取星期
  // TODO 该方法已经提取
  getDay(d) {
    const weekday = new Array(7);
    weekday[0] = '周日';
    weekday[1] = '周一';
    weekday[2] = '周二';
    weekday[3] = '周三';
    weekday[4] = '周四';
    weekday[5] = '周五';
    weekday[6] = '周六';
    return weekday[d.getDay()];
  },

  // 将CustRange转换成一个一维数据
  // TODO 该方法已经提取
  transform2array(arr) {
    let tmpArr = arr.slice();
    arr.forEach((v) => {
      if (v.children) {
        tmpArr = [...tmpArr, ...v.children];
      }
    });
    return tmpArr;
  },

  // 手机号、座机、邮箱正则表达式
  // TODO 该方法已经提取
  checkFormat: {
    isCellphone(value) {
      return /^((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-8]{1})|(18[0-9]{1}))+\d{8}$/.test(value);
    },
    isTelephone(value) {
      return /^(00?[0-9]{2,3}-?)?([2-9][0-9]{6,7})(-[0-9]{1,8})?$/.test(value);
    },
    isEmail(value) {
      return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value);
    },
  },

  // 检测合作合约项目，当前用户是否有相应的职责、职位权限
  // TODO 该方法已经提取
  hasPermission(empInfo) {
    const fsp = document.querySelector(fspContainer.container);
    let hasPermissionOnBtn = true;
    if (fsp) {
      hasPermissionOnBtn = hasPermissionOfPostion(empInfo);
    }
    return hasPermissionOnBtn;
  },

  // 判断当前是否在FSP系统中
  // TODO 该方法已经提取
  isInFsp() {
    const fsp = document.querySelector(fspContainer.container);
    return !!fsp;
  },

  // 获取ogrId
  // TODO 该方法已经提取
  getOrgId() {
    let orgId = '';
    if (_.isEmpty(window.forReactPosition)) {
      orgId = null;
    } else {
      orgId = window.forReactPosition.orgId;
    }
    return orgId;
  },
  /**
   * 模拟鼠标点击事件
   * @param  ele 触发事件的html节点
   * @param  eventType 事件类型 例如 ‘click’
   * @param  canBubble  canBubble
   * @param  cancelable 是否可以用 preventDefault() 方法取消事件。
   */
  // TODO 该方法已经提取
  trigger(eleDom, eventType, canBubble = true, cancelable = true) {
    const evt = document.createEvent('MouseEvent');
    evt.initEvent(eventType, canBubble, cancelable);
    eleDom.dispatchEvent(evt);
  },
  /**
   * 检查当前页面路径是否匹配指定子路由
   * @param {*} route 当前子路由
   * @param {*} pathname 当前页面路径
   */
  // TODO 该方法已经提取
  matchRoute(route, pathname) {
    return pathToRegexp(`${routerPrefix}/${route}`).exec(pathname);
  },
};

export default helper;
