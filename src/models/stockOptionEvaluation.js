/* eslint-disable import/no-anonymous-default-export */
/*
 * @Author: zhangjun
 * @Date: 2018-06-05 17:15:59
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-03 22:08:48
 */

import { stockOptionEvaluation as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
export default {
  namespace: 'stockOptionEvaluation',
  state: {
    // 股票期权申请页面-右侧详情
    detailInfo: EMPTY_OBJECT,
    // 附件列表
    attachmentList: EMPTY_LIST,
    // 本营业部客户
    busCustList: EMPTY_LIST,
    // 客户基本信息
    custInfo: EMPTY_OBJECT,
    // 客户类型下拉列表
    stockCustTypeList: EMPTY_LIST,
    // 申请类型下拉列表
    reqTypeList: EMPTY_LIST,
    // 开立期权市场类别下拉列表
    optionMarketTypeList: EMPTY_LIST,
    // 业务受理营业部下拉列表
    busDivisionList: EMPTY_LIST,
    // 受理营业部变更
    acceptOrgData: EMPTY_OBJECT,
    // 新建页面获取下一步按钮和审批人
    createButtonListData: EMPTY_OBJECT,
    // 修改获取按钮列表和下一步审批人
    editButtonListData: EMPTY_OBJECT,
    // 验证提交数据结果
    validateResultData: {},
    // 新建修改的更新接口
    updateBindingFlowAppId: '',
  },
  reducers: {
    // 股票期权申请页面-右侧详情
    getDetailInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },

    // 获取附件列表成功
    getAttachmentListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        attachmentList: resultData,
      };
    },

    // 获取本营业部客户成功
    getBusCustListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { custList = EMPTY_LIST } = resultData || EMPTY_OBJECT;
      return {
        ...state,
        busCustList: custList,
      };
    },

    // 获取客户基本信息成功
    getCustInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        custInfo: resultData,
      };
    },

    // 基本信息的多个select数据成功
    getSelectMapSuccess(state, action) {
      const {
        payload: {
          resultData: {
            stockCustTypeList = EMPTY_LIST,
            optionMarketTypeList = EMPTY_LIST,
            reqTypeList = EMPTY_LIST,
            busDivisionList = EMPTY_LIST,
          },
        },
      } = action;
      return {
        ...state,
        stockCustTypeList,
        optionMarketTypeList,
        reqTypeList,
        busDivisionList,
      };
    },

    // 清楚数据成功
    clearPropsSuccess(state) {
      return {
        ...state,
        custInfo: EMPTY_OBJECT,
        stockCustTypeList: EMPTY_LIST,
        reqTypeList: EMPTY_LIST,
        optionMarketTypeList: EMPTY_LIST,
        busDivisionList: EMPTY_LIST,
        createButtonListData: EMPTY_OBJECT,
      };
    },

    // 受理营业部变更成功
    queryAcceptOrgSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        acceptOrgData: resultData,
      };
    },

    // 新建页面获取下一步按钮和审批人
    getCreateButtonListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        createButtonListData: resultData,
      };
    },

    // 修改获取按钮列表和下一步审批人
    getEditButtonListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        editButtonListData: resultData,
      };
    },

    // 验证提交数据成功
    validateResultSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        validateResultData: resultData,
      };
    },

    // 新建修改的更新接口
    updateBindingFlowSuccess(state, action) {
      const { payload: { resultData = '' } } = action;
      return {
        ...state,
        updateBindingFlowAppId: resultData,
      };
    },
    // 清空数据成功
    clearReduxDataSuccess(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 股票期权申请页面-右侧详情
    * getDetailInfo({ payload }, { call, put }) {
      const response = yield call(api.getDetailInfo, payload);
      yield put({
        type: 'getDetailInfoSuccess',
        payload: response,
      });
    },

    // 获取附件列表
    * getAttachmentList({ payload }, { call, put }) {
      const response = yield call(api.getAttachmentList, payload);
      yield put({
        type: 'getAttachmentListSuccess',
        payload: response,
      });
    },

    // 获取本营业部客户
    * getBusCustList({ payload }, { call, put }) {
      const response = yield call(api.getBusCustList, payload);
      yield put({
        type: 'getBusCustListSuccess',
        payload: response,
      });
    },

    // 获取客户基本信息
    * getCustInfo({ payload }, { call, put }) {
      const response = yield call(api.getCustInfo, payload);
      yield put({
        type: 'getCustInfoSuccess',
        payload: response,
      });
    },

    // 基本信息的多个select数据
    * getSelectMap({ payload }, { call, put }) {
      const response = yield call(api.getSelectMap, payload);
      yield put({
        type: 'getSelectMapSuccess',
        payload: response,
      });
    },

    // 清楚数据
    * clearProps({ payload }, { put }) {
      yield put({
        type: 'clearPropsSuccess',
        payload: [],
      });
    },

    // 受理营业部变更
    * queryAcceptOrg({ payload }, { call, put }) {
      const response = yield call(api.queryAcceptOrg, payload);
      yield put({
        type: 'queryAcceptOrgSuccess',
        payload: response,
      });
    },

    // 新建页面获取下一步按钮和审批人
    * getCreateButtonList({ payload }, { call, put }) {
      const response = yield call(api.queryNextApproval, payload);
      yield put({
        type: 'getCreateButtonListSuccess',
        payload: response,
      });
    },

    // 修改获取按钮列表和下一步审批人
    * getEditButtonList({ payload }, { call, put }) {
      const response = yield call(api.getButtonList, payload);
      yield put({
        type: 'getEditButtonListSuccess',
        payload: response,
      });
    },

    // 验证提交数据
    * validateResult({ payload }, { call, put }) {
      const response = yield call(api.validateData, payload);
      yield put({
        type: 'validateResultSuccess',
        payload: response,
      });
    },

    // 走流程接口
    * doApprove({ payload }, { call }) {
      yield call(api.doApprove, payload);
    },

    // 更新接口
    * updateBindingFlow({ payload }, { call, put }) {
      const response = yield call(api.updateBindingFlow, payload);
      yield put({
        type: 'updateBindingFlowSuccess',
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
  subscriptions: {},
};
