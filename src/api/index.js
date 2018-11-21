import apiCreator from '../utils/apiCreator';
import commonAPI from './common';
import reportAPI from './report';
import feedbackAPI from './feedback';
import permissionAPI from './permission';
import commissionAPI from './commission';
import customerPoolAPI from './customerPool';
import contractAPI from './contract';
import channelsTypeProtocolAPI from './channelsTypeProtocol';
import seibelCommonAPI from './seibelCommon';
import performerViewAPI from './performerView';
import demoteAPI from './demote';
import relationAPI from './relation';
import customerFeedbackAPI from './customerFeedback';
import taskFeedbackAPI from './taskFeedback';
import mainPositionAPI from './mainPosition';
import morningBoradcastAPI from './morningBoradcast';
import preSaleQueryAPI from './preSaleQuery';
import stockAPI from './stock';
import pointsExchangeAPI from './pointsExchange';
import userCenterAPI from './userCenter';
import telephoneNumberManageAPI from './telephoneNumberManage';
import choicenessCombinationAPI from './choicenessCombination';
import investmentAdviceAPI from './investmentAdvice';
import operationCenterAPI from './operationCenter';
import custAllotAPI from './custAllot';
import messageCenterAPI from './messageCenter';
import stockOptionEvaluationAPI from './stockOptionEvaluation';
import latestViewAPI from './latestView';
import keyMonitorAccountAPI from './keyMonitorAccount';
import custRelationshipsAPI from './custRelationships';
import cancelAccountOLAPI from './cancelAccountOL';
import customerLabelAPI from './customerLabel';
import accountLimitAPI from './accountLimit';
import labelManagementAPI from './labelManagement';
import tempDeputeAPI from './tempDepute';
import newHomeAPI from './newHome';
import advisorSpaceAPI from './advisorSpace';
import customerDetailAPI from './customerDetail';
import detailServiceRelationAPI from './detailServiceRelationship';
import detailAccountInfoAPI from './detailAccountInfo';
import detailCustPropertyAPI from './detailCustProperty';
import taskAnalysisReportAPI from './taskAnalysisReport';
import detailInvestmentAbilityAnalysisAPI from './detailInvestmentAbilityAnalysis';

const api = apiCreator();

const exported = {
  // 暴露api上的几个底层方法: get / post
  ...api,

  // ========== 公用接口
  common: commonAPI(api),

  // ========== 客户资源池
  customerPool: customerPoolAPI(api),

  // ========== 执行者视图
  performerView: performerViewAPI(api),

  // ========== 绩效视图
  report: reportAPI(api),

  // ========== 反馈管理
  feedback: feedbackAPI(api),

  // ========== seibel 通用接口
  seibel: seibelCommonAPI(api),

  // ========== 权限申请私有接口
  permission: permissionAPI(api),

  // ========== 合作合约相关接口
  contract: contractAPI(api),

  // ========== 通道类型协议相关接口
  channelsTypeProtocol: channelsTypeProtocolAPI(api),

  // ========== 佣金调整的数据接口end
  commission: commissionAPI(api),

  // ========== 汇报关系树页面
  relation: relationAPI(api),

  // ========== 设置主职位接口
  mainPosition: mainPositionAPI(api),

  // ========== 降级客户接口
  demote: demoteAPI(api),

  // ========== 客户反馈
  customerFeedback: customerFeedbackAPI(api),

  // ========== 任务反馈
  taskFeedback: taskFeedbackAPI(api),

  // ========== 晨报
  morningBoradcast: morningBoradcastAPI(api),

  // ========== 售前适当性查询
  preSaleQuery: preSaleQueryAPI(api),

  // ========== 个股资讯
  stock: stockAPI(api),

  // ========== 积分兑换历史查询
  pointsExchange: pointsExchangeAPI(api),

  // ========== 用户中心
  userCenter: userCenterAPI(api),

  // ========== 公务手机和电话卡号管理
  telephoneNumberManage: telephoneNumberManageAPI(api),

  // ========== 精选组合
  choicenessCombination: choicenessCombinationAPI(api),

  // ========== 投资建议模板
  investmentAdvice: investmentAdviceAPI(api),

  // ========== 平台参数-运营中心
  operationCenter: operationCenterAPI(api),

  // ========== 客户分配分公司客户分配
  custAllot: custAllotAPI(api),

  // ========== 消息通知提醒
  messageCenter: messageCenterAPI(api),

  // ========== 股票期权评估申请
  stockOptionEvaluation: stockOptionEvaluationAPI(api),

  // ========== 最新观点
  latestView: latestViewAPI(api),

  // ========== 消息通知提醒
  keyMonitorAccount: keyMonitorAccountAPI(api),

  // ========== 客户关联关系
  custRelationships: custRelationshipsAPI(api),

  // ========== 线上销户
  cancelAccountOL: cancelAccountOLAPI(api),

  // ========== 客户自定义标签
  customerLabel: customerLabelAPI(api),
  // ========== 账户限制管理
  accountLimit: accountLimitAPI(api),
  // ========== 管理标签页面
  labelManagement: labelManagementAPI(api),
  // ========== 临时委托他人处理任务
  tempDepute: tempDeputeAPI(api),
  // ========== 丰富首页内容
  newHome: newHomeAPI(api),
  // ========== 投顾空间申请
  advisorSpace: advisorSpaceAPI(api),
  // ========== 新版客户360详情API
  customerDetail: customerDetailAPI(api),
  // ========== 新版客户360详情下账户信息Tab组件的API
  detailAccountInfo: detailAccountInfoAPI(api),
  // ========== 新版客户360详情下服务关系的API
  detailServiceRelationship: detailServiceRelationAPI(api),
  // ========== 新版客户360详情下客户属性Tab组件的API
  detailCustProperty: detailCustPropertyAPI(api),
  // ========== SMART任务相关运营报表
  taskAnalysisReport: taskAnalysisReportAPI(api),
  // ========== 客户360-投资能力分析相关api
  detailInvestmentAbilityAnalysis: detailInvestmentAbilityAnalysisAPI(api),
};

export default exported;

export const {
  common,
  customerPool,
  performerView,
  report,
  feedback,
  seibel,
  permission,
  contract,
  channelsTypeProtocol,
  commission,
  relation,
  mainPosition,
  demote,
  customerFeedback,
  taskFeedback,
  morningBoradcast,
  preSaleQuery,
  stock,
  pointsExchange,
  userCenter,
  telephoneNumberManage,
  choicenessCombination,
  investmentAdvice,
  operationCenter,
  custAllot,
  messageCenter,
  stockOptionEvaluation,
  latestView,
  keyMonitorAccount,
  custRelationships,
  cancelAccountOL,
  customerLabel,
  accountLimit,
  labelManagement,
  tempDepute,
  newHome,
  advisorSpace,
  customerDetail,
  detailServiceRelationship,
  detailAccountInfo,
  detailCustProperty,
  taskAnalysisReport,
  detailInvestmentAbilityAnalysis,
} = exported;
