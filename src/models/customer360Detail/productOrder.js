/*
 * @Author: yuanhaojie
 * @Date: 2018-11-20 16:16:41
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-21 10:07:41
 * @Description: 新版客户360详情下的产品订单Tab页面的model
 */
import { detailProductOrder as api } from '../../api';

const EMPTY_OBJECT = {};

export default {
  namespace: 'productOrder',
  state: {
    serviceOrderFlow: EMPTY_OBJECT,
    tradeOrderFlow: EMPTY_OBJECT,
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
    }
  },
  subscriptions: {
  },
};
