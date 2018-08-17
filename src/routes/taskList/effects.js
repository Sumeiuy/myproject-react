/**
 * @Author: sunweibin
 * @Date: 2018-04-13 10:10:16
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-08-15 13:51:44
 * @description 任务管理页面需要用到的dva的effects,封装此处为了方便Home页面代码的整洁
 */

const effects = {
  getTaskList: 'performerView/getTaskList',
  addServiceRecord: 'performerView/addMotServeRecord',
  // 手动上传日志
  handleCollapseClick: 'contactModal/handleCollapseClick',
  getServiceRecord: 'customerPool/getServiceRecord',
  getCustIncome: 'customerPool/getCustIncome',
  changeParameter: 'performerView/changeParameter',
  queryTargetCust: 'performerView/queryTargetCust',
  queryTargetCustDetail: 'performerView/queryTargetCustDetail',
  getTaskDetailBasicInfo: 'performerView/getTaskDetailBasicInfo',
  queryCustUuid: 'performerView/queryCustUuid',
  getServiceType: 'performerView/getServiceType',
  previewCustFile: 'tasklist/previewCustFile',
  getTaskBasicInfo: 'tasklist/getTaskBasicInfo',
  ceFileDelete: 'performerView/ceFileDelete',
  getCeFileList: 'customerPool/getCeFileList',
  // 预览客户明细
  previewCustDetail: 'managerView/previewCustDetail',
  // 管理者视图查询任务详细信息中的基本信息
  queryMngrMissionDetailInfo: 'managerView/queryMngrMissionDetailInfo',
  // 管理者视图一二级客户反馈
  countFlowFeedBack: 'managerView/countFlowFeedBack',
  // 管理者视图任务实施进度
  countFlowStatus: 'managerView/countFlowStatus',
  getTempQuesAndAnswer: 'performerView/getTempQuesAndAnswer',
  saveAnswersByType: 'performerView/saveAnswersByType',
  // 任务反馈统计
  countAnswersByType: 'performerView/countAnswersByType',
  // 任务反馈已反馈总数
  countExamineeByType: 'performerView/countExamineeByType',
  exportCustListExcel: 'managerView/exportCustListExcel',
  // 生成mot任务实施简报
  createMotReport: 'managerView/createMotReport',
  // 获取生成报告的信息
  queryMOTServeAndFeedBackExcel: 'managerView/queryMOTServeAndFeedBackExcel',
  // 修改左侧列表的任务状态
  modifyLocalTaskList: 'performerView/modifyLocalTaskList',
  // 查询去重后的客户数量
  queryDistinctCustomerCount: 'managerView/queryDistinctCustomerCount',
  // 查询服务经理维度任务的详细客户信息
  getCustManagerScope: 'managerView/getCustManagerScope',
  // 清空任务流数据
  clearTaskFlowData: 'customerPool/clearTaskFlowData',
  // 清空自建任务数据
  clearCreateTaskData: 'customerPool/clearCreateTaskData',
  // 查询涨乐财富通服务方式下的客户反馈列表
  queryCustFeedbackList4ZLFins: 'performerView/queryCustFeedbackList4ZLFins',
  // 查询涨乐财富通服务方式下的审批人列表
  queryApprovalList: 'performerView/queryApprovalList4ZLFins',
  // 执行者视图右侧详情查询客户列表
  queryCustomerForServiceImplementation: 'performerView/queryCustomerForServiceImplementation',
  toggleServiceRecordModal: 'app/toggleServiceRecordModal',
  resetServiceRecordInfo: 'app/resetServiceRecordInfo',
  // 投资建议文本撞墙检测
  testWallCollision: 'investmentAdvice/testWallCollision',
  // 清空执行者视图右侧搜索客户
  clearCustListForServiceImplementation: 'performerView/clearCustListForServiceImplementation',
  // 添加通话记录关联服务记录
  addCallRecord: 'customerPool/addCallRecord',
  // 执行者视图详情中tab切换
  changePerformerViewTab: 'performerView/changePerformerViewTab',
  // 查询服务结果进度
  queryExecutorFlowStatus: 'performerView/queryExecutorFlowStatus',
  // 查询服务结果反馈
  queryExecutorFeedBack: 'performerView/queryExecutorFeedBack',
  // 查询服务结果反馈
  queryExecutorDetail: 'performerView/queryExecutorDetail',
  // 任务服务经理维度预览客户明细
  previewCustDetailByScope: 'managerView/previewCustDetailByScope',
  // 服务经理维度客户明细去重
  queryDistinctCustListDetailOfMission: 'managerView/queryDistinctCustListDetailOfMission',
  // 查询导入的执行者视图，服务结果下的客户是否超过了1000个或者是否是我名下的客户
  isSendCustsServedByPostn: 'customerPool/isSendCustsServedByPostn',
};

export default effects;
