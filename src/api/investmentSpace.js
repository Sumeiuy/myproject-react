/*
 * @Author: zhangjun
 * @Date: 2018-09-11 14:05:05
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-11 14:35:59
 * @Descripter: 投顾空间相关接口
 */

export default function investmentSpace(api) {
  return {
    // 申请单列表
    getApplicationList: query => api.post('/groovynoauth/fsp/biz/investionSpace/queryApplicationList', query),
    // 智慧前厅列表
    getSmartFrontHallList: query => api.post('/groovynoauth/fsp/investmentSpace/querySmartFrontHallList', query),
    // 申请单详情
    getApplicationDetail: query => api.post('/groovynoauth/fsp/biz/investionSpace/queryApplicationDetail', query),
    // 新建申请单
    saveApplictaion: query => api.post('/groovynoauth/fsp/biz/investionSpace/save', query),
    // 获取参与人
    getParticipantList: query => api.post('/groovynoauth/fsp/biz/investionSpace/getParticipantList', query),
    // 取消预订
    cancelReservation: query => api.post('/groovynoauth/fsp/biz/investionSpace/cancelReservation', query),
    // 获取已预订时间段
    getOrderPeriod: query => api.post('/groovynoauth/fsp/biz/investionSpace/getOrderPeriod', query),
  };
}
