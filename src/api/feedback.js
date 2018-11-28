/**
 * 用户反馈模块的接口
 */

export default function feebback(api) {
  return {
    // 反馈管理 反馈列表接口
    getFeedbackList: query => api.post('/groovynoauth/feedback/queryFeedbackList', query),
    // 我的反馈 反馈列表接口
    getPersonFeedbackList: query => api.post('/groovynoauth/feedback/querySMFeedbackList', query),
    // 反馈详情（共用）
    getFeedbackDetail: query => api.post('/groovynoauth/feedback/feedbackDetail', query),
    // 反馈管理 处理意见、操作记录 列表
    getFeedbackRecordList: query => api.post('/groovynoauth/feedback/feedbackRecordList', query),
    // 我的反馈 问题答复列表
    getAnserOfQustionList: query => api.post('/groovynoauth/feedback/querySMFeedbackRecordList', query),
    // 处理或更新反馈问题（共用）
    updateFeedback: query => api.post('/groovynoauth/feedback/updateFeedback', query),
    // 满意度调查
    addFeedbackEvaluation: query => api.post('/groovynoauth/feedback/addFeedbackEvaluation', query),
    // 反馈管理 经办人列表
    getEmpListByResp: query => api.post('/groovynoauth/emp/queryEmpListByResp1', query),
  };
}
