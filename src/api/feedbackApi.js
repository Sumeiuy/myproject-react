/**
 * 用户反馈模块的接口
 */
import apiCreator from '../utils/apiCreator';

const api = apiCreator();

const feebbackApi = {

  // 暴露api上的几个底层方法: get / post
  ...api,

  getFeedbackList: query => api.post('/groovynoauth/feedback/queryFeedbackList', query),

  getFeedbackDetail: query => api.post('/groovynoauth/feedback/feedbackDetail', query),

  getFeedbackRecordList: query => api.post('/groovynoauth/feedback/feedbackRecordList', query),

  // 处理或更新反馈问题
  updateFeedback: query => api.post('/groovynoauth/feedback/updateFeedback', query),

};

export default feebbackApi;
