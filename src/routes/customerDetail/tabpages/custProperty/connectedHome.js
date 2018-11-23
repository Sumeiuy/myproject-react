/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性相关effect,mapStateToProps,mapDispatchToProps
 * @Date: 2018-11-06 14:50:44
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-22 13:43:53
 */
import { connect } from 'dva';

import { dva } from '../../../../helper';

import Home from './Home';

// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 客户基本信息
  custInfo: state.detailCustProperty.custInfo,
  // 涨乐U会员信息
  zlUMemberInfo: state.detailCustProperty.zlUMemberInfo,
  // 涨乐U会员等级变更
  zlUMemberLevelChangeRecords: state.detailCustProperty.zlUMemberLevelChangeRecords,
  // 客户基本信息
  customerBasicInfo: state.customerDetail.customerBasicInfo,
  // 紫金积分会员信息
  zjPointMemberInfo: state.detailCustProperty.zjPointMemberInfo,
  // 紫金积分会员积分兑换流水
  zjPointExchangeFlow: state.detailCustProperty.zjPointExchangeFlow,
});

const mapDispatchToProps = {
  // 获取客户属性信息
  queryCustomerProperty: effect('detailCustProperty/queryCustomerProperty', { loading: true }),
  // 获取涨乐财富通U会员信息
  queryZLUmemberInfo: effect('detailCustProperty/queryZLUmemberInfo', { loading: true }),
  // 获取涨乐财富通U会员等级变更记录
  queryZLUmemberLevelChangeRecords: effect('detailCustProperty/queryZLUmemberLevelChangeRecords', { loading: true }),
  // 获取紫金积分会员信息
  queryZjPointMemberInfo: effect('detailCustProperty/queryZjPointMemberInfo', { loading: true }),
  // 获取紫金积分会员积分兑换流水
  queryZjPointExchangeFlow: effect('detailCustProperty/queryZjPointExchangeFlow', { loading: true }),
  // 修改个人客户、机构客户的基本信息
  updateCustBasicInfo: effect('detailCustProperty/updateCustBasicInfo', { loading: false }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
