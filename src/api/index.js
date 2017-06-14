import apiCreator from '../utils/apiCreator';

const api = apiCreator();

export default {

  // 暴露api上的几个底层方法: get / post
  ...api,

  // 获取客户范围
  getCustRange: query => api.post('/groovynoauth/jxzb/empOrgTree', query),

  // ----------以下是invest页面的数据接口
  // 获取绩效统计接口
  getPerformance: query => api.post('/groovynoauth/jxzb/querySingleRecord', query),

  // 获取指标图表数据
  getChartInfo: query => api.post('/groovynoauth/jxzb/queryMultiCardRecord', query),

  // 获取指标图表表格视图数据
  getChartTableInfo: query => api.post('/groovynoauth/jxzb/queryMultiSummuryRecord', query),

  // ==========invest数据接口end

  // ----------以下是business的数据接口
  getBOPerformance: query => api.get('/groovynoauth/jxzb/queryBOPerformance', query),

  getBOChartInfo: query => api.get('/groovynoauth/jxzb/queryBOChartInfo', query),

  getBOChartTableInfo: query => api.get('/groovynoauth/jxzb/queryBOChartTableInfo', query),
  // ==========business数据接口end

  // ----------以下是feedback的数据接口

  getFeedbackList: query => api.post('/groovynoauth/feedback/queryFeedbackList', query),

  // ==========feedback的数据接口end
};
