/*
 * @Description: 合作合约 model
 * @Author: LiuJianShu
 * @Date: 2017-09-20 15:13:30
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-09-29 16:50:11
 */
import { contract as api, seibel as seibelApi } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'contract',
  state: {
    custList: EMPTY_LIST, // 客户列表
    contractNumList: EMPTY_LIST, // 合作合约编号列表
    baseInfo: EMPTY_OBJECT,
    attachmentList: EMPTY_LIST, // 附件信息
    flowHistory: EMPTY_LIST,  // 审批记录
  },
  reducers: {
    // 获取详情
    getBaseInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        baseInfo: resultData,
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
    // 删除附件
    deleteAttachmentSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { attaches = EMPTY_LIST } = resultData;
      return {
        ...state,
        attachmentList: attaches,
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
    saveContractDataSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      console.log(resultData);
      return {
        ...state,
      };
    },
    getContractNumListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        contractNumList: resultData,
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
    // 获取详情
    * getBaseInfo({ payload }, { call, put }) {
      const response = yield call(api.getContractDetail, payload);
      yield put({
        type: 'getBaseInfoSuccess',
        payload: response,
      });
      // 获取附件列表的 payload
      const attachPayload = {
        empId: payload.empId,
        attachment: response.resultData.attachment || '',
      };
      const attachResponse = yield call(api.getAttachmentList, attachPayload);
      yield put({
        type: 'getAttachmentListSuccess',
        payload: attachResponse,
      });
      // 获取审批记录的 payload
      const flowPayload = {
        flowCode: response.resultData.workflowCode || '',
        loginuser: payload.empId,
        empId: payload.empId,
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
    // 获取可申请客户列表
    * getCutList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getCanApplyCustList, payload);
      yield put({
        type: 'getCutListSuccess',
        payload: response,
      });
    },
    // 保存详情
    * saveContractData({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(api.saveContractData, payload);
      yield put({
        type: 'saveContractDataSuccess',
        payload: response,
      });
    },
    // 获取合约编号列表
    * getContractNumList({ payload }, { call, put }) {
      const response = yield call(api.getContractNumList, payload);
      yield put({
        type: 'getContractNumListSuccess',
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
  },
  subscriptions: {},
};
