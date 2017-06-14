/**
 * @file models/invest.js
 * @author sunweibin
 */

// import { routerRedux } from 'dva/router';

import api from '../api';
import config from '../config/request';

export default {
  namespace: 'invest',
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
      const { payload: { resChartTableInfo, categoryKey } } = action;
      const chartTable = resChartTableInfo.resultData;
      const newChartTableInfo = chartTable.data;
      // todo 按照 ID 来存储相应数据
      const chartTableId = categoryKey;
      const preChartTableInfo = state.chartTableInfo;
      return {
        ...state,
        chartTableInfo: {
          ...preChartTableInfo,
          [chartTableId]: newChartTableInfo,
        },
      };
      // const { payload: { resChartTableInfo } } = action;
      // const chartTableInfo = resChartTableInfo.resultData.data;
      // return {
      //   ...state,
      //   chartTableInfo,
      // };
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
      const resPerformance = yield call(api.getPerformance, payload);
      yield put({
        type: 'getPerformanceSuccess',
        payload: { resPerformance },
      });
    },
    * getAllInfo({ payload }, { call, put, select }) {
      const cust = yield select(state => state.invest.custRange);
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
      const resPerformance = yield call(api.getPerformance, {
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
        const resChartInfo = yield call(api.getChartInfo, {
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
        const resChartTableInfo = yield call(api.getChartTableInfo, {
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
      const resChartInfo = yield call(api.getChartInfo, payload);
      yield put({
        type: 'getChartInfoSuccess',
        payload: { resChartInfo },
      });
    },

    // 获取图表表格视图数据
    * getChartTableInfo({ payload }, { call, put }) {
      const resChartTableInfo = yield call(api.getChartTableInfo, payload);
      const categoryKey = payload.categoryKey;
      yield put({
        type: 'getChartTableInfoSuccess',
        payload: { resChartTableInfo, categoryKey },
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
