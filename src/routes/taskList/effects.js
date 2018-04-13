/**
 * @Author: sunweibin
 * @Date: 2018-04-13 10:10:16
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-13 10:34:44
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
};

export default effects;
