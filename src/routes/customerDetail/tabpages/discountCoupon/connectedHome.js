/**
 * @Author: XuWenKang
 * @Description: 客户360-理财优惠券相关effect,mapStateToProps,mapDispatchToProps
 * @Date: 2018-11-06 14:50:44
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-21 15:20:58
 */
import { connect } from 'dva';

import { dva } from '../../../../helper';

import Home from './Home';

// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 优惠券详情
  couponDetail: state.detailDiscountCoupon.couponDetail,
  // 优惠券列表数据
  couponListData: state.detailDiscountCoupon.couponListData,
  // 使用状态列表数据
  couponStatusList: state.detailDiscountCoupon.couponStatusList,
  // 客户基本信息
  customerBasicInfo: state.customerDetail.customerBasicInfo,
});

const mapDispatchToProps = {
  // 获取理财优惠券详情
  queryDiscountCouponDetail: effect('detailDiscountCoupon/queryDiscountCouponDetail', { loading: true }),
  // 获取理财优惠券列表
  queryDiscountCouponList: effect('detailDiscountCoupon/queryDiscountCouponList', { loading: true }),
  // 获取理财优惠券使用状态列表
  queryCouponStatusList: effect('detailDiscountCoupon/queryCouponStatusList', { loading: true }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
