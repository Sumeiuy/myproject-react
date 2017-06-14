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
    getOneChartInfoSuccess(state, action) {
      const { payload: { oneChart } } = action;
      console.log(oneChart);
    },
    getClassifyIndexSuccess(state, action) {
      const { payload: { response } } = action;
      const singleChartData = response.resultData;
      const indicatorId = singleChartData.key;
      // 找到需要修改的那个分类
      const preChartInfo = state.chartInfo;
      const newChartInfo = preChartInfo.map((item) => {
        const { key } = item;
        if (key === indicatorId) {
          return singleChartData;
        }
        return item;
      });
      return {
        ...state,
        chartInfo: newChartInfo,
      };
    },
    getChartTableInfoSuccess(state, action) {
      const { payload: { resChartTableInfo } } = action;
      const chartTable = resChartTableInfo.resultData;
      const newChartTableInfo = chartTable.data;
      // todo 按照 ID 来存储相应数据
      const chartTableId = chartTable.key;
      const preChartTableInfo = state.chartTableInfo;
      return {
        ...state,
        chartTableInfo: {
          ...preChartTableInfo,
          [chartTableId]: newChartTableInfo,
        },
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
    // 初始化只需要取总量指标和该报表下的所有分类指标数据
    // 以及用户组织机构树
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
      // 所有分类指标的数据
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
    },

    // 根据某一个分类指标的ID查询该分类指标下数据
    * getOneChartInfo({ payload }, { call, put }) {
      const oneChart = yield call(api.getOneChartInfo, payload);
      yield put({
        type: 'getOneChartInfoSuccess',
        payload: { oneChart },
      });
    },

    // 获取分类指标的数据
    // * getClassifyIndex({ payload }, { call, put }) {
    //   const response = yield call(api.getBOClassifyIndex, payload);
    //   yield put({
    //     type: 'getClassifyIndexSuccess',
    //     payload: { response },
    //   });
    // },

    // 获取图表表格视图数据
    * getChartTableInfo({ payload }, { call, put }) {
      const resChartTableInfo = yield call(api.getBOChartTableInfo, payload);
      yield put({
        type: 'getChartTableInfoSuccess',
        payload: { resChartTableInfo },
      });
    },

    // 获取客户范围
    // * getCustRange({ payload }, { call, put }) {
    //   const response = yield call(api.getCustRange, payload);
    //   yield put({
    //     type: 'getCustRangeSuccess',
    //     response,
    //   });
    // },
  },
  subscriptions: {},
};
