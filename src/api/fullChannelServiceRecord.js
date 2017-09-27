/**
 *@file api/fullChannelServiceRecord.js
 * 全渠道服务记录模块的接口
 *@author wagnjunjun
 */

export default function feebback(api) {
  return {
    // 获取全渠道服务记录列表
    getServiceRecordList: query => api.post('/groovynoauth/fsp/queryAllRecord', query),
  };
}
