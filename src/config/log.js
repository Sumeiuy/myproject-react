/**
 * @file config/log.js
 *  神策数据收集相关配置
 * @author maoquan(maoquan@htsc.com)
 */

import constants from './constants';

const config = {
  url: '/fspa/log/sa',
  interval: 1 * 60 * 1000,
  // 开启日志监控
  enable: true,
  projectName: constants.inHTSCDomain ? 'FSP_1' : 'DEV_TEST',
  blacklist: [
    '@@DVA_LOADING/HIDE',
    '@@DVA_LOADING/SHOW',
    '@@HT_LOADING/SHOW_ACTIVITY_INDICATOR',
    '@@HT_LOADING/HIDE_ACTIVITY_INDICATOR',
    'persist/REHYDRATE',
  ],
  whitelist: [],
  eventPropertyMap: {
    // 页面pv
    '@@router/LOCATION_CHANGE': {
      values: [
        'pathname',
        'query',
      ],
    },
  },
  // 神策系统保留属性，未避免冲突，对这些属性+后缀处理
  // 如 time ==> time_0
  mapFiledList: [
    'time',
    'date',
    'datetime',
    'distinct_id',
    'event',
    'events',
    'first_id',
    'id',
    'original_id',
    'device_id',
    'properties',
    'second_id',
    'time',
    'user_id',
    'users',
  ],
  // 发送profile_set的action名称
  EVENT_PROFILE_ACTION: 'sendProfile',
};

export default config;
