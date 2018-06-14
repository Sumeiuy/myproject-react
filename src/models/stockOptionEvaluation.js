/*
 * @Author: zhangjun
 * @Date: 2018-06-05 17:15:59
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-12 14:32:53
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
    stockCustTypeMap: EMPTY_LIST,
    // 申请类型下拉列表
    reqTypeMap: EMPTY_LIST,
    // 开立期权市场类别下拉列表
    klqqsclbMap: EMPTY_LIST,
    // 业务受理营业部下拉列表
    busDivisionMap: EMPTY_LIST,
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
      let stockCustTypeMap = EMPTY_LIST;
      let reqTypeMap = EMPTY_LIST;
      let klqqsclbMap = EMPTY_LIST;
      let busDivisionMap = EMPTY_LIST;
      stockCustTypeMap = resultData.stockCustTypeMap.map(item => ({
        ...item,
        show: true,
      }));
      reqTypeMap = resultData.reqTypeMap.map(item => ({
        ...item,
        show: true,
      }));
      klqqsclbMap = resultData.klqqsclbMap.map(item => ({
        ...item,
        show: true,
      }));
      busDivisionMap = resultData.busDivisionMap.map(item => ({
        ...item,
        show: true,
      }));
      console.warn('stockCustTypeMapModel', stockCustTypeMap);
      return {
        ...state,
        stockCustTypeMap,
        reqTypeMap,
        klqqsclbMap,
        busDivisionMap,
      };
    },

    // 清楚数据成功
    clearPropsSuccess(state) {
      return {
        ...state,
        custInfo: EMPTY_OBJECT,
        stockCustTypeMap: EMPTY_LIST,
        reqTypeMap: EMPTY_LIST,
        klqqsclbMap: EMPTY_LIST,
        busDivisionMap: EMPTY_LIST,
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
