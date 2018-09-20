/*
 * @Author: zhangjun
 * @Date: 2018-09-11 14:05:05
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-14 15:29:58
 * @Descripter: 投顾空间相关接口
 */

export default function advisorSpace(api) {
  return {
    // 申请单列表
    getApplicationList: query => api.post('/groovynoauth/fsp/biz/advisorSpace/queryApplicationList', query),
    // 智慧前厅列表
    getRoomList: query => api.post('/groovynoauth/fsp/biz/advisorSpace/querySmartFrontHallList', query),
    // 申请单详情
    getApplicationDetail: query => api.post('/groovynoauth/fsp/biz/advisorSpace/queryApplicationDetail', query),
    // 新建申请单
    saveApplictaion: query => api.post('/groovynoauth/fsp/biz/advisorSpace/save', query),
    // 获取参与人
    getParticipantList: query => api.post('/groovynoauth/fsp/biz/advisorSpace/getParticipantList', query),
    // 取消预订
    cancelReservation: query => api.post('/groovynoauth/fsp/biz/advisorSpace/cancelReservation', query),
    // 获取已预订时间段
    getOrderPeriod: query => api.post('/groovynoauth/fsp/biz/advisorSpace/getOrderPeriod', query),
  };
}
