import apiCreator from '../utils/apiCreator';

const api = apiCreator();

const historyApi = {

  // 暴露api上的几个底层方法: get / post
  ...api,

  // 员工职责与职位
  getEmpInfo: query => api.post('/groovynoauth/fsp/emp/info/queryEmpInfo', query),

  // 获取客户范围
  getCustRange: query => api.post('/groovynoauth/jxzb/empOrgTree', query),

  // 获取用户有权限查看(无编辑权限)的看板基本信息
  getAllVisibleReports: query => api.post('/groovynoauth/jxzb/queryVisibleBoard', query),

  // 查询字典数据
  queryHistoryContrast: query => api.post('/groovynoauth/jxzb/queryHistoryContrast', query),

  // 查询历史指标概览数据
  getHistoryCore: query => api.post('/groovynoauth/jxzb/queryHistoryCore', query),

  // 查询强弱指示分析数据接口
  getCurrentRankingRecord: query => api.post('/groovynoauth/jxzb/queryCurrentRankingRecord', query),

  // 查询历史对比折线图数据
  getHistoryContrastLineChartData: query => api.post('/groovynoauth/jxzb/queryContrastLineChart', query),

  // 查询历史对比排名数据
  getHistoryRankChartData: query => api.post('/groovynoauth/jxzb/queryHistoryCardRecord', query),

  // 查询散点图
  queryContrastAnalyze: query => api.post('/groovynoauth/jxzb/queryContrastAnalyze', query),

  // 查询指标库数据
  getIndicators: query => api.post('/groovynoauth/jxzb/queryCategoryAndIndicators', query),

  // 保存用户创建的历史对比看板
  createHistoryBoard: query => api.post('/groovynoauth/jxzb/saveBoard', query),

  // 删除历史对比看板
  deleteHistoryBoard: query => api.post('/groovynoauth/jxzb/deleteBoard', query),

  // 更新历史对比看板
  updateHistoryBoard: query => api.post('/groovynoauth/jxzb/updateBoard', query),

};

export default historyApi;
