/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-01 14:56:05
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-01 15:45:55
 * redux连接的创建服务记录
 */

import { connect } from 'react-redux';
import CreateServiceRecord from './CreateServiceRecord';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // uuid
  custUuid: state.customerPool.custUuid,
  // 删除附件结果
  deleteFileResult: state.customerPool.deleteFileResult,
});

const mapDispatchToProps = {
  // 获取uuid
  queryCustUuid: fetchDataFunction(true, 'customerPool/queryCustUuid'),
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateServiceRecord);
