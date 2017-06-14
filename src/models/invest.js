/**
 * @file models/invest.js
 * @author sunweibin
 */
import api from '../api';
import config from '../config/request';

export default {
  namespace: 'invest',
  state: {
    performance: [],
    chartInfo: [],
    custRange: [],
    chartTableInfo: {},
    allCategory: [],
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
    getAllCategorysSuccess(state, action) {
      const { payload: { allCategorys } } = action;
      const newAll = allCategorys.resultData.map((item) => {
        const { key, name } = item;
        return { key, name };
      });
      return {
        ...state,
        allCategory: newAll,
      };
    },
    getOneChartInfoSuccess(state, action) {
      const { payload: { oneChart } } = action;
      const { chartInfo } = state;
      const resultData = oneChart.resultData;
      const newChart = resultData[0];
      const categoryKey = newChart.key;
      const newChartInfo = chartInfo.map((item) => {
        const { key } = item;
        if (key === categoryKey) {
          return newChart;
        }
        return item;
      });
      return {
        ...state,
        chartInfo: newChartInfo,
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
    // 初始化只需要取总量指标和该报表下的所有分类指标数据
    // 以及用户组织机构树
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
      // 所有分类指标的数据
      const resChartInfo = yield call(api.getChartInfo, {
        ...payload.chartInfo,
        localScope: payload.chartInfo.localScope || firstCust.level,
        orgId: payload.chartInfo.orgId || firstCust.id,
        scope: payload.chartInfo.scope || String(Number(firstCust.level) + 1),
      });
      yield put({
        type: 'getChartInfoSuccess',
        payload: { resChartInfo },
      });
    },
    // 获取所有分类
    * getAllCategorys({ payload }, { call, put }) {
      // 获取所有分类指标信息
      const allCategorys = yield call(api.getAllClassifyIndex, payload);
      yield put({
        type: 'getAllCategorysSuccess',
        payload: { allCategorys },
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

    // 获取图表表格视图数据
    * getChartTableInfo({ payload }, { call, put }) {
      const resChartTableInfo = yield call(api.getChartTableInfo, payload);
      const categoryKey = payload.categoryKey;
      yield put({
        type: 'getChartTableInfoSuccess',
        payload: { resChartTableInfo, categoryKey },
      });
    },
  },
  subscriptions: {},
};
