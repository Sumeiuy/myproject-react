/**
 * @file middlewares/sensorsLogger.js
 *  神策数据收集
 * @author maoquan(maoquan@htsc.com)
 */

import _ from 'lodash';

import api from '../api';
import {
  enable as enableLog,
  eventPropertyMap,
  url,
  projectName,
  interval,
  whitelist,
  blacklist,
  mapFiledList,
  EVENT_PROFILE_ACTION,
} from '../config/log';
import helper from '../utils/helper';

const EVENT_PROFILE_KEY = 'profile_set';

function format(type) {
  return type.replace(/\//g, '_').replace(/[^\w$]/g, '');
}

// 待发送日志队列
let QUEUE = [];

function isPass(action) {
  const { type } = action;
  if (!_.isEmpty(whitelist) && whitelist.indexOf(type) === -1) {
    return false;
  }
  if (blacklist.indexOf(type) !== -1) {
    return false;
  }
  return true;
}

function getEventType(action) {
  const { type } = action;
  const eventType = {
    type: 'track',
    event: format(type),
  };
  if (EVENT_PROFILE_ACTION === type) {
    return { type: EVENT_PROFILE_KEY };
  }
  if (/LOCATION_CHANGE$/.test(type)
    && action.payload
    && action.payload.pathname
  ) {
    return {
      ...eventType,
      event: format(action.payload.pathname),
    };
  }
  return eventType;
}

function getExtraData(action) {
  const { type, payload } = action;
  const propertyMap = eventPropertyMap[type];
  let data = { ...payload };
  // 表示对这个action有特殊的配置
  if (propertyMap) {
    const { values } = propertyMap;
    if (!_.isEmpty(values)) {
      data = _.reduce(
        values,
        (mergedData, value) => {
          if (value === '*') {
            return { ...mergedData, ...payload };
          }
          const propertyValue = helper.getProperty(payload, value);
          if (_.isObject(propertyValue)) {
            return { ...mergedData, ...propertyValue };
          }
          return { ...mergedData, [value]: propertyValue };
        },
        data,
      );
    }
  }
  data = _.omitBy(
    data,
    item => _.isNull(item) || _.isObject(item) || _.isArray(item),
  );
  return _.mapKeys(
    data,
    (item, key) => {
      if (_.includes(mapFiledList, key)) {
        return `${key}_0`;
      }
      return key;
    },
  );
}

function getLogData(action) {
  // 事件类型 { type, event= }
  const eventType = getEventType(action);
  // 系统变量
  const env = eventType.type === EVENT_PROFILE_KEY
    ? { empId: helper.getEmpId() } : helper.getEnv();
  const extraData = getExtraData(action);

  return {
    ...eventType,
    distinct_id: helper.getEmpId(),
    time: new Date().getTime(),
    project: projectName,
    properties: {
      ...env,
      ...extraData,
      eventType: eventType.event,
    },
  };
}

// 发送缓冲区日志
function flushLog() {
  const data = [...QUEUE];
  if (data.length > 1) {
    api.sendLog(url, data).then(
      () => {
        QUEUE = [];
      },
    ).catch(
      e => (console.log(e)),
    );
  }
}

// 节流函数
const throttledFlushLog = _.throttle(flushLog, interval);

function sendLog(action) {
  if (!isPass(action) || !enableLog) {
    return;
  }
  const data = getLogData(action);
  // profile_set拿到以后单独发送
  if (data.type === EVENT_PROFILE_KEY) {
    api.sendLog(url, [data]);
    return;
  }
  QUEUE.push(data);
  throttledFlushLog();
}

export default function createSensorsLogger() {
  /* eslint-disable */
  return ({ getState }) => (next) => (action) => {
    sendLog(action);
    return next(action);
  };
  /* eslint-disable */
}
