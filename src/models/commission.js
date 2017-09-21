/**
 * @file models/report.js
 * @author sunweibin
 */
import { commission as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'commission',
  state: {
    // 新建佣金目标产品测试
    productList: [],
    // 批量佣金左侧列表
    list: {},
    // 批量佣金右侧详情
    detail: {},
  },
  reducers: {

    getProductList(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        productList: resultData,
      };
    },

    getCommissionListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { page = EMPTY_OBJECT, applicationList = EMPTY_LIST } = resultData;

      return {
        ...state,
        list: {
          page,
          resultData: applicationList,
        },
      };
    },

    getCommissionDetailSuccess(state, action) {
      const { payload: { detailRes, custListRes } } = action;
      const detailResult = detailRes.resultData;
      const listResult = custListRes.resultData;
      return {
        ...state,
        detail: {
          ...detailResult,
          custList: listResult,
        },
      };
    },
  },
  effects: {
    // 新建批量佣金调整用户选择的目标产品列表
    * getProductList({ payload }, { call, put }) {
      const response = yield call(api.queryProduct, payload);
      yield put({
        type: 'getProductList',
        payload: response,
      });
    },

    // 批量佣金Home列表
    * getCommissionList({ payload }, { call, put }) {
      const listResponse = yield call(api.getCommissionList, payload);
      yield put({
        type: 'getCommissionListSuccess',
        payload: listResponse,
      });
      const appList = listResponse.resultData.applicationList;
      if (Array.isArray(appList) && appList.length) {
        yield put({
          type: 'getCommissionDetail',
          payload: { batchNum: appList[0].id },
        });
      }
    },

    // 批量佣金调整Home的右侧详情
    * getCommissionDetail({ payload }, { call, put }) {
      const detailRes = yield call(api.getCommissionDetail, payload);
      const custListRes = yield call(api.getCommissionDetailCustList, {
        batchNum: payload.batchNum,
      });
      yield put({
        type: 'getCommissionDetailSuccess',
        payload: { detailRes, custListRes },
      });
    },
  },
  subscriptions: {},
};
