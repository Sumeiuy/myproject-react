/**
 * @file models/history.js
 * @author sunweibin
 */
import api from '../api';
import { BoardBasic } from '../config';

// const EMPTY_OBJECT = {};

export default {
  namespace: 'history',
  state: {
    custRange: [],
    visibleBoards: [], // 可见看板
    contributionAnalysis: {},
    reviewAnalysis: {},
    historyCore: [], // 概览列表
    currentRankingRecord: {}, // 强弱指示分析
    contrastData: {}, // 历史对比数据
  },
  reducers: {
    // 概览数据列表
    getHistoryCoreSuccess(state, action) {
      const { payload: { resHistoryCore } } = action;
      const historyCore = resHistoryCore.resultData;
      return {
        ...state,
        historyCore,
      };
    },
    // 获取左上角可见看板
    getAllVisibleReportsSuccess(state, action) {
      const { payload: { allVisibleReports } } = action;
      const visibleBoards = allVisibleReports.resultData || [];
      return {
        ...state,
        visibleBoards: [
          ...BoardBasic.regular,
          ...visibleBoards,
        ],
      };
    },

    // 获取组织机构树
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

    // 存贮散点图数据
    queryContrastAnalyzeSuccess(state, action) {
      const { payload: { response, type } } = action;
      let contributionAnalysis = state.contributionAnalysis;
      let reviewAnalysis = state.reviewAnalysis;

      if (type === 'invest') {
        contributionAnalysis = response;
      } else if (type === 'cust') {
        reviewAnalysis = response;
      }
      return {
        ...state,
        contributionAnalysis,
        reviewAnalysis,
      };
    },

    // 概览数据列表
    getCurrentRankingRecordSuccess(state, action) {
      const { payload: { currentRanking } } = action;
      const currentRankingRecord = currentRanking.resultData;
      return {
        ...state,
        currentRankingRecord,
      };
    },

    // 历史对比数据
    getContrastDataSuccess(state, action) {
      const { payload: { contrastData } } = action;
      return {
        ...state,
        contrastData,
      };
    },
  },
  effects: {
    // 初始化获取数据
    * getAllInfo({ payload }, { call, put, select }) {
      const cust = yield select(state => state.report.custRange);
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
      // 查询当前用户所能够看到的看板报表
      const allVisibleReports = yield call(api.getAllVisibleReports, {
        orgId: firstCust.id,
      });
      yield put({
        type: 'getAllVisibleReportsSuccess',
        payload: { allVisibleReports },
      });
      // 历史指标概览
      const resHistoryCore = yield call(api.getHistoryCore, {
        orgId: firstCust.id,
      });
      yield put({
        type: 'getHistoryCoreSuccess',
        payload: { resHistoryCore },
      });
      // 强弱指示分析
      const currentRanking = yield call(api.getCurrentRankingRecord, {
        orgId: firstCust.id,
      });
      yield put({
        type: 'getCurrentRankingRecordSuccess',
        payload: { currentRanking },
      });
    },
    // 获取客户贡献分析与入岗投顾能力散点图数据
    * queryContrastAnalyze({ payload }, { call, put }) {
      const { type } = payload;
      const response = yield call(api.queryContrastAnalyze, payload);
      const { resultData } = response;
      yield put({
        type: 'queryContrastAnalyzeSuccess',
        payload: { response: resultData, type },
      });
    },

    // 获取历史对比数据
    * getContrastData({ payload }, { call, put }) {
      const response = yield call(api.getHistoryContrastLineChartData, payload);
      const { resultData } = response;
      yield put({
        type: 'getContrastDataSuccess',
        payload: { contrastData: resultData },
      });
    },
  },
  subscriptions: {},
};
