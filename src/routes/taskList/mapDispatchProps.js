/**
 * @Author: sunweibin
 * @Date: 2018-04-13 10:21:18
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-20 13:19:06
 * @description 为了Home页面的代码整洁，将dva的connect需要用到的mapDispatchToProps移至此处成立独立模块
 */
import effects from './effects';

export default ({ routerRedux, effect }) => ({
  push: routerRedux.push,
  replace: routerRedux.replace,
  // 获取左侧列表
  getTaskList: effect(effects.getTaskList),
  // 添加服务记录
  addServeRecord: effect(effects.addServiceRecord),
  // 手动上传日志
  handleCollapseClick: effect(effects.handleCollapseClick, { loading: false }),
  // 最近五次服务记录
  getServiceRecord: effect(effects.getServiceRecord),
  // 获取最近6个月收益
  getCustIncome: effect(effects.getCustIncome, { loading: false }),
  // 改变详情中的用来查询的参数
  changeParameter: effect(effects.changeParameter),
  // 查询详情中目标客户信息（列表和列表第一条客户的详情）
  queryTargetCust: effect(effects.queryTargetCust),
  // 查询详情中目标客户的详情
  queryTargetCustDetail: effect(effects.queryTargetCustDetail),
  // 右侧详情的基本信息
  getTaskDetailBasicInfo: effect(effects.getTaskDetailBasicInfo),
  // 获取添加服务记录和上传附件用的custUuid
  queryCustUuid: effect(effects.queryCustUuid),
  // 预览客户文件
  previewCustFile: effect(effects.previewCustFile),
  // 创建者视图的详情接口
  getTaskBasicInfo: effect(effects.getTaskBasicInfo),
  getCeFileList: effect(effects.getCeFileList, { loading: false }),
  // 清除数据
  clearTaskFlowData: effect(effects.clearTaskFlowData, { loading: false }),
  // 清除自建任务数据
  clearCreateTaskData: effect(effects.clearCreateTaskData, { loading: false }),
  // 删除文件接口
  ceFileDelete: effect(effects.ceFileDelete),
  // 预览客户明细
  previewCustDetail: effect(effects.previewCustDetail, { forceFull: true }),
  // 查询管理者视图任务详细信息中的基本信息
  queryMngrMissionDetailInfo: effect(effects.queryMngrMissionDetailInfo),
  // 管理者视图一二级客户反馈
  countFlowFeedBack: effect(effects.countFlowFeedBack),
  // 管理者视图任务实施进度
  countFlowStatus: effect(effects.countFlowStatus),
  // 获取添加服务记录中的任务反馈
  getServiceType: effect(effects.getServiceType),
  // 查询问卷调查题目
  // 展示loading
  getTempQuesAndAnswer: effect(effects.getTempQuesAndAnswer),
  // 展示全局的loading
  saveAnswersByType: effect(effects.saveAnswersByType, { forceFull: true }),
  countAnswersByType: effect(effects.countAnswersByType, { loading: false }),
  countExamineeByType: effect(effects.countExamineeByType, { loading: false }),
  exportCustListExcel: effect(effects.exportCustListExcel),
  createMotReport: effect(effects.createMotReport),
  queryMOTServeAndFeedBackExcel: effect(effects.queryMOTServeAndFeedBackExcel),
  modifyLocalTaskList: effect(effects.modifyLocalTaskList, { loading: false }),
  // 查询去重后的客户数量
  queryDistinctCustomerCount: effect(effects.queryDistinctCustomerCount, { loading: false }),
  // 服务经理维度任务数据
  getCustManagerScope: effect(effects.getCustManagerScope),
  // 查询涨乐财富通服务方式下的客户反馈列表
  queryCustFeedbackList4ZLFins: effect(effects.queryCustFeedbackList4ZLFins, { loading: false }),
  // 查询涨乐财富通服务方式下的审批人列表
  queryApprovalList: effect(effects.queryApprovalList, { loading: false }),
  // 执行者视图右侧详情查询客户
  queryCustomer: effect(effects.queryCustomerForServiceImplementation),
  // 保存打电话时默认添加的服务记录的信息
  toggleServiceRecordModal: effect(effects.toggleServiceRecordModal, { loading: false }),
  // 重置打电话时自动生成的服务记录的数据
  resetServiceRecordInfo: effect(effects.resetServiceRecordInfo, { loading: false }),
  // 投资建议文本撞墙检测
  testWallCollision: effect(effects.testWallCollision),
  // 清除执行者视图右侧搜索客户列表
  clearCustListForServiceImplementation: effect(effects.clearCustListForServiceImplementation,
    { loading: false }),
  // 添加通话记录关联服务记录
  addCallRecord: effect(effects.addCallRecord, { loading: false }),
  // 执行者视图详情中tab切换
  changePerformerViewTab: effect(effects.changePerformerViewTab, { loading: false }),
  // 查询服务结果记录
  queryExecutorFlowStatus: effect(effects.queryExecutorFlowStatus),
  // 查询服务结果反馈
  queryExecutorFeedBack: effect(effects.queryExecutorFeedBack),
  // 查询服务结果明细
  queryExecutorDetail: effect(effects.queryExecutorDetail, { loading: false }),
  // 任务服务经理维度预览客户明细
  previewCustDetailByScope: effect(effects.previewCustDetailByScope, { forceFull: true }),
  // 服务经理维度客户明细去重
  queryDistinctCustListDetailOfMission: effect(effects.queryDistinctCustListDetailOfMission,
    { loading: false }),
  // 客户名下其他代办任务
  getOtherTaskList: effect(effects.getOtherTaskList, { loading: true }),
  // 查询导入的执行者视图，服务结果下的客户是否超过了1000个或者是否是我名下的客户
  isSendCustsServedByPostn: effect(effects.isSendCustsServedByPostn),
  // 批量添加服务记录数据发生变化时的回调函数
  changeBatchServiceRecordForm: effect(effects.changeBatchServiceRecordForm),
  // 批量添加服务记录
  saveBatchAddServiceRecord: effect(effects.saveBatchAddServiceRecord),
});
