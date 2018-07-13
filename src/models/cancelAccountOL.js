/**
* @Author: sunweibin
* @Descripter: 线上申请models
* @Date: 2018-06-08 13:17:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-12 18:10:12
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
    // 弹出层用户选择的客户信息
    custDetail: {},
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
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },
    getDetailForUpdateSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        detailInfoForUpdate: resultData,
      };
    },
    queryCustListSuccess(state, action) {
      const { payload: { resultData: { custList = [] } } } = action;
      return {
        ...state,
        custList,
      };
    },
    getCustDetailSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        custDetail: resultData,
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
      const response = yield call(api.getAppDetail, payload);
      yield put({
        type: 'getDetailInfoSuccess',
        payload: response,
      });
    },
    // 获取驳回后修改申请单详情
    * getDetailForUpdate({ payload }, { put, call }) {
      const response = yield call(api.getAppDetail, payload);
      yield put({
        type: 'getDetailForUpdateSuccess',
        payload: response,
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
    // 获取选中的客户的详情信息
    * getCustDetail({ payload }, { call, put }) {
      const response = yield call(api.getCustDetail, payload);
      yield put({
        type: 'getCustDetailSuccess',
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
