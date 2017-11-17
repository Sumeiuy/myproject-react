/**
 * 目标客户池模块的接口
 */

export default function customerPool(api) {
  return {
    // 经营指标新增客户指标区域接口
    getCustCount: query => api.post('/groovynoauth/fsp/emp/kpi/queryNewCustCount', query),
    // 获取资讯中心统一接口
    getInformation: query => api.post('/groovynoauth/fsp/info/queryInfo', query),
    // 获取客户池沪深归集率 和 业务开通指标（经营指标）
    getHSRateAndBusinessIndicator: query => api.post('/groovynoauth/fsp/emp/kpi/queryHsRate', query),
    // 获取客户池投顾绩效
    getPerformanceIndicators: query => api.post('/groovynoauth/fsp/emp/kpi/queryPerformance', query),
    // 获取组织机构树完整版
    getCustRangeAll: query => api.post('/groovynoauth/fsp/emp/org/queryEmpOrgTree', query),

    // 按权限获取组织机构树
    getCustRangeByAuthority: query => api.post('/groovynoauth/fsp/emp/org/queryEmpPostnsOrgTree', query),

    // 员工职责与职位
    getEmpInfo: query => api.post('/groovynoauth/fsp/emp/info/queryEmpInfo', query),

    // 查询待办流程记录列表
    getToDoList: query => api.post('/groovynoauth/fsp/emp/workflow/queryWorkFlowTaskList', query),

    // 获取客户池经营指标
    getManageIndicators: query => api.post('/groovynoauth/fsp/emp/kpi/queryEmpKPIs', query),

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
    followCust: query => api.post('/groovynoauth/fsp/cust/custgroup/followCust', query),

    // 分组维度，客户分组列表
    queryCustomerGroupList: query => api.post('/groovynoauth/fsp/cust/custgroup/queryCustGroupList', query),

    // 某一个分组下面的客户列表
    queryGroupCustomerList: query => api.post('/groovynoauth/fsp/cust/custgroup/queryGroupCustList', query),

    // 查询客户列表，用于分组详情里面的客户搜索，联想
    queryPossibleCustList: query => api.post('/groovynoauth/fsp/biz/custList', query),

    // 操作分组（编辑、新增客户分组）
    operateGroup: query => api.post('/groovynoauth/fsp/cust/custgroup/operateGroup', query),

    // 删除分组
    deleteGroup: query => api.post('/groovynoauth/fsp/cust/custgroup/deleteGroup', query),

    // 删除分组下的客户
    deleteCustomerFromGroup: query => api.post('/groovynoauth/fsp/cust/custgroup/operateCust', query),

    // 360服务记录查询
    queryServeRecords: query => api.post('/groovynoauth/fsp/cust/task/queryServeRecords', query),

    // 查询某客户的服务人员待选择列表
    getSearchServerPersonelList: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/queryEmpList', query),

    queryAllServiceRecord: query => api.post('/groovynoauth/fsp/cust/custlist/queryAllChannelServiceRecord', query),

    // 预览客户细分数据
    previewCustFile: query => api.post('/groovynoauth/fsp/cust/custlist/previewCustFile', query),
    // 标签圈人查询
    queryLabelInfo: query => api.post('/groovynoauth/fsp/cust/task/queryLabelInfo', query),

    // 查询审批人列表
    queryFlowStepInfo: query => api.post('/groovynoauth/fsp/cust/task/queryFlowStepInfo', query),

    queryLabelPeople: query => api.post('/groovynoauth/fsp/cust/task/queryLabelPeople', query),

    // 提交任务流程
    submitTaskFlow: query => api.post('/groovynoauth/fsp/cust/task/createTask', query),

    // 任务列表-任务详情基本信息
    queryBasicInfo: query => api.post('/groovynoauth/fsp/flow/queryBasicInfo', query),
  };
}
