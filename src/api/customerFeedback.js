/*
 * @Author: XuWenKang
 * @Description 客户反馈相关接口
 * @Date: 2017-12-21 10:16:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-29 10:52:38
 */

export default function cust(api) {
  return {
    // 查询任务列表
    getMissionList: query => api.post('/groovynoauth/fsp/campaign/mot/queryMissionList2', query),
    // 删除任务下所关联客户反馈选项
    delCustomerFeedback: query => api.post('/groovynoauth/fsp/campaign/mot/delCustomerFeedback', query),
    // 删除客户反馈
    delFeedback: query => api.post('/groovynoauth/fsp/campaign/mot/delFeedback', query),
    // 增加客户反馈
    addFeedback: query => api.post('/groovynoauth/fsp/campaign/mot/addFeedback', query),
    // 编辑客户反馈
    modifyFeedback: query => api.post('/groovynoauth/fsp/campaign/mot/modifyFeedback', query),
    // 查询客户反馈列表
    getFeedbackList: query => api.post('/groovynoauth/fsp/campaign/mot/queryFeedbackList', query),
    // 添加任务下所关联客户反馈选项
    addCustomerFeedback: query => api.post('/groovynoauth/fsp/campaign/mot/addCustomerFeedback', query),
    // 查询MOT任务和自建任务绑定的客户反馈中有无涨乐客户可选项超过4项的任务
    hasOverFour: query => api.post('/groovynoauth/fsp/campaign/mot/queryMissionCustOptionsOver4', query),
  };
}
