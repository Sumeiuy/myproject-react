/*
 * @Description: 合作合约 model
 * @Author: LiuJianShu
 * @Date: 2017-09-20 15:13:30
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-11 17:10:17
 */
import { contract as api, seibel as seibelApi } from '../api';
import { getEmpId } from '../utils/helper';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'contract',
  state: {
    custList: EMPTY_LIST, // 客户列表
    contractNumList: EMPTY_LIST, // 合作合约编号列表
    baseInfo: EMPTY_OBJECT,
    unsubscribeBaseInfo: EMPTY_OBJECT,
    attachmentList: EMPTY_LIST, // 附件信息
    cooperDeparment: EMPTY_LIST, // 合作部门
    clauseNameList: EMPTY_LIST, // 条款名称列表
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
    // 获取退订详情
    getUnsubscribeDetailSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        unsubscribeBaseInfo: resultData,
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
    getClauseNameListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      /*eslint-disable */
      if (resultData.length) {
        resultData.forEach((v) => {
          v.label = v.termVal;
          v.value = v.termName;
          v.show = true;
          if (v.param.length) {
            v.param.forEach((sv) => {
              sv.label = sv.val;
              sv.value = sv.name;
              sv.show = true;
            });
          }
        });
      }
      /*eslint-disable */
      return {
        ...state,
        clauseNameList: resultData,
      };
    },
    getCooperDeparmentListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        cooperDeparment: resultData,
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
      const empId = getEmpId();
      const response = yield call(api.getContractDetail, payload);
      if (payload.type === 'unsubscribeDetail') {
        // 退订时请求详情
        yield put({
          type: 'getUnsubscribeDetailSuccess',
          payload: response,
        });
      } else {
        // 非退订时请求详情
        yield put({
          type: 'getBaseInfoSuccess',
          payload: response,
        });
      }
      // 获取附件列表的 payload
      const attachPayload = {
        attachment: response.resultData.uuid || '',
      };
      const attachResponse = yield call(api.getAttachmentList, attachPayload);
      yield put({
        type: 'getAttachmentListSuccess',
        payload: attachResponse,
      });
      // 获取审批记录的 payload
      const flowPayload = {
        flowCode: response.resultData.workflowCode || '',
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
    * getClauseNameList({ payload }, { call, put }) {
      const response = yield call(api.getClauseNameList, payload);
      yield put({
        type: 'getClauseNameListSuccess',
        payload: response,
      });
    },
    * getCooperDeparmentList({ payload }, { call, put }) {
      const response = yield call(api.getCooperDeparmentList, payload);
      yield put({
        type: 'getCooperDeparmentListSuccess',
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
