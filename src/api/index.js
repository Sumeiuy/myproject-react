import apiCreator from '../utils/apiCreator';
import customerPool from './customerPool';
import report from './report';
import feedback from './feedback';

const api = apiCreator();

export default {
  // 暴露api上的几个底层方法: get / post
  ...api,

  // ========= 客户资源池
  customerPool: customerPool(api),
  // ========= 绩效视图
  report: report(api),
  // ========= 反馈管理
  feedback: feedback(api),
};

