/**
 * @Author: sunweibin
 * @Date: 2018-04-13 10:14:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-05-04 10:31:36
 * @description 为了Home页面的代码整洁，将dva的connect需要用到的mapStateToProps移至此处成立独立模块
 */
const mapStateToProps = () => state => ({
  // 记录详情中的参数
  parameter: state.performerView.parameter,
  // 详情中基本信息
  taskDetailBasicInfo: state.performerView.taskDetailBasicInfo,
  // 左侧任务列表
  list: state.performerView.taskList,
  dict: state.app.dict,
  // 详情中目标客户的数据
  targetCustList: state.performerView.targetCustList,
  serviceRecordData: state.customerPool.serviceRecordData,
  // 接口的loading状态
  interfaceState: state.loading.effects,
  // 6个月收益数据
  monthlyProfits: state.customerPool.monthlyProfits,
  // 任务详情中目标客户列表当前选中的详情信息
  targetCustDetail: state.performerView.targetCustDetail,
  // 添加服务记录和上传附件用的custUuid
  custUuid: state.performerView.custUuid,
  // 客户细分导入数据
  priviewCustFileData: state.tasklist.priviewCustFileData,
  taskBasicInfo: state.tasklist.taskBasicInfo,
  filesList: state.customerPool.filesList,
  deleteFileResult: state.performerView.deleteFileResult,
  custDetailResult: state.managerView.custDetailResult,
  // 管理者视图任务详情中的基本信息
  mngrMissionDetailInfo: state.managerView.mngrMissionDetailInfo,
  // 管理者视图一二级客户反馈
  custFeedback: state.managerView.custFeedback,
  // 客户池用户范围
  custRange: state.customerPool.custRange,
  // 职位信息
  empInfo: state.app.empInfo,
  // 管理者视图任务实施进度数据
  missionImplementationDetail: state.managerView.missionImplementationDetail,
  // 任务反馈的字典
  taskFeedbackList: state.performerView.taskFeedbackList,
  // 执行者视图添加服务记录是否成功
  currentMotServiceRecord: state.performerView.currentMotServiceRecord,
  answersList: state.performerView.answersList,
  saveAnswersSucce: state.performerView.saveAnswersSucce,
  // 任务反馈统计数据
  missionFeedbackData: state.performerView.missionFeedbackData,
  // 任务反馈已反馈
  missionFeedbackCount: state.performerView.missionFeedbackCount,
  attachmentList: state.performerView.attachmentList,
  // 是否包含非本人名下客户
  custServedByPostnResult: state.customerPool.custServedByPostnResult,
  missionReport: state.managerView.missionReport,
  // 去重后的客户数量
  distinctCustomerCount: state.managerView.distinctCustomerCount,
  // 服务经理维度任务下的客户数据
  custManagerScopeData: state.managerView.custManagerScopeData,
  // 涨乐财富通服务方式下的客户反馈列表
  custFeedbackList: state.performerView.custFeedbackList,
   // 涨乐财富通服务方式下的审批人列表
  zhangleApprovalList: state.performerView.zhangleApprovalList,
  serviceRecordOfCaller: state.app.serviceRecordModalVisibleOfCaller,
  prevRecordInfo: state.app.prevRecordInfo,
});

export default mapStateToProps;
