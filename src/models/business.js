/**
 * @file models/business.js
 * @author sunweibin
 */

// import { routerRedux } from 'dva/router';

import api from '../api';
import config from '../config/request';

export default {
  namespace: 'business',
  state: {
    performance: [],
    chartInfo: [],
    custRange: [],
    chartTableInfo: {},
  },
  reducers: {
    getPerformanceSuccess(state, action) {
      const { payload: { resPerformance } } = action;
      const performance = resPerformance.resultData.singleRecords;
      return {
        ...state,
        performance,
      };
    },
    getChartInfoSuccess(state, action) {
      const { payload: { resChartInfo } } = action;
      const chartInfo = resChartInfo.resultData;
      return {
        ...state,
        chartInfo,
      };
    },
    getChartTableInfoSuccess(state, action) {
      const { payload: { resChartTableInfo } } = action;
      const chartTableInfo = resChartTableInfo.resultData.data;
      return {
        ...state,
        chartTableInfo,
      };
    },
    getCustRangeSuccess(state, action) {
      const { response: { resultData } } = action;
      let custRange;
      if (resultData.level === '1') {
        custRange = [
          { id: resultData.id, name: resultData.name, level: resultData.level },
          ...resultData.children,
        ];
      } else {
        custRange = [resultData];
      }
      return {
        ...state,
        custRange,
      };
    },
  },
  effects: {
    // 导出Excel表格
    * exportExcel({ payload: { query } }) {
      const { prefix } = config;
      yield window.location.href = `${prefix}/excel/jxzb/exportExcel?${query}`;
    },
    // 获取业绩指标
    * getPerformance({ payload }, { call, put }) {
      const resPerformance = yield call(api.getBOPerformance, payload);
      yield put({
        type: 'getPerformanceSuccess',
        payload: { resPerformance },
      });
    },
    * getAllInfo({ payload }, { call, put, select }) {
      const cust = yield select(state => state.business.custRange);
      let firstCust;
      if (cust.length) {
        firstCust = cust[0];
      } else {
        const response = yield call(api.getCustRange, payload.custRange);
        yield put({
          type: 'getCustRangeSuccess',
          response,
        });
        firstCust = response.resultData;
      }
      // 总量指标
      const resPerformance = yield call(api.getBOPerformance, {
        ...payload.performance,
        localScope: payload.performance.localScope || firstCust.level,
        orgId: payload.performance.orgId || firstCust.id,
        scope: payload.performance.scope || firstCust.level,
      });
      yield put({
        type: 'getPerformanceSuccess',
        payload: { resPerformance },
      });
      // 判断柱状图或者表格
      // 柱状图
      if (!payload.showChart || payload.showChart === 'zhuzhuangtu') {
        const resChartInfo = yield call(api.getBOChartInfo, {
          ...payload.chartInfo,
          localScope: payload.chartInfo.localScope || firstCust.level,
          orgId: payload.chartInfo.orgId || firstCust.id,
          scope: payload.chartInfo.scope || parseInt(firstCust.level, 10) + 1,
        });
        yield put({
          type: 'getChartInfoSuccess',
          payload: { resChartInfo },
        });
      } else if (payload.showChart === 'tables') {
        // 表格
        const resChartTableInfo = yield call(api.getBOChartTableInfo, {
          ...payload.chartTableInfo,
          localScope: payload.chartTableInfo.localScope || firstCust.level,
          orgId: payload.chartTableInfo.orgId || firstCust.id,
          scope: payload.chartTableInfo.scope || parseInt(firstCust.level, 10) + 1,
          pageSize: 10,
        });
        yield put({
          type: 'getChartTableInfoSuccess',
          payload: { resChartTableInfo },
        });
      }
    },
    // 获取投顾图表数据
    * getChartInfo({ payload }, { call, put }) {
      const resChartInfo = yield call(api.getBOChartInfo, payload);
      yield put({
        type: 'getChartInfoSuccess',
        payload: { resChartInfo },
      });
    },

    // 获取图表表格视图数据
    * getChartTableInfo({ payload }, { call, put }) {
      const resChartTableInfo = yield call(api.getBOChartTableInfo, payload);
      yield put({
        type: 'getChartTableInfoSuccess',
        payload: { resChartTableInfo },
      });
    },

    // 获取客户范围
    * getCustRange({ payload }, { call, put }) {
      const response = yield call(api.getCustRange, payload);
      yield put({
        type: 'getCustRangeSuccess',
        response,
      });
    },
  },
  subscriptions: {},
};
