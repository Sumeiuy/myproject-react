/**
 * @file models/invest.js
 * @author sunweibin
 */

// import { routerRedux } from 'dva/router';

import api from '../api';

export default {
  namespace: 'invest',
  state: {
    performance: [],
  },
  reducers: {
    getPerformanceSuccess(state, action) {
      const { payload: { response } } = action;
      const { performance } = response.data;
      return {
        ...state,
        performance,
      };
    },
  },
  effects: {
    // 获取
    * getPerformance({ payload }, { call, put }) {
      const response = yield call(api.getPerformance, payload);
      yield put({
        type: 'getPerformanceSuccess',
        payload: { response },
      });
    },
  },
  subscriptions: {},
};
