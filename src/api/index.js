import apiCreator from '../utils/apiCreator';
import common from './common';
import report from './report';
import feedback from './feedback';
import permission from './permission';
import commission from './commission';
import customerPool from './customerPool';
import contract from './contract';
import fullChannelServiceRecord from './fullChannelServiceRecord';
import seibelCommon from './seibelCommon';

const api = apiCreator();

export default {
  // 暴露api上的几个底层方法: get / post
  ...api,
  // ========= 公用接口
  common: common(api),
  // ========= 客户资源池
  customerPool: customerPool(api),
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
  // ==========佣金调整的数据接口end
  commission: commission(api),
  // 全渠道服务记录数据接口api
  fullChannelServiceRecord: fullChannelServiceRecord(api),
};

