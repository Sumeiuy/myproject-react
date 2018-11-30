/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性相关effect,mapStateToProps,mapDispatchToProps
 * @Date: 2018-11-06 14:50:44
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-30 09:24:39
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
  // 个人客户联系方式数据
  personalContactWay: state.detailCustProperty.personalContactWay,
  // 机构客户联系方式数据
  orgContactWay: state.detailCustProperty.orgContactWay,
  // 财务信息
  financeData: state.detailCustProperty.financeData,
  // 字典
  cust360Dict: state.detailCustProperty.cust360Dict,
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
  // 查询个人客户联系方式数据
  queryPersonalContactWay: effect('detailCustProperty/queryPersonalContactWay'),
  // 查询机构客户联系方式数据
  queryOrgContactWay: effect('detailCustProperty/queryOrgContactWay'),
  // 改变个人客户联系方式中的请勿发短信、请勿打电话
  changePhoneInfo: effect('detailCustProperty/changePhoneInfo', { loading: false }),
  // 查询个人客户、机构客户的财务信息
  queryFinanceDetail: effect('detailCustProperty/queryFinanceDetail', { loading: true }),
  // 编辑个人客户的财务信息
  updatePerFinaceData: effect('detailCustProperty/updatePerFinaceData', { loading: false }),
  // 编辑机构客户的财务信息
  updateOrgFinaceData: effect('detailCustProperty/updateOrgFinaceData', { loading: false }),
  // 新增|修改个人客户电话信息
  updatePerPhone: effect('detailCustProperty/updatePerPhone'),
  // 新增|修改个人客户地址信息
  updatePerAddress: effect('detailCustProperty/updatePerAddress'),
  // 新增|修改个人客户其他信息
  updatePerOther: effect('detailCustProperty/updatePerOther'),
  // 删除个人|机构客户的非主要联系方式
  delContact: effect('detailCustProperty/delContact'),
  // 新增|修改机构客户电话信息
  updateOrgPhone: effect('detailCustProperty/updateOrgPhone'),
  // 新增|修改机构客户地址信息
  updateOrgAddress: effect('detailCustProperty/updateOrgAddress'),
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
