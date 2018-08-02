/**
 * @file ConnectedPageHeader.js
 * 执行者视图/操作者视图筛选取数据
 * @author honggaunqging
 */
import { connect } from 'dva';
import PageHeader from './PageHeader';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});
const mapStateToProps = state => ({
  // 拟稿人列表
  drafterList: state.app.drafterList,
  // 执行者视图头部查询到的客户列表
  customerList: state.performerView.customerList,
  // 查询的服务经理列表
  serverManagerList: state.performerView.serverManagerList,
});

const mapDispatchToProps = {
  // 获取拟稿人列表
  getDrafterList: fetchDataFunction(false, 'app/getDrafterList'),
  // 执行者视图头部查询客户
  queryCustomer: fetchDataFunction(false, 'performerView/queryCustomer'),
  // 清除服务经理列表数据
  clearServiceManagerList: fetchDataFunction(false, 'performerView/clearServiceManagerList'),
  // 服务经理列表数据
  getSearchPersonList: fetchDataFunction(false, 'performerView/getSearchPersonList'),
};

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);
