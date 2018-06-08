/**
 * 用户反馈模块的接口
 */

export default function feebback(api) {
  return {
    // HTSC CRM系统需求审核员 反馈列表接口
    getFeedbackList: query => api.post('/groovynoauth/feedback/queryFeedbackList', query),
    // 非 HTSC CRM系统需求审核员 反馈列表接口
    getPersonFeedbackList: query => api.post('/groovynoauth/feedback/querySMFeedbackList', query),
    // 反馈详情
    getFeedbackDetail: query => api.post('/groovynoauth/feedback/feedbackDetail', query),
    // 反馈 处理意见、操作记录 列表
    getFeedbackRecordList: query => api.post('/groovynoauth/feedback/feedbackRecordList', query),
    // 非 HTSC CRM系统需求审核员 问题答复列表
    getAnserOfQustionList: query => api.post('/groovynoauth/feedback/querySMFeedbackRecordList', query),
    // 处理或更新反馈问题
    updateFeedback: query => api.post('/groovynoauth/feedback/updateFeedback', query),
  };
}
