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
});

const mapDispatchToProps = {
  // 获取拟稿人列表
  getDrafterList: fetchDataFunction(false, 'app/getDrafterList'),
};

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);
