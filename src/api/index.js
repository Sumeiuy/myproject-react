import apiCreator from '../utils/apiCreator';

const api = apiCreator();

export default {

  // 暴露api上的几个底层方法: get / post
  ...api,

  // 获取客户范围
  getCustRange: query => api.post('/groovynoauth/jxzb/empOrgTree', query),

  // 获取绩效统计接口
  getPerformance: query => api.post('/groovynoauth/jxzb/querySingleRecord', query),

  // 获取所有分类指标
  getChartInfo: query => api.post('/groovynoauth/jxzb/queryMultiCardRecord', query),

  // 获取某一个分类指标
  getOneChartInfo: query => api.post('/groovynoauth/jxzb/queryCategoryCardRecord', query),

  // 获取某一个分类指标下的表格数据
  getChartTableInfo: query => api.post('/groovynoauth/jxzb/queryMultiSummuryRecord', query),

  getBOChartTableInfo: query => api.get('/groovynoauth/jxzb/queryBOChartTableInfo', query),
  // ==========business数据接口end

  // ----------以下是feedback的数据接口

  getFeedbackList: query => api.post('/groovy/feedback/queryFeedbackList', query),

  getFeedbackDetail: query => api.post('/groovy/feedback/feedbackDetail', query),

  getFeedbackRecordList: query => api.post('/groovy/feedback/feedbackRecordList', query),

  // ==========feedback的数据接口end

  // 获取报表下所有的分类信息
  getAllClassifyIndex: query => api.get('/groovynoauth/jxzb/queryCategoryRecord', query),

};
