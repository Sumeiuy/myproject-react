/*
 * @Author: zhangjun
 * @Date: 2018-05-22 22:35:31
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-05-25 11:10:56
 */
export default function messageCenter(api) {
  return {
    // 获取消息通知提醒列表
    getRemindMessageList: query => api.post('/groovynoauth/fsp/emp/notification/queryNotificationMsg', query),
  };
}
