import apiCreator from '../utils/apiCreator';
import common from './common';
import report from './report';
import feedback from './feedback';
import permission from './permission';
import commission from './commission';
import customerPool from './customerPool';
import contract from './contract';
import channelsTypeProtocol from './channelsTypeProtocol';
import seibelCommon from './seibelCommon';
import performerView from './performerView';
import demote from './demote';
import filialeCustTransfer from './filialeCustTransfer';
import relation from './relation';
import customerFeedback from './customerFeedback';
import taskFeedback from './taskFeedback';
import mainPosition from './mainPosition';
import morningBoradcast from './morningBoradcast';
import preSaleQuery from './preSaleQuery';
import stock from './stock';
import pointsExchange from './pointsExchange';
import userCenter from './userCenter';
import telephoneNumberManage from './telephoneNumberManage';
import choicenessCombination from './choicenessCombination';
import investmentAdvice from './investmentAdvice';
import operationCenter from './operationCenter';
import businessDepartmentCustomerDistribute from './businessDepartmentCustomerDistribute';
import custAllot from './custAllot';
import messageCenter from './messageCenter';
import stockOptionEvaluation from './stockOptionEvaluation';
import latestView from './latestView';
import keyMonitorAccount from './keyMonitorAccount';
import custRelationships from './custRelationships';
import cancelAccountOL from './cancelAccountOL';
import customerLabel from './customerLabel';

const api = apiCreator();

export default {
  // 暴露api上的几个底层方法: get / post
  ...api,
  // ========== 公用接口
  common: common(api),
  // ========== 客户资源池
  customerPool: customerPool(api),
  // ========== 执行者视图
  performerView: performerView(api),
  // ========== 绩效视图
  report: report(api),
  // ========== 反馈管理
  feedback: feedback(api),
  // ========== seibel 通用接口
  seibel: seibelCommon(api),
  // ========== 权限申请私有接口
  permission: permission(api),
  // ========== 合作合约相关接口
  contract: contract(api),
  // ========== 通道类型协议相关接口
  channelsTypeProtocol: channelsTypeProtocol(api),
  // ========== 佣金调整的数据接口end
  commission: commission(api),
  // ========== 汇报关系树页面
  relation: relation(api),
  // ========== 设置主职位接口
  mainPosition: mainPosition(api),
  // ========== 降级客户接口
  demote: demote(api),
  // ========== 分公司客户划转接口api
  filialeCustTransfer: filialeCustTransfer(api),
  // ========== 客户反馈
  customerFeedback: customerFeedback(api),
  // ========== 任务反馈
  taskFeedback: taskFeedback(api),
  // ========== 晨报
  morningBoradcast: morningBoradcast(api),
  // ========== 售前适当性查询
  preSaleQuery: preSaleQuery(api),
  // ========== 个股资讯
  stock: stock(api),
  // ========== 积分兑换历史查询
  pointsExchange: pointsExchange(api),
  // ========== 用户中心
  userCenter: userCenter(api),
  // ========== 公务手机和电话卡号管理
  telephoneNumberManage: telephoneNumberManage(api),
  // ========== 精选组合
  choicenessCombination: choicenessCombination(api),
  // ========== 投资建议模板
  investmentAdvice: investmentAdvice(api),
  // ========== 平台参数-运营中心
  operationCenter: operationCenter(api),
  // ========== 客户分配-营业部非投顾签约客户的分配
  businessDepartmentCustDistribute: businessDepartmentCustomerDistribute(api),
  // ========== 客户分配分公司客户分配
  custAllot: custAllot(api),
  // ========== 消息通知提醒
  messageCenter: messageCenter(api),
  // ========== 股票期权评估申请
  stockOptionEvaluation: stockOptionEvaluation(api),
  // ========== 最新观点
  latestView: latestView(api),
  // ========== 消息通知提醒
  keyMonitorAccount: keyMonitorAccount(api),
  // ========== 客户关联关系
  custRelationships: custRelationships(api),
  // ========== 线上销户
  cancelAccountOL: cancelAccountOL(api),
  // ========== 客户自定义标签
  customerLabel: customerLabel(api),
};

