/**
 * 目标客户池模块的接口
 */

export default function customerPool(api) {
  return {
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
  };
}
