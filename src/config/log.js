/**
 * @file config/log.js
 *  神策数据收集相关配置
 * @author maoquan(maoquan@htsc.com)
 */

const config = {
  url: process.env.NODE_ENV === 'development1'
    ? '/' : '/fspa/abtest/pass/mc/sensors',
  interval: 1 * 60 * 1000,
  // 开启日志监控
  enable: true,
  projectName: location.hostname.indexOf('htsc.com.cn') > -1
      ? 'FSP_1' : 'FSP_1',
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
    // 跳转不发action 和 locaiton change
    'customerPool/redirectionPage': {
      values: [
        '*', // *表示payload所有第一层字段
      ],
    },
    // 切换操作
    'customerPool/switchTab': {
      values: [
        '*',
      ],
    },
    // 下载操作
    'customerPool/downloadFile': {
      values: [
        '*',
      ],
    },
    // 客户列表筛选
    'customerPool/handleFilter': {
      values: [
        '*',
      ],
    },
    // 客户列表排序
    'customerPool/handleOrder': {
      values: [
        '*',
      ],
    },
    // 客户列表选中
    'customerPool/handleSelect': {
      values: [
        '*',
      ],
    },
    // 点击
    'customerPool/handleClick': {
      values: [
        '*',
      ],
    },
    // toolTip
    'customerPool/hoverToolTip': {
      values: [
        '*',
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
