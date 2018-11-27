/*
 * @Author: yuanhaojie
 * @Date: 2018-11-20 16:16:41
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-26 21:09:37
 * @Description: 新版客户360详情下的产品订单Tab页面的model
 */
import { detailProductOrder as api } from '../../api';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

export default {
  namespace: 'productOrder',
  state: {
    serviceOrderFlow: EMPTY_OBJECT,
    tradeOrderFlow: EMPTY_OBJECT,
    serviceOrderDetail: EMPTY_OBJECT,
    serviceProductList: EMPTY_ARRAY,
    orderApproval: EMPTY_OBJECT,
    attachmentList: EMPTY_ARRAY,
    serviceOrderData: EMPTY_OBJECT,
  },
  reducers: {
    queryServiceOrderFlowSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        serviceOrderFlow: payload || EMPTY_OBJECT,
      };
    },
    queryTradeOrderFlowSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        tradeOrderFlow: payload || EMPTY_OBJECT,
      };
    },
    queryServiceOrderDetailSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        serviceOrderDetail: payload || EMPTY_OBJECT,
      };
    },
    queryServiceProductListSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        serviceProductList: payload || EMPTY_ARRAY,
      };
    },
    queryOrderApprovalSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        orderApproval: payload || EMPTY_OBJECT,
      };
    },
    getAttachmentListSuccess(state, action) {
      const { payload = EMPTY_ARRAY } = action;
      return {
        ...state,
        attachmentList: payload,
      };
    },
    queryServiceOrderDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        serviceOrderData: payload || EMPTY_OBJECT,
      };
    }
  },
  effects: {
    * queryServiceOrderFlow({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryServiceOrderFlow, payload);
      yield put({
        type: 'queryServiceOrderFlowSuccess',
        payload: resultData,
      });
    },
    * queryTradeOrderFlow({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryTradeOrderFlow, payload);
      yield put({
        type: 'queryTradeOrderFlowSuccess',
        payload: resultData,
      });
    },
    * queryServiceOrderDetail({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryServiceOrderDetail, payload);
      yield put({
        type: 'queryServiceOrderDetailSuccess',
        payload: resultData,
      });
      return resultData;
    },
    * queryServiceProductList({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryServiceProductList, payload);
      yield put({
        type: 'queryServiceProductListSuccess',
        payload: resultData,
      });
    },
    * queryOrderApproval({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryOrderApproval, payload);
      yield put({
        type: 'queryOrderApprovalSuccess',
        payload: resultData,
      });
    },
    * getAttachmentList({ payload }, { put, call }) {
      const { resultData } = yield call(api.getAttachmentList, payload);
      yield put({
        type: 'getAttachmentListSuccess',
        payload: resultData,
      });
    },
    * queryCustCanChangeCommission({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryCustCanChangeCommission, payload);
      return resultData;
    },
    * queryServiceOrderData({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryServiceOrderData, payload);
      yield put({
        type: 'queryServiceOrderDataSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
  },
};
