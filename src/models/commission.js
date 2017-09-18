/**
 * @file models/report.js
 * @author sunweibin
 */
import { commission as api } from '../api';

export default {
  namespace: 'commission',
  state: {
    // 新建佣金目标产品测试
    productList: [],
  },
  reducers: {
    getProductList(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        productList: resultData,
      };
    },
  },
  effects: {
    //
    * getProductList({ payload }, { call, put }) {
      const response = yield call(api.queryProduct, payload);
      yield put({
        type: 'getProductList',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
