/*
 * @Author: XuWenKang
 * @Description 客户反馈相关接口
 * @Date: 2017-12-21 10:16:45
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-12-21 14:58:04
 */

export default function cust(api) {
  return {
    // 查询任务列表
    getMissionList: query => api.post('/groovynoauth/fsp/campaign/mot/queryMissionList', query),
    // 删除任务下所关联客户反馈选项
    delCustomerFeedback: query => api.post('/groovynoauth/fsp/customer/delCustomerFeedback', query),
    // 删除客户反馈
    delFeedback: query => api.post('/groovynoauth/fsp/customer/delFeedback', query),
    // 增加客户反馈
    addFeedback: query => api.post('/groovynoauth/fsp/customer/addFeedback', query),
    // 查询客户反馈列表
    queryFeedbackList: query => api.post('/groovynoauth/fsp/customer/queryFeedbackList', query),
    // 添加任务下所关联客户反馈选项
    addCustomerFeedback: query => api.post('/groovynoauth/fsp/customer/addCustomerFeedback', query),
  };
}
