/*
 * @Author: zhangjun
 * @Date: 2018-06-05 17:15:59
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-11 16:50:00
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
    // 基本信息的多个select数据
    selectMapData: EMPTY_OBJECT,
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
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        selectMapData: resultData,
      };
    },

    // 清楚数据成功
    clearPropsSuccess(state) {
      return {
        ...state,
        custInfo: EMPTY_OBJECT,
        selectMapData: EMPTY_OBJECT,
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
  },
  subscriptions: {},
};
