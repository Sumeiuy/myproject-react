/*
 * @Description: 通道类型协议 model
 * @Author: XuWenKang
 * @Date: 2017-10-30 15:13:30
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-10-30 15:13:30
 */
import { contract as api, seibel as seibelApi } from '../api';
// import { getEmpId } from '../utils/helper';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'channelsTypeProtocol',
  state: {
    custList: EMPTY_LIST, // 客户列表
    contractNumList: EMPTY_LIST, // 合作合约编号列表
    baseInfo: EMPTY_OBJECT,
    unsubscribeBaseInfo: EMPTY_OBJECT,
    attachmentList: EMPTY_LIST, // 附件信息
    cooperDeparment: EMPTY_LIST, // 合作部门
    clauseNameList: EMPTY_LIST, // 条款名称列表
    flowHistory: EMPTY_LIST,  // 审批记录
    flowStepInfo: EMPTY_OBJECT, // 审批人
    unsubFlowStepInfo: EMPTY_OBJECT, // 退订审批人
    doApprove: EMPTY_OBJECT,
  },
  reducers: {
    // 获取附件列表
    getAttachmentListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        attachmentList: resultData,
      };
    },
    getCutListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { custList = EMPTY_LIST } = resultData;
      return {
        ...state,
        custList,
      };
    },
    getFlowStepInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        flowStepInfo: resultData,
      };
    },
    getAddFlowStepInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        addFlowStepInfo: resultData,
      };
    },
    postDoApproveSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        doApprove: resultData,
      };
    },
    getFlowHistorySuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        flowHistory: resultData,
      };
    },
  },
  effects: {
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
    // 获取可申请客户列表
    * getCutList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getCanApplyCustList, payload);
      yield put({
        type: 'getCutListSuccess',
        payload: response,
      });
    },
    // 获取审批记录
    * getFlowHistory({ payload }, { call, put }) {
      const response = yield call(api.getFlowHistory, payload);
      yield put({
        type: 'getFlowHistorySuccess',
        payload: response,
      });
    },
    // 新建时的获取审批人列表
    * getFlowStepInfo({ payload }, { call, put }) {
      const response = yield call(api.getFlowStepInfo, payload);
      yield put({
        type: 'getAddFlowStepInfoSuccess',
        payload: response,
      });
    },
    // 审批操作
    * postDoApprove({ payload }, { call, put }) {
      const response = yield call(api.postDoApprove, payload);
      yield put({
        type: 'postDoApproveSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/channelsTypeProtocol') {
          // 请求客户列表
          dispatch({ type: 'getCutList' });
        }
      });
    },
  },
};
