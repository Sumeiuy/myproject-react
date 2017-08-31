import apiCreator from '../utils/apiCreator';

const api = apiCreator();

export default {

  // 暴露api上的几个底层方法: get / post
  ...api,

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


  // ----------以下是feedback的数据接口

  getFeedbackList: query => api.post('/groovynoauth/feedback/queryFeedbackList', query),

  getFeedbackDetail: query => api.post('/groovynoauth/feedback/feedbackDetail', query),

  getFeedbackRecordList: query => api.post('/groovynoauth/feedback/feedbackRecordList', query),

  // 处理或更新反馈问题
  updateFeedback: query => api.post('/groovynoauth/feedback/updateFeedback', query),

  // ==========feedback的数据接口end

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

  // 查询待办流程记录列表
  getToDoList: query => api.post('/groovynoauth/fsp/emp/workflow/queryWorkFlowTaskList', query),

  // 获取客户池绩效指标
  getPerformanceIndicators: query => api.post('/groovynoauth/fsp/emp/kpi/queryEmpKPIs', query),

  // 统计周期
  getStatisticalPeriod: query => api.post('/groovynoauth/fsp/dictionary', query),

  // 代办流程(首页总数)
  getWorkFlowTaskCount: query => api.post('/groovynoauth/fsp/emp/workflow/queryWorkFlowTaskCount', query),

  // 今日可做任务总数
  getMotTaskCount: query => api.post('/groovynoauth/fsp/emp/notification/queryMotTaskCount', query),

  // 客户列表
  getCustomerList: query => api.post('/groovynoauth/fsp/cust/custlist/queryCustList', query),

  // 客户列表中的6个月的收益数据
  getCustIncome: query => api.post('/groovynoauth/fsp/cust/custlist/queryCustIncome', query),

  // 默认推荐词及热词推荐列表
  getHotWds: query => api.post('/groovynoauth/fsp/cust/custlabel/queryHotWds', query),

  // 联想的推荐热词列表
  getHotPossibleWds: query => api.post('/groovynoauth/fsp/cust/custlabel/queryPossibleHotWds', query),

  // 历史搜索记录
  getHistoryWdsList: query => api.post('/groovynoauth/fsp/cust/custlabel/queryHistoryWdsList', query),

  // 清除历史搜索记录
  clearSearchHistoryList: query => api.post('/groovynoauth/fsp/cust/custlabel/clearSearchHistoryList', query),
    // 客户分组列表信息
  customerGroupList: query => api.post('/groovynoauth/fsp/emp/notification/queryCustGroupList', query),
    // 添加客户到现有分组
  saveCustGroupList: query => api.post('/groovynoauth/fsp/emp/notification/saveCustGroupList', query),
    // 添加客户到新建分组
  createCustGroup: query => api.post('/groovynoauth/fsp/emp/notification/createCustGroup', query),

  // 自建任务提交
  createTask: query => api.post('/groovynoauth/fsp/cust/task/createTask', query),
};
