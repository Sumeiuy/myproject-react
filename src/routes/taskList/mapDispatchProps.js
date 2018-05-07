/**
 * @Author: sunweibin
 * @Date: 2018-04-13 10:21:18
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-05-07 10:37:05
 * @description 为了Home页面的代码整洁，将dva的connect需要用到的mapDispatchToProps移至此处成立独立模块
 */
import effects from './effects';

export default ({ routerRedux, dispatch }) => ({
  push: routerRedux.push,
  replace: routerRedux.replace,
  // 获取左侧列表
  getTaskList: dispatch(effects.getTaskList),
  // 添加服务记录
  addServeRecord: dispatch(effects.addServiceRecord),
  // 手动上传日志
  handleCollapseClick: dispatch(effects.handleCollapseClick, { loading: false }),
  // 最近五次服务记录
  getServiceRecord: dispatch(effects.getServiceRecord),
  // 获取最近6个月收益
  getCustIncome: dispatch(effects.getCustIncome, { loading: false }),
  // 改变详情中的用来查询的参数
  changeParameter: dispatch(effects.changeParameter),
  // 查询详情中目标客户信息（列表和列表第一条客户的详情）
  queryTargetCust: dispatch(effects.queryTargetCust),
  // 查询详情中目标客户的详情
  queryTargetCustDetail: dispatch(effects.queryTargetCustDetail),
  // 右侧详情的基本信息
  getTaskDetailBasicInfo: dispatch(effects.getTaskDetailBasicInfo),
  // 获取添加服务记录和上传附件用的custUuid
  queryCustUuid: dispatch(effects.queryCustUuid),
  // 预览客户文件
  previewCustFile: dispatch(effects.previewCustFile),
  // 创建者视图的详情接口
  getTaskBasicInfo: dispatch(effects.getTaskBasicInfo),
  getCeFileList: dispatch(effects.getCeFileList, { loading: false }),
  // 清除数据
  clearTaskFlowData: dispatch(effects.clearTaskFlowData, { loading: false }),
  // 清除自建任务数据
  clearCreateTaskData: dispatch(effects.clearCreateTaskData, { loading: false }),
  // 删除文件接口
  ceFileDelete: dispatch(effects.ceFileDelete),
  // 预览客户明细
  previewCustDetail: dispatch(effects.previewCustDetail, { forceFull: true }),
  // 查询管理者视图任务详细信息中的基本信息
  queryMngrMissionDetailInfo: dispatch(effects.queryMngrMissionDetailInfo),
  // 管理者视图一二级客户反馈
  countFlowFeedBack: dispatch(effects.countFlowFeedBack),
  // 管理者视图任务实施进度
  countFlowStatus: dispatch(effects.countFlowStatus),
  // 获取添加服务记录中的任务反馈
  getServiceType: dispatch(effects.getServiceType),
  // 查询问卷调查题目
  // 展示loading
  getTempQuesAndAnswer: dispatch(effects.getTempQuesAndAnswer),
  // 展示全局的loading
  saveAnswersByType: dispatch(effects.saveAnswersByType, { forceFull: true }),
  countAnswersByType: dispatch(effects.countAnswersByType, { loading: false }),
  countExamineeByType: dispatch(effects.countExamineeByType, { loading: false }),
  exportCustListExcel: dispatch(effects.exportCustListExcel),
  createMotReport: dispatch(effects.createMotReport),
  queryMOTServeAndFeedBackExcel: dispatch(effects.queryMOTServeAndFeedBackExcel),
  modifyLocalTaskList: dispatch(effects.modifyLocalTaskList, { loading: false }),
  // 查询去重后的客户数量
  queryDistinctCustomerCount: dispatch(effects.queryDistinctCustomerCount),
  // 服务经理维度任务数据
  getCustManagerScope: dispatch(effects.getCustManagerScope),
  // 查询涨乐财富通服务方式下的客户反馈列表
  queryCustFeedbackList4ZLFins: dispatch(effects.queryCustFeedbackList4ZLFins, { loading: false }),
  // 查询涨乐财富通服务方式下的审批人列表
  queryApprovalList: dispatch(effects.queryApprovalList, { loading: false }),
  // 保存打电话时默认添加的服务记录的信息
  toggleServiceRecordModal: dispatch(effects.toggleServiceRecordModal, { loading: false }),
  // 打电话时添加服务记录，不需要loading
  addServeRecordOfPhone: dispatch(effects.addServiceRecord, { loading: false }),
  // 重置打电话时自动生成的服务记录的数据
  resetCaller: dispatch(effects.resetCaller, { loading: false }),
});
