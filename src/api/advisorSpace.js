/*
 * @Author: zhangjun
 * @Date: 2018-09-11 14:05:05
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-09-21 17:27:11
 * @Descripter: 投顾空间相关接口
 */

 // 此处针对修改字典里面委托他人任务处理的字段从key-value修改为value-label对应关系
import _ from 'lodash';

function fixDictoryKeys(dict) {
  const { resultData, resultData: { smartFrontHallList: data } } = dict;
  // 因为初始的委托他人任务状态字典列表中的字段名为 key, value
  return {
    ...dict,
    resultData: {
      ...resultData,
      smartFrontHallList: _.map(data, item => ({ ...item, label: `${item.siteName}${item.roomName}`, value: item.roomNo })),
    },
  };
}

export default function advisorSpace(api) {
  return {
    // 申请单列表
    getApplicationList: query => api.post('/groovynoauth/fsp/biz/advisorSpace/queryApplicationList', query),
    // 智慧前厅列表
    getRoomList: query => api.post('/groovynoauth/fsp/biz/advisorSpace/querySmartFrontHallList', query).then(fixDictoryKeys),
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
