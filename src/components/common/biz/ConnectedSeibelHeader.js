/**
 * @file SeibelHeaderConnected.js
 * 公共头部筛选取数据
 * @author honggaunqging
 */
import { connect } from 'dva';
import { dva } from '../../../helper';
import SeibelHeader from './SeibelHeader';

const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 审批人列表
  approvePersonList: state.app.approvePersonList,
  // 拟稿人列表
  drafterList: state.app.drafterList,
  // 部门
  custRange: state.app.custRange,
  // 新的部门
  newCustRange: state.app.newCustRange,
  // 已申请客户
  customerList: state.app.customerList,
  // 新的已申请客户
  newCustomerList: state.app.newCustomerList,
  // 已申请服务经理
  ptyMngList: state.app.ptyMngList,
});

const mapDispatchToProps = {
  // 搜索服务人员列表
  getSearchServerPersonList: effect('permission/getSearchServerPersonList', { loading: false }),
  // 获取审批人列表
  getApprovePersonList: effect('app/getApprovePersonList', { loading: false }),
  // 获取拟稿人列表
  getDrafterList: effect('app/getDrafterList', { loading: false }),
  // 获取已申请服务经理列表
  getPtyMngList: effect('app/getPtyMngList', { loading: false }),
  // 获取部门
  getCustRange: effect('app/getCustRange', { loading: false }),
  // 新的获取部门
  getNewCustRange: effect('app/getNewCustRange', { loading: false }),
  // 获取已申请客户列表
  getCustomerList: effect('app/getCustomerList', { loading: false }),
  // 获取新的已申请客户列表
  getNewCustomerList: effect('app/getNewCustomerList', { loading: false }),
};

export default connect(mapStateToProps, mapDispatchToProps)(SeibelHeader);
