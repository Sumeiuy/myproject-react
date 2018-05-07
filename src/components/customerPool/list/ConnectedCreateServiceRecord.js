/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-01 14:56:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-05-05 13:44:42
 * redux连接的创建服务记录
 */

import { connect } from 'dva';
import CreateServiceRecord from './CreateServiceRecord';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // uuid
  custUuid: state.performerView.custUuid,
  // 删除附件结果
  deleteFileResult: state.performerView.deleteFileResult,
  // 涨乐财富通服务方式下的客户反馈列表
  custFeedbackList: state.performerView.custFeedbackList,
  // 涨乐财富通服务方式下的审批人列表
  zhangleApprovalList: state.performerView.zhangleApprovalList,
});

const mapDispatchToProps = {
  // 获取uuid
  queryCustUuid: fetchDataFunction(true, 'performerView/queryCustUuid'),
  // 查询涨乐财富通服务方式下的客户反馈列表
  queryCustFeedbackList4ZLFins: fetchDataFunction(true, 'performerView/queryCustFeedbackList4ZLFins'),
  // 查询涨乐财富通服务方式下的审批人列表
  queryApprovalList: fetchDataFunction(false, 'performerView/queryApprovalList4ZLFins'),
  // 重置打电话时服务记录的显示标志
  resetCaller: fetchDataFunction(false, 'app/resetCaller'),
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateServiceRecord);
