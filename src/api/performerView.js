/**
 * @Author: XuWenKang
 * @Description: 执行者视图模块的接口
 * @Date: 2018-08-20 13:15:28
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-12 13:44:01
 */

export default function performerView(api) {
  return {
    // 视图的公共列表接口（创建者、执行者、管理者）
    queryTaskList: query => api.post('/groovynoauth/fsp/campaign/mot/queryMOTMissions2', query),
    // 执行者视图的详情基本信息
    queryTaskDetailBasicInfo: query => api.post('/groovynoauth/fsp/campaign/mot/queryMissionDetailedInfo', query),
    // 执行者视图的目标客户
    queryTargetCust: query => api.post('/groovynoauth/fsp/campaign/mot/queryCustListOfMission', query),
    // 执行者视图的目标客户的详情
    queryTargetCustDetail: query => api.post('/groovynoauth/fsp/campaign/mot/queryCustDetail', query),
    // 执行视图下添加服务记录
    addMotServeRecord: query => api.post('/groovynoauth/fsp/cust/service/addMotServeRecord2', query),
    // 上传文件需要先上传uuid
    queryCustUuid: query => api.post('/groovynoauth/fsp/campaign/mot/queryCustUuid', query),
    // 删除文件
    ceFileDelete: query => api.post('/fspa/mcrm/api/file/ceFileDelete2', query),
    // 获取任务简报
    getMissionBrief: query => api.post('/groovynoauth/fsp/campaign/mot/getMissionBrief', query),
    // 预览客户明细
    previewCustDetail: query => api.post('/groovynoauth/fsp/campaign/mot/queryCustListOfMission', query),
    // 管理者视图查询任务的详细信息
    queryMngrMissionDetailInfo: query => api.post('/groovynoauth/fsp/campaign/mot/queryMngrMissionDetailInfo', query),
    // 管理者视图客户反馈一二级
    countFlowFeedBack: query => api.post('/groovynoauth/fsp/campaign/mot/countFlowFeedBack', query),
    // 管理者视图任务实施进度
    countFlowStatus: query => api.post('/groovynoauth/fsp/campaign/mot/countFlowStatus', query),
    // 添加服务记录中 服务类型
    getServiceType: query => api.post('/groovynoauth/fsp/campaign/mot/queryMissionList22ForTask', query),
    // 问卷调查
    getTempQuesAndAnswer: query => api.post('/groovynoauth/fsp/assess/common/queryTempQuesAndAnswer', query),
    // 问卷调查保存答案
    saveAnswersByType: query => api.post('/groovynoauth/fsp/assess/common/saveAnswersByType', query),
    // 任务反馈统计接口
    countAnswersByType: query => api.post('/groovynoauth/fsp/assess/common/countAnswersByType', query),
    // 任务反馈已反馈总数统计
    countExamineeByType: query => api.post('/groovynoauth/fsp/assess/common/countExamineeByType', query),
    // 导出
    exportCustListExcel: query => api.post('/groovynoauth/fsp/assess/common/exportCustListExcel', query),
    // 执行者视图查客户
    queryCustomer: query => api.post('/groovynoauth/fsp/cust/custlist/queryMssnCustsByExecutorId', query),
    // 任务列表管理者视图下任务实施简报的生成
    createMotReport: query => api.post('/groovynoauth/fsp/campaign/mot/createMOTFeedBackExcelFile', query),
    // 获取生成报告信息
    queryMOTServeAndFeedBackExcel: query => api.post('/groovynoauth/fsp/campaign/mot/queryMOTFeedBackExcel', query),
    // 获取去重后的客户数量
    queryDistinctCustomerCount: query => api.post('/groovynoauth/fsp/campaign/mot/queryDistinctCustListOfMission', query),
    // 获取服务经理维度任务数据
    getCustManagerScope: query => api.post('/groovynoauth/fsp/campaign/mot/queryEmpListOfMission', query),
    // 查询涨乐财富通服务方式下给予客户选择的客户反馈选项
    queryCustFeedbackList: query => api.post('/groovynoauth/fsp/campaign/mot/queryCustOptionsByTaskType', query),
    // 查询涨乐财富通服务方式下的审批人
    queryApproval: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/queryNextApproval', query),
    // 查询服务结果进度
    queryExecutorFlowStatus: query => api.post('/groovynoauth/fsp/campaign/mot/queryExecutorFlowStatus', query),
    // 查询服务结果客户反馈
    queryExecutorFeedBack: query => api.post('/groovynoauth/fsp/campaign/mot/queryExecutorFeedBack', query),
    // 查询客户明细
    queryExecutorDetail: query => api.post('/groovynoauth/fsp/campaign/mot/queryExecutorDetail', query),
    // 服务经理维度查询客户明细
    previewCustDetailByScope: query => api.post('/groovynoauth/fsp/campaign/mot/queryCustListDetailOfMission', query),
    // 获取服务经理维度去重后的客户数量
    queryDistinctCustListDetailOfMission: query => api.post('/groovynoauth/fsp/campaign/mot/queryDistinctCustListDetailOfMission', query),
    // 根据任务类型获取任务绑定的投资建议模板列表
    getTemplateList: query => api.post('/groovynoauth/fsp/campaign/investAdvice/queryTemplateListByType', query),
    // 翻译投资建议模板
    translateTemplate: query => api.post('/groovynoauth/fsp/campaign/investAdvice/replaceCustIndexPlaceHoders', query),
    // 获取客户名下其他代办任务
    getOtherTaskList: query => api.post('/groovynoauth/fsp/campaign/mot/queryCustBacklogTaskList', query),
    // 查询可以分配任务的人员列表
    queryAllotEmpList: query => api.post('/groovynoauth/fsp/campaign/mot/queryDispatchableEmpList', query),
    // 选择了人员后将任务分配给该人员
    dispatchTaskToEmp: query => api.post('/groovynoauth/fsp/campaign/mot/dispatchToEmpDirectly', query),
    // 针对 MOT 回访类型任务添加服务记录接口
    addMotReturnVisitServiceRecord: query => api.post('/groovynoauth/fsp/cust/service/addMotTGVisitServeRecord', query),
    // 批量添加服务记录
    saveBatchAddServiceRecord: query => api.post('/groovynoauth/fsp/cust/service/addBatchedMotServeRecord', query),
  };
}
