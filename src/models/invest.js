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
    custRange: [],
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
      const { chartInfo } = response.resultData;
      return {
        ...state,
        chartInfo,
      };
    },
    getCustRangeSuccess(state, action) {
      const { response: { resultData } } = action;
      const user = {
        roleId: 1,
        company: '分公司2',
      };
      let custRange;
      if (user.roleId === 1) {  // 经纪业务总部团队经理
        custRange = [
          { label: resultData.label, value: resultData.value },
          ...resultData.children,
        ];
      } else if (user.roleId === 2) { // 分公司团队经理
        resultData.children.forEach((v) => {
          if (v.label === user.company) {
            custRange = [v];
          }
        });
      } else if (user.roleId === 3) { // 营业部团队经理
        resultData.children.forEach((v) => {
          if (v.children) {
            v.children.forEach((item) => {
              if (item.label === user.company) {
                custRange = [item];
              }
            });
          }
        });
      }
      return {
        ...state,
        custRange,
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

    // 获取客户范围
    * getCustRange({ payload }, { call, put }) {
      const response = yield call(api.getCustRange, payload);
      console.log('response>>>', response);
      yield put({
        type: 'getCustRangeSuccess',
        response,
      });
    },
  },
  subscriptions: {},
};
