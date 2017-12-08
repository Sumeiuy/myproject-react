/**
 * @file SeibelHeaderConnected.js
 * 公共头部筛选取数据
 * @author honggaunqging
 */
import { connect } from 'react-redux';
import SeibelHeader from './RecoverPageHeader';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});
const mapStateToProps = state => ({
  // 审批人列表
  approvePersonList: state.app.approvePersonList,
  // 拟稿人列表
  drafterList: state.app.drafterList,
  // 部门
  custRange: state.app.custRange,
  // 已申请客户
  customerList: state.app.customerList,
});

const mapDispatchToProps = {
  // 搜索服务人员列表
  getSearchServerPersonList: fetchDataFunction(false, 'permission/getSearchServerPersonList'),
  // 获取审批人列表
  getApprovePersonList: fetchDataFunction(false, 'app/getApprovePersonList'),
  // 获取拟稿人列表
  getDrafterList: fetchDataFunction(false, 'app/getDrafterList'),
  // 获取部门
  getCustRange: fetchDataFunction(false, 'app/getCustRange'),
  // 获取已申请客户列表
  getCustomerList: fetchDataFunction(false, 'app/getCustomerList'),
};

export default connect(mapStateToProps, mapDispatchToProps)(SeibelHeader);
