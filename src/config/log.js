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
    // 客户资源池 tab 切换操作
    'customerPoolHome/switchTab': {},
    // 下载操作
    'viewpointDetail/downloadFile': {},
    // 客户列表筛选
    'customerList/handleFilter': {},
    // 客户列表排序
    'customerList/handleOrder': {},
    // 客户列表 check 框选中
    'customerList/handleCheck': {},
    // 客户列表 下拉框选中
    'customerList/handleDropDownSelect': {},
    // 客户列表 check 框选中
    'customerGroup/handleRadio': {},
    // 添加分组 tab 切换操作
    'customerGroup/switchTab': {},
    // 客户列表 搜索框（下拉框中的）
    'customerList/handleSearch': {},
    // 联系方式弹框 关闭 按钮
    'contactModal/handleCloseClick': {},
    // 联系方式弹框 添加服务记录 按钮
    'contactModal/handleAddServiceRecord': {},
    // 联系方式弹框 服务记录面板 按钮
    'contactModal/handleCollapseClick': {},
    // 联系方式弹框 服务记录面板 按钮
    'serviceRecordModal/handleCloseClick': {},
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
