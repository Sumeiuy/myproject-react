/*
 * @Author: sunweibin
 * @Date: 2018-10-09 15:33:02
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-09 16:10:24
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
