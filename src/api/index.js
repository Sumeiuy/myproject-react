import apiCreator from '../utils/apiCreator';
import report from './report';
import feedback from './feedback';
import permission from './permission';
import commission from './commission';
import customerPool from './customerPool';
import contract from './contract';
import fullChannelServiceRecord from './fullChannelServiceRecord';
import seibelCommon from './seibelCommon';

const api = apiCreator();

export default {
  // 暴露api上的几个底层方法: get / post
  ...api,
  // ========= 客户资源池
  customerPool: customerPool(api),
  // ========= 绩效视图
  report: report(api),
  // ========= 反馈管理
  feedback: feedback(api),
  // ==========seibel 通用接口
  seibel: seibelCommon(api),
  // ==========权限申请私有接口
  permission: permission(api),
  // 合作合约相关接口
  contract: contract(api),
  // ==========佣金调整的数据接口end
  commission: commission(api),
  // 全渠道服务记录数据接口api
  fullChannelServiceRecord: fullChannelServiceRecord(api),

  // 附件删除
  ceFileDelete: query => api.post('/file/ceFileDelete', query),
  // 获取组织机构树完整版
  getCustRangeAll: query => api.post('/groovynoauth/fsp/emp/org/queryEmpOrgTree', query),

  // 员工职责与职位
  getEmpInfo: query => api.post('/groovynoauth/fsp/emp/info/queryEmpInfo', query),

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


  // 获取报表下所有的分类信息
  getAllClassifyIndex: query => api.get('/groovynoauth/jxzb/queryCategoryRecord', query),

  // 获取用户有权限查看(无编辑权限)的看板基本信息
  getAllVisibleReports: query => api.post('/groovynoauth/jxzb/queryVisibleBoard', query),

  // 获取用户创建报表看板时候需要的可见范围
  getVisibleRange: query => api.post('/groovynoauth/jxzb/queryNextLevelOrg', query),

  // 查询当前用户可以编辑的报表看板
  getAllEditableReports: query => api.post('/groovynoauth/jxzb/queryMultiBoard', query),

  // 保存用户创建的看板
  createBoard: query => api.post('/groovynoauth/jxzb/saveBoard', query),

  // 删除看板
  deleteBoard: query => api.post('/groovynoauth/jxzb/deleteBoard', query),

  // 更新看板
  updateBoard: query => api.post('/groovynoauth/jxzb/updateBoard', query),

  // 发布看板
  publishBoard: query => api.post('/groovynoauth/jxzb/updateBoard', query),

  // 查询单个看板的信息
  getOneBoardInfo: query => api.post('/groovynoauth/jxzb/querySingleBoard', query),

  // 查询指标库数据
  getIndicators: query => api.post('/groovynoauth/jxzb/queryCategoryAndIndicators', query),

  // 查询散点图
  queryContrastAnalyze: query => api.post('/groovynoauth/jxzb/queryContrastAnalyze', query),

  // 查询雷达图
  queryCurrentRankingRecord: query => api.post('/groovynoauth/jxzb/queryCurrentRankingRecord', query),
  // 查询历史指标概览数据
  getHistoryCore: query => api.post('/groovynoauth/jxzb/queryHistoryCore', query),

  // 查询强弱指示分析数据接口
  getCurrentRankingRecord: query => api.post('/groovynoauth/jxzb/queryCurrentRankingRecord', query),

  // 查询字典数据
  queryHistoryContrast: query => api.post('/groovynoauth/jxzb/queryHistoryContrast', query),

  // 查询历史对比折线图数据
  getHistoryContrastLineChartData: query => api.post('/groovynoauth/jxzb/queryContrastLineChart', query),

  // 保存用户创建的历史对比看板
  createHistoryBoard: query => api.post('/groovynoauth/jxzb/saveBoard', query),

  // 删除历史对比看板
  deleteHistoryBoard: query => api.post('/groovynoauth/jxzb/deleteBoard', query),

  // 更新历史对比看板
  updateHistoryBoard: query => api.post('/groovynoauth/jxzb/updateBoard', query),

  // 查询历史对比排名数据
  getHistoryRankChartData: query => api.post('/groovynoauth/jxzb/queryHistoryCardRecord', query),

  // 看板名称重复验证
  distinctBoard: query => api.post('/groovynoauth/jxzb/saveBoard', query),
};

