/*
 * @Description: 通道类型协议 model
 * @Author: XuWenKang
 * @Date: 2017-10-30 15:13:30
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-10-30 15:13:30
 */
import { channelsTypeProtocol as api } from '../api';
import { getEmpId } from '../utils/helper';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'channelsTypeProtocol',
  state: {
    protocolDetail: EMPTY_OBJECT, // 协议详情
    attachmentList: EMPTY_LIST, // 附件信息
    flowHistory: EMPTY_LIST,  // 审批记录
  },
  reducers: {
    // 获取协议详情
    getProtocolDetailSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        protocolDetail: resultData,
      };
    },
    // 获取附件列表
    getAttachmentListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        attachmentList: resultData,
      };
    },
    // 获取审批记录
    getFlowHistorySuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        flowHistory: resultData,
      };
    },
  },
  effects: {
    // 获取协议详情
    * getProtocolDetail({ payload }, { call, put }) {
      const empId = getEmpId();
      const response = yield call(api.getProtocolDetail, payload);
      yield put({
        type: 'getProtocolDetailSuccess',
        payload: response,
      });
      // 获取审批记录的 payload
      const flowPayload = {
        flowCode: response.resultData.flowid || '',
        loginuser: empId,
      };
      const flowHistoryResponse = yield call(api.getFlowHistory, flowPayload);
      yield put({
        type: 'getFlowHistorySuccess',
        payload: flowHistoryResponse,
      });
    },
    // 获取附件信息
    * getAttachmentList({ payload }, { call, put }) {
      const response = yield call(api.getAttachmentList, payload);
      yield put({
        type: 'getAttachmentListSuccess',
        payload: response,
      });
    },
    // 删除附件
    * deleteAttachment({ payload }, { call, put }) {
      const response = yield call(api.deleteAttachment, payload);
      yield put({
        type: 'deleteAttachmentSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, params }) => {
        console.log('params', params);
        if (pathname === '/channelsTypeProtocol') {
          // 请求客户列表
          dispatch({ type: 'app/getCanApplyCustList' });
        }
      });
    },
  },
};
