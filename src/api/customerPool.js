/**
 * 目标客户池模块的接口
 */

export default function customerPool(api) {
  return {
    // 获取新增客户
    getLastAddCust: query => api.post('/groovynoauth/fsp/emp/indicators/lastAddCust', query),
    // 获取首席投顾观点
    getViewpoints: query => api.post('/groovynoauth/fsp/emp/viewpoints/queryViewpoints', query),
    // 获取组织机构树完整版
    getCustRangeAll: query => api.post('/groovynoauth/fsp/emp/org/queryEmpOrgTree', query),

    // 员工职责与职位
    getEmpInfo: query => api.post('/groovynoauth/fsp/emp/info/queryEmpInfo', query),

    // 查询待办流程记录列表
    getToDoList: query => api.post('/groovynoauth/fsp/emp/workflow/queryWorkFlowTaskList', query),

    // 获取客户池绩效指标
    getPerformanceIndicators: query => api.post('/groovynoauth/fsp/emp/kpi/queryEmpKPIs', query),

    // 统计周期
    getStatisticalPeriod: query => api.post('/groovynoauth/fsp/dictionary', query),

    // (首页总数)
    getQueryNumbers: query => api.post('/groovynoauth/fsp/emp/todealwith/queryNumbers', query),

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
    customerGroupList: query => api.post('/groovynoauth/fsp/cust/custgroup/queryCustGroupList', query),

    // 添加客户到现有分组
    saveCustGroupList: query => api.post('/groovynoauth/fsp/cust/custgroup/saveCustGroupList', query),

    // 添加客户到新建分组
    createCustGroup: query => api.post('/groovynoauth/fsp/cust/custgroup/createCustGroup', query),

    // 自建任务提交
    createTask: query => api.post('/groovynoauth/fsp/cust/task/createTask', query),

    // 客户列表页添加服务记录
    addServeRecord: query => api.post('/groovynoauth/fsp/cust/custlist/addServeRecord', query),

    // 净创收数据
    queryKpiIncome: query => api.post('/groovynoauth/fsp/emp/kpi/queryNetIncome', query),

    // 查询机构与个人联系方式
    queryCustContact: query => api.post('/groovynoauth/fsp/cust/custlist/fspQueryCustContact', query),

    // 查询最近五次服务记录
    queryRecentServiceRecord: query => api.post('/groovynoauth/fsp/cust/custlist/queryRecentServiceRecord', query),

    // 关注与取消关注
    queryFollowCust: query => api.post('/groovynoauth/fsp/cust/custgroup/queryFollowCust', query),

    // 分组维度，客户分组列表
    queryCustomerGroupList: query => api.post('/groovynoauth/fsp/cust/custgroup/queryCustomerGroupList', query),
  };
}
