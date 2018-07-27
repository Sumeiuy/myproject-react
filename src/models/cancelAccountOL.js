/**
* @Author: sunweibin
* @Descripter: 线上申请models
* @Date: 2018-06-08 13:17:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-19 15:43:18
*/


import { cancelAccountOL as api } from '../api';

export default {
  namespace: 'cancelAccountOL',
  state: {
    // 下拉框字典
    optionsDict: {},
    // 右侧详情
    detailInfo: {},
    // 弹出层搜索的可选客户列表
    custList: [],
    // 弹出层按钮以及审批人数据
    approval: {},
    // 新建提交结果
    submitResult: {},
    // 流程结果
    flowResult: {},
    // 驳回后修改的详情
    detailInfoForUpdate: {},
    // 驳回后修改的弹出层按钮以及审批人数据
    approvalForUpdate: {},
    // 手动推送的结果
    pushResult: '',
  },
  reducers: {
    queryDictSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        optionsDict: resultData,
      };
    },
    getDetailInfoSuccess(state, action) {
      const { payload: { detailResponse = {}, attachResponse = {} } } = action;
      const detail = detailResponse.resultData || {};
      const attachmentList = attachResponse.resultData || [];
      return {
        ...state,
        detailInfo: {
          ...detail,
          attachmentList,
        },
      };
    },
    getDetailForUpdateSuccess(state, action) {
      const { payload: { detailResponse = {}, attachResponse = {} } } = action;
      const detail = detailResponse.resultData || {};
      const attachmentList = attachResponse.resultData || [];
      return {
        ...state,
        detailInfoForUpdate: {
          ...detail,
          attachmentList,
        },
      };
    },
    queryCustListSuccess(state, action) {
      const { payload: { resultData = [] } } = action;
      return {
        ...state,
        custList: resultData,
      };
    },
    getApprovalInfoSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        approval: resultData,
      };
    },
    getApprovalInfoForUpdateSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        approvalForUpdate: resultData,
      };
    },
    pushCancelAcccountSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        pushResult: resultData.msg || '',
      };
    },
    submitApplySuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        submitResult: resultData,
      };
    },
    doApprovalSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        flowResult: resultData,
      };
    },
    clearReduxDataSuccess(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 获取下拉列表字典
    * queryDict({ payload = {} }, { put, call }) {
      const response = yield call(api.queryDict, payload);
      yield put({
        type: 'queryDictSuccess',
        payload: response,
      });
    },
    // 获取申请单详情
    * getDetail({ payload }, { put, call }) {
      const detailResponse = yield call(api.getAppDetail, payload);
      const { attachment } = detailResponse.resultData;
      const attachResponse = yield call(api.getAttachmentList, { attachment: attachment || '' });
      yield put({
        type: 'getDetailInfoSuccess',
        payload: {
          detailResponse,
          attachResponse,
        },
      });
    },
    // 获取驳回后修改申请单详情
    * getDetailForUpdate({ payload }, { put, call }) {
      const detailResponse = yield call(api.getAppDetail, payload);
      const { attachment } = detailResponse.resultData;
      const attachResponse = yield call(api.getAttachmentList, { attachment: attachment || '' });
      yield put({
        type: 'getDetailForUpdateSuccess',
        payload: {
          detailResponse,
          attachResponse,
        },
      });
    },
    // 根据关键字查询可申请的客户列表
    * queryCustList({ payload }, { call, put }) {
      const response = yield call(api.queryCustList, payload);
      yield put({
        type: 'queryCustListSuccess',
        payload: response,
      });
    },
    // 获取新建页面的流程按钮和审批人
    * getApprovalInfo({ payload = {} }, { call, put }) {
      const response = yield call(api.getButtonList, payload);
      yield put({
        type: 'getApprovalInfoSuccess',
        payload: response,
      });
    },
    // 获取驳回后修改页面的流程按钮和审批人
    * getApprovalInfoForUpdate({ payload = {} }, { call, put }) {
      const response = yield call(api.getButtonList, payload);
      yield put({
        type: 'getApprovalInfoForUpdateSuccess',
        payload: response,
      });
    },
    // 推送销户
    * pushCancelAcccount({ payload }, { call, put }) {
      yield put({
        type: 'pushCancelAcccountSuccess',
        payload: {},
      });
      const response = yield call(api.pushCancelAccount, payload);
      yield put({
        type: 'pushCancelAcccountSuccess',
        payload: response,
      });
    },
    // 保存数据
    * submitApply({ payload }, { call, put }) {
      yield put({
        type: 'submitApplySuccess',
        payload: {},
      });
      const response = yield call(api.saveApplication, payload);
      yield put({
        type: 'submitApplySuccess',
        payload: response,
      });
    },
    * doApproval({ payload }, { call, put }) {
      yield put({
        type: 'doApprovalSuccess',
        payload: {},
      });
      const response = yield call(api.doApprove, payload);
      yield put({
        type: 'doApprovalSuccess',
        payload: response,
      });
    },
    // 清空数据
    * clearReduxData({ payload }, { put }) {
      yield put({
        type: 'clearReduxDataSuccess',
        payload,
      });
    },
  },
  subscriptions: {
  },
};
