/*
 * @Author: sunweibin
 * @Date: 2018-10-09 15:33:02
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-28 18:41:25
 * @description 此处使用dva的connect包装下新版customer360Detail首页
 */
import { connect } from 'dva';

import { dva } from '../../helper';

import Home from './Home';

// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 新版客户360详情中的概要信息
  summaryInfo: state.customerDetail.summaryInfo,
  // 更多重点标签信息
  moreLabelInfo: state.customerDetail.moreLabelInfo,
  // 自建任务平台的服务类型、任务反馈字典
  motSelfBuiltFeedbackList: state.app.motSelfBuiltFeedbackList,
  // 客户基本信息
  customerBasicInfo: state.customerDetail.customerBasicInfo,
  // 发送保存服务记录请求成功的服务id
  currentCommonServiceRecord: state.customerPool.currentCommonServiceRecord,
  // 客户360客户属性字典接口
  cust360Dict: state.customerDetail.cust360Dict,
});

const mapDispatchToProps = {
  // 清除Redux中的数据
  clearReduxData: effect('customerDetail/clearReduxData', { loading: false }),
  // 查询客户360详情概要信息
  queryCustSummaryInfo: effect('customerDetail/queryCustSummaryInfo'),
  // 查询更多重点标签
  queryAllKeyLabels: effect('customerDetail/queryAllKeyLabels'),
  // 客户列表添加服务记录
  addServeRecord: effect('customerPool/addCommonServeRecord', { loading: true }),
  // 获取客户反馈字典
  getMotCustfeedBackDict: effect('app/getMotCustfeedBackDict', { loading: true }),
  // 添加服务记录窗口
  toggleServiceRecordModal: effect('app/toggleServiceRecordModal', {loading: true}),
  // 获取客户基本信息
  getCustomerBasicInfo: effect('customerDetail/getCustomerBasicInfo', {loading: true}),
  addCallRecord: effect('customerPool/addCallRecord', {loading: true}),
  // 查询省市城市
  queryProvinceCity: effect('customerPool/queryProvinceCity', { loading: false }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
