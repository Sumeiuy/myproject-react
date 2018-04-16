/**
 * @Author: sunweibin
 * @Date: 2018-04-13 10:21:18
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-14 11:16:32
 * @description 为了Home页面的代码整洁，将dva的connect需要用到的mapDispatchToProps移至此处成立独立模块
 */
import effects from './effects';

export default ({ routerRedux, dispatch }) => ({
  push: routerRedux.push,
  replace: routerRedux.replace,
  // 获取左侧列表
  getTaskList: dispatch(true, effects.getTaskList),
  // 添加服务记录
  addServeRecord: dispatch(true, effects.addServiceRecord),
  // 手动上传日志
  handleCollapseClick: dispatch(false, effects.handleCollapseClick),
  // 最近五次服务记录
  getServiceRecord: dispatch(true, effects.getServiceRecord),
  // 获取最近6个月收益
  getCustIncome: dispatch(false, effects.getCustIncome),
  // 改变详情中的用来查询的参数
  changeParameter: dispatch(false, effects.changeParameter),
  // 查询详情中目标客户信息（列表和列表第一条客户的详情）
  queryTargetCust: dispatch(true, effects.queryTargetCust),
  // 查询详情中目标客户的详情
  queryTargetCustDetail: dispatch(true, effects.queryTargetCustDetail),
  // 右侧详情的基本信息
  getTaskDetailBasicInfo: dispatch(true, effects.getTaskDetailBasicInfo),
  // 获取添加服务记录和上传附件用的custUuid
  queryCustUuid: dispatch(true, effects.queryCustUuid),
  // 预览客户文件
  previewCustFile: dispatch(true, effects.previewCustFile),
  // 创建者视图的详情接口
  getTaskBasicInfo: dispatch(true, effects.getTaskBasicInfo),
  getCeFileList: dispatch(false, effects.getCeFileList),
  // 清除数据
  clearTaskFlowData: dispatch(false, effects.clearTaskFlowData),
  // 清除自建任务数据
  clearCreateTaskData: dispatch(false, effects.clearCreateTaskData),
  // 删除文件接口
  ceFileDelete: dispatch(true, effects.ceFileDelete),
  // 预览客户明细
  previewCustDetail: dispatch(true, effects.previewCustDetail, true),
  // 查询管理者视图任务详细信息中的基本信息
  queryMngrMissionDetailInfo: dispatch(true, effects.queryMngrMissionDetailInfo),
  // 管理者视图一二级客户反馈
  countFlowFeedBack: dispatch(true, effects.countFlowFeedBack),
  // 管理者视图任务实施进度
  countFlowStatus: dispatch(true, effects.countFlowStatus),
  // 获取添加服务记录中的任务反馈
  getServiceType: dispatch(true, effects.getServiceType),
  // 查询问卷调查题目
  // 展示loading
  getTempQuesAndAnswer: dispatch(true, effects.getTempQuesAndAnswer),
  // 展示全局的loading
  saveAnswersByType: dispatch(true, effects.saveAnswersByType, true),
  countAnswersByType: dispatch(false, effects.countAnswersByType),
  countExamineeByType: dispatch(false, effects.countExamineeByType),
  exportCustListExcel: dispatch(true, effects.exportCustListExcel),
  createMotReport: dispatch(true, effects.createMotReport),
  queryMOTServeAndFeedBackExcel: dispatch(true, effects.queryMOTServeAndFeedBackExcel),
  modifyLocalTaskList: dispatch(false, effects.modifyLocalTaskList),
  // 查询去重后的客户数量
  queryDistinctCustomerCount: dispatch(true, effects.queryDistinctCustomerCount),
  // 服务经理维度任务数据
  getCustManagerScope: dispatch(true, effects.getCustManagerScope),
  // 查询涨乐财富通服务方式下的客户反馈列表
  queryCustFeedbackList4ZLFins: dispatch(true, effects.queryCustFeedbackList4ZLFins),
  // 查询涨乐财富通服务方式下的审批人列表
  queryApprovalList: dispatch(false, effects.queryApprovalList),
});
