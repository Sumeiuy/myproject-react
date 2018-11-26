/**
 * @Author: sunweibin
 * @Date: 2017-12-19 11:01:47
 * @Last Modified by: zhangmei
 * @Last Modified time: 2018-11-14 14:46:16
 * @description 用于神策日志统一记录的装饰器函数，用于需要记录日志的方法上
 */
import _ from 'lodash';
import { dva } from '../helper';
import{ constants } from '../config';

// 神策埋点中的value需为string类型，否则报错
function convertToString(payload) {
  const { value } = payload;
  if (!_.isString(value)) {
    return {
      ...payload,
      value: JSON.stringify(value),
    };
  }
  return payload;
}
// 将部分值替换成context中对应的值
// 如: context = {
//   props: { a: 1 },
//   state: { c: 2}
// }
// 则 {
//   x: 'props.a',
//   y: 'state.c'
// }
// => { x: 1, y: 2}
function replaceValue(data, context, args) {
  const result = _.mapValues(
    data,
    (value) => {
      if (_.isFunction(value)) {
        return value(context, args);
      }
      return value.replace(/\$([^\b\s]+)/g, (expression, variableName) => {
        let object = context;
        if (_.startsWith(variableName, 'args')) {
          object = { args };
        }
        let valueFinal = _.get(object, variableName, expression);
        // 如果这个解析出来的 valueFinal不是string类型，则需要对其进行字符串化
        if (!_.isString(valueFinal)) {
          valueFinal = JSON.stringify(valueFinal);
        }
        return valueFinal;
      });
    },
  );
  // 神策新加理财平台version字段
  const version = /newIndex/.test(window.location.pathname) ? constants.newVersion : constants.oldVersion;
  let resultFanal = { version };

  _.forOwn(result, (value, key) => {
    if (_.isPlainObject(value)) {
      resultFanal = {
        ...resultFanal,
        ...value,
      };
    } else {
      resultFanal = {
        ...resultFanal,
        [key]: value,
      };
    }
  });
  return resultFanal;
}

function makeLogger({ type, payload = {} }) {
  return (target, name, descriptor) => {
    const originalFn = descriptor.value;
    function log(...args) {
      try {
        if (_.isString(type) && !_.isEmpty(type)) {
          dva.dispatch({ type,
payload: replaceValue(payload, this, args) });
        }
      } catch (e) {
        dva.dispatch({
          type: 'LogError',
          payload: {
            message: e.message,
          },
        });
      }
      return originalFn.apply(this, args);
    }
    return {
      ...descriptor,
      value: log,
    };
  };
}

/**
 *
 * @param {Object} action
 * @param {String} action.type 日志类型：
 *  1. button：ButtonClick
 *  2. 普通下拉：DropdownSelect
 *  3. 日期下拉： CalendarSelect
 *  4. 查看表格、列表项目类（包括任务、客户列表、业务申请列表等）：ViewItem
 *  5. 下钻（图表）：DrillDown
 *  6. 其他点击：Click
 * @param {object} action.payload 日志数据：
 *  所有日志均需包含name、path属性，path由系统自动处理，name需指定，标识不同组件
 *  其他根据不同日志类型需指定不同字段：
 *  普通下拉，日期下拉：selection:选中项
 *  查看表格、列表项目类（包括任务、客户列表、业务申请列表等）：type，subType：类型、子类型
 *  图表：element：图表子项，比如饼图的某一块
 * @returns {Function}
 */
function logable({ type = 'Click', payload = {} }) {
  return makeLogger({
    type,
    payload: {
      pathname: dva.getLastLocation,
      ...payload,
    },
  });
}

/**
 * 页面浏览行为（页面跳转、模态对话框）
 * * 页面跳转无需开发介入
 * * 记录模态对话框事件
 * @param {String} pathname 路径名称，必须以/modal/开头，同时保证唯一
 * @param title 对话框中文说明
 * @param payload 自定义该条日志数据
 * @returns {Function}
 */
function logPV({ pathname, title, payload = {} }) {
  return makeLogger({
    type: '$pageview',
    payload: {
      pathname,
      title,
      search: '',
      $referrer: '$props.location.pathname',
      ...payload,
    },
  });
}

/**
 * zhangmeiceshi
 * 通用日志打印
 * @param {Object} action
 * @param {String} action.type 日志类型：
 *  1. 表单提交：Submit
 * @param {object} action.payload 日志数据：
 *  所有日志均需包含name、path属性，path由系统自动处理，name需指定，标识不同组件
 * @returns {Function}
 */
function logCommon({ type = 'Click', payload = {} }) {
  const fixedPayload = {
    pathname: dva.getLastLocation(),
    ...payload,
  };
  try {
    if (_.isString(type) && !_.isEmpty(type)) {
      dva.dispatch({ type,
payload: convertToString(fixedPayload) });
    }
  } catch (e) {
    dva.dispatch({
      type: 'LogError',
      payload: {
        message: e.message,
      },
    });
  }
}

export default logable;
export { logPV, logCommon };
