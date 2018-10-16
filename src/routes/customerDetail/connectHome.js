/*
 * @Author: sunweibin
 * @Date: 2018-10-09 15:33:02
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 10:42:31
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
});

const mapDispatchToProps = {
  // 清除Redux中的数据
  clearReduxData: effect('customerDetail/clearReduxData', { loading: false }),
  // 查询客户360详情概要信息
  queryCustSummaryInfo: effect('customerDetail/queryCustSummaryInfo'),
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
