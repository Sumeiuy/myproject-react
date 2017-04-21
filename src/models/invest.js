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
    chartInfo: [],
  },
  reducers: {
    getPerformanceSuccess(state, action) {
      const { payload: { response } } = action;
      const { performance } = response.resultData;
      return {
        ...state,
        performance,
      };
    },
    getChartInfoSuccess(state, action) {
      const { payload: { response } } = action;
      const chartInfo = response.resultData;
      return {
        ...state,
        chartInfo,
      };
    },
  },
  effects: {
    // 获取业绩指标
    * getPerformance({ payload }, { call, put }) {
      const response = yield call(api.getPerformance, payload);
      yield put({
        type: 'getPerformanceSuccess',
        payload: { response },
      });
    },

    // 获取投顾图表数据
    * getChartInfo({ payload }, { call, put }) {
      const response = yield call(api.getChartInfo, payload);
      yield put({
        type: 'getChartInfoSuccess',
        payload: { response },
      });
    },
  },
  subscriptions: {},
};
