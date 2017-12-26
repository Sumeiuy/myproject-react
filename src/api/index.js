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

const api = apiCreator();

export default {
  // 暴露api上的几个底层方法: get / post
  ...api,
  // ========= 公用接口
  common: common(api),
  // ========= 客户资源池
  customerPool: customerPool(api),
  // ========= 执行者视图
  performerView: performerView(api),
  // ========= 绩效视图
  report: report(api),
  // ========= 反馈管理
  feedback: feedback(api),
  // ==========seibel 通用接口
  seibel: seibelCommon(api),
  // ==========权限申请私有接口
  permission: permission(api),
  // 合作合约相关接口
  contract: contract(api),
  // 通道类型协议相关接口
  channelsTypeProtocol: channelsTypeProtocol(api),
  // ==========佣金调整的数据接口end
  commission: commission(api),
  // 降级客户接口
  demote: demote(api),
  // 分公司客户划转接口api
  filialeCustTransfer: filialeCustTransfer(api),
  // 汇报关系树页面
  relation: relation(api),
  // 客户反馈
  customerFeedback: customerFeedback(api),
};

