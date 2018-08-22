/**
 * @Author: sunweibin
 * @Date: 2018-04-13 11:07:12
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-08-15 13:56:44
 * @description 针对taskList > Home 组件的props类型校验模块
 */
import PropTypes from 'prop-types';

const exported = {
  push: PropTypes.func.isRequired,
  parameter: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  replace: PropTypes.func.isRequired,
  list: PropTypes.object.isRequired,
  getTaskList: PropTypes.func.isRequired,
  addServeRecord: PropTypes.func.isRequired,
  dict: PropTypes.object.isRequired,
  taskDetailBasicInfo: PropTypes.object.isRequired,
  targetCustList: PropTypes.object.isRequired,
  handleCollapseClick: PropTypes.func.isRequired,
  getServiceRecord: PropTypes.func.isRequired,
  serviceRecordData: PropTypes.object.isRequired,
  getCustIncome: PropTypes.func.isRequired,

 // 接口的loading状态
  interfaceState: PropTypes.object.isRequired,

 // 6个月收益数据
  monthlyProfits: PropTypes.object.isRequired,

  targetCustDetail: PropTypes.object.isRequired,
  changeParameter: PropTypes.func.isRequired,
  queryTargetCust: PropTypes.func.isRequired,
  queryTargetCustDetail: PropTypes.func.isRequired,
  custUuid: PropTypes.string.isRequired,
  queryCustUuid: PropTypes.func.isRequired,
  getTaskDetailBasicInfo: PropTypes.func.isRequired,
  priviewCustFileData: PropTypes.object,
  previewCustFile: PropTypes.func.isRequired,
  taskBasicInfo: PropTypes.object.isRequired,
  getTaskBasicInfo: PropTypes.func.isRequired,
  clearTaskFlowData: PropTypes.func.isRequired,
  ceFileDelete: PropTypes.func.isRequired,
  getCeFileList: PropTypes.func.isRequired,
  filesList: PropTypes.array,
  deleteFileResult: PropTypes.array.isRequired,

 // 预览客户细分
  previewCustDetail: PropTypes.func.isRequired,

 // 预览客户细分结果
  custDetailResult: PropTypes.object.isRequired,

  mngrMissionDetailInfo: PropTypes.object.isRequired,
  queryMngrMissionDetailInfo: PropTypes.func.isRequired,
  countFlowFeedBack: PropTypes.func.isRequired,
  custFeedback: PropTypes.array,
  custRange: PropTypes.array,
  empInfo: PropTypes.object,
  missionImplementationDetail: PropTypes.object,
  countFlowStatus: PropTypes.func.isRequired,
  clearCreateTaskData: PropTypes.func.isRequired,
  getServiceType: PropTypes.func.isRequired,
  taskFeedbackList: PropTypes.array.isRequired,
  currentMotServiceRecord: PropTypes.object.isRequired,
  getTempQuesAndAnswer: PropTypes.func.isRequired,
  answersList: PropTypes.object,
  saveAnswersByType: PropTypes.func.isRequired,
  isSubmitSurveySucceed: PropTypes.bool,
  missionFeedbackData: PropTypes.array.isRequired,
  countAnswersByType: PropTypes.func.isRequired,
  missionFeedbackCount: PropTypes.number.isRequired,
  countExamineeByType: PropTypes.func.isRequired,
  attachmentList: PropTypes.array.isRequired,
  custServedByPostnResult: PropTypes.bool.isRequired,
  exportCustListExcel: PropTypes.func.isRequired,
  missionReport: PropTypes.object.isRequired,
  createMotReport: PropTypes.func.isRequired,
  queryMOTServeAndFeedBackExcel: PropTypes.func.isRequired,
  modifyLocalTaskList: PropTypes.func.isRequired,
  queryDistinctCustomerCount: PropTypes.func.isRequired,
  distinctCustomerCount: PropTypes.number.isRequired,
  custManagerScopeData: PropTypes.object.isRequired,
  getCustManagerScope: PropTypes.func.isRequired,
  queryCustFeedbackList4ZLFins: PropTypes.func.isRequired,
  custFeedbackList: PropTypes.array.isRequired,
  queryApprovalList: PropTypes.func.isRequired,
  zhangleApprovalList: PropTypes.array.isRequired,
  custListForServiceImplementation: PropTypes.array,
  clearCustListForServiceImplementation: PropTypes.func.isRequired,
  toggleServiceRecordModal: PropTypes.func.isRequired,
  serviceRecordInfo: PropTypes.object.isRequired,
  resetServiceRecordInfo: PropTypes.func.isRequired,
  addCallRecord: PropTypes.func.isRequired,
  performerViewCurrentTab: PropTypes.string.isRequired,
  changePerformerViewTab: PropTypes.func.isRequired,
  serviceProgress: PropTypes.object.isRequired,
  custFeedBack: PropTypes.array.isRequired,
  custDetail: PropTypes.object.isRequired,
  isShowExecutorDetailLoading: PropTypes.bool.isRequired,
  // custDetailResultByScope: PropTypes.object.isRequired,
  previewCustDetailByScope: PropTypes.func.isRequired,
  // 查询导入的执行者视图，服务结果下的客户是否超过了1000个或者是否是我名下的客户
  isSendCustsServedByPostn: PropTypes.func.isRequired,
  sendCustsServedByPostnResult: PropTypes.object.isRequired,
};

export default exported;
