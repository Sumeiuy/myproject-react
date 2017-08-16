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
    custRange: [], // 组织机构树
    visibleBoards: [], // 可见看板
    newVisibleBoards: [], // 新可见看板
    contributionAnalysis: {}, // 贡献能力分析数据
    reviewAnalysis: {}, // 入岗投顾能力分析数据
    historyCore: [], // 概览列表
    currentRankingRecord: {}, // 强弱指示分析
    historyContrastDic: {}, // 字典
    contrastData: {}, // 历史对比数据
    createLoading: false, // 创建历史对比看板成功与否
    deleteLoading: false, // 删除历史对比看板成功与否
    updateLoading: false, // 保存历史对比看板成功与否
    message: '', // 各种操作的提示信息
    operateData: {}, // 各种操作后，返回的数据集
    indicatorLib: {}, // 指标库
    rankData: {}, // 历史对比排名数据
  },
  reducers: {// 成功获取指标库
    getIndicatorLibSuccess(state, action) {
      const { payload: { indicatorResult } } = action;
      const indicatorLib = indicatorResult.resultData || [];
      return {
        ...state,
        indicatorLib,
      };
    },
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
          ...visibleBoards.history,
          ...visibleBoards.ordinary,
        ],
        newVisibleBoards: [
          ...BoardBasic.regular,
          visibleBoards,
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

      if (type === 'cust') {
        contributionAnalysis = response;
      } else if (type === 'invest') {
        reviewAnalysis = response;
      }
      return {
        ...state,
        contributionAnalysis,
        reviewAnalysis,
      };
    },

    // 雷达数据列表
    getCurrentRankingRecordSuccess(state, action) {
      const { payload: { currentRanking } } = action;
      const currentRankingRecord = currentRanking.resultData.currentRankingRecordVo;
      return {
        ...state,
        currentRankingRecord,
      };
    },

    // 获取字典数据成功
    queryHistoryContrastSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        historyContrastDic: resultData,
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

    // 各种操作的状态
    opertateBoardState(state, action) {
      const { payload: { name, value, message, operateData } } = action;
      return {
        ...state,
        [name]: value,
        message,
        operateData,
      };
    },
    // 历史对比排名
    getRankDataSuccess(state, action) {
      let { payload: { rankData } } = action;
      if (rankData === null) {
        rankData = {};
      }
      return {
        ...state,
        rankData,
      };
    },
  },
  effects: {
    // 加载页面，提前需要获取的数据
    * getInitial({ payload }, { call, put, select }) {
      // 组织机构树
      const custRange = yield select(state => state.history.custRange);
      let firstCust;
      if (custRange.length) {
        firstCust = custRange[0];
      } else {
        const response = yield call(api.getCustRange, payload.custRang);
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
      // 获取散点图对比值字典
      const dicResponse = yield call(api.queryHistoryContrast, {
        ...payload.dic,
        orgId: firstCust.id,
      });
      yield put({
        type: 'queryHistoryContrastSuccess',
        payload: dicResponse,
      });
      // 查询HistoryCore
      const resHistoryCore = yield call(api.getHistoryCore, {
        ...payload.core,
        orgId: firstCust.id,
        scope: firstCust.level,
        localScope: firstCust.level,
      });
      yield put({
        type: 'getHistoryCoreSuccess',
        payload: { resHistoryCore },
      });
      const firstCore = resHistoryCore.resultData[0];
      // 查询雷达图, 因为雷达图只有在localScope>1时候才会有值
      if (firstCust.level !== '1') {
        const currentRanking = yield call(api.getCurrentRankingRecord, {
          ...payload.radar,
          orgId: firstCust.id,
          scope: firstCust.level,
          localScope: firstCust.level,
        });
        yield put({
          type: 'getCurrentRankingRecordSuccess',
          payload: { currentRanking },
        });
      }
      // 历史对比折线图
      const polyResponse = yield call(api.getHistoryContrastLineChartData, {
        ...payload.poly,
        coreIndicatorId: firstCore.key,
        orgId: firstCust.id,
        scope: firstCust.level,
        localScope: firstCust.level,
      });
      yield put({
        type: 'getContrastDataSuccess',
        payload: { contrastData: polyResponse.resultData },
      });
      // 查询排名柱状图数据
      const barResponse = yield call(api.getHistoryRankChartData, {
        ...payload.bar,
        indicatorId: firstCore.key,
        orderIndicatorId: firstCore.key,
        orgId: firstCust.id,
        localScope: firstCust.level,
        scope: String(Number(firstCust.level) + 1),
      });
      yield put({
        type: 'getRankDataSuccess',
        payload: { rankData: barResponse.resultData },
      });

      // 散点图数据
      const { cust, invest } = yield select(state => state.history.historyContrastDic);
      const scatterCommon = {
        orgId: firstCust.id,
        localScope: firstCust.level,
        scope: String(Number(firstCust.level) + 1),
        coreIndicatorId: firstCore.key,
      };
      // 客户散点
      const custScatterRes = yield call(api.queryContrastAnalyze, {
        ...payload.custScatter,
        ...scatterCommon,
        contrastIndicatorId: cust && cust[0].key,
      });
      yield put({
        type: 'queryContrastAnalyzeSuccess',
        payload: { response: custScatterRes.resultData, type: 'cust' },
      });
      // 投顾散点
      const investScatterRes = yield call(api.queryContrastAnalyze, {
        ...payload.investScatter,
        ...scatterCommon,
        contrastIndicatorId: invest && invest[0].key,
      });
      yield put({
        type: 'queryContrastAnalyzeSuccess',
        payload: { response: investScatterRes.resultData, type: 'invest' },
      });

      // 获取指标树数据
      const indicatorResult = yield call(api.getIndicators, {
        ...payload.lib,
        orgId: firstCust.id,
      });
      yield put({
        type: 'getIndicatorLibSuccess',
        payload: { indicatorResult },
      });
    },
    // 获取历史对比核心指标
    * getHistoryCore({ payload }, { call, put, select }) {
      const custRange = yield select(state => state.history.custRange);
      const firstCust = custRange[0];
      const resHistoryCore = yield call(api.getHistoryCore, {
        ...payload,
        scope: payload.scope || firstCust.level,
        localScope: payload.localScope || firstCust.level,
        orgId: payload.orgId || firstCust.id,
      });
      yield put({
        type: 'getHistoryCoreSuccess',
        payload: { resHistoryCore },
      });
    },

    // 获取雷达图数据
    * getRadarData({ payload }, { call, put }) {
      // 强弱指示分析
      const currentRanking = yield call(api.getCurrentRankingRecord, payload);
      yield put({
        type: 'getCurrentRankingRecordSuccess',
        payload: { currentRanking },
      });
    },
    // 获取指标库
    * getIndicatorLib({ payload }, { call, put }) {
      const indicatorResult = yield call(api.getIndicators, payload);
      yield put({
        type: 'getIndicatorLibSuccess',
        payload: { indicatorResult },
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
    // 获取对比字典数据
    * queryHistoryContrast({ payload }, { call, put }) {
      const dicResponse = yield call(api.queryHistoryContrast, payload);
      yield put({
        type: 'queryHistoryContrastSuccess',
        payload: dicResponse,
      });
    },
    // 获取历史对比折线图数据
    * getContrastData({ payload }, { call, put, select }) {
      const custRange = yield select(state => state.history.custRange);
      const firstCust = custRange[0];
      const response = yield call(api.getHistoryContrastLineChartData, {
        ...payload,
        scope: payload.scope || firstCust.level,
        localScope: payload.localScope || firstCust.level,
        orgId: payload.orgId || firstCust.id,
      });
      const { resultData } = response;
      yield put({
        type: 'getContrastDataSuccess',
        payload: { contrastData: resultData },
      });
    },
    // 创建历史对比看板
    * createHistoryBoard({ payload }, { call, put }) {
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'createLoading',
          value: true,
          message: '开始创建',
        },
      });
      const createBoardResult = yield call(api.createHistoryBoard, payload);
      const code = createBoardResult.code;
      const msg = createBoardResult.msg;
      let board = {};
      if (code !== '0') {
        // 名称重复
        board = {
          success: false,
          code,
          msg,
        };
      } else {
        // 成功
        board = {
          success: true,
          ...createBoardResult.resultData,
        };
      }
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'createLoading',
          value: false,
          message: '创建完成',
          operateData: board,
        },
      });
    },
    // 删除历史对比看板
    * deleteHistoryBoard({ payload }, { call, put }) {
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'deleteLoading',
          value: true,
          message: '开始删除',
        },
      });
      yield call(api.deleteHistoryBoard, payload);
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'deleteLoading',
          value: false,
          message: '删除完成',
        },
      });
    },
    // 保存(更新)历史对比看板
    * updateHistoryBoard({ payload }, { call, put }) {
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'updateLoading',
          value: true,
          message: '开始保存',
        },
      });
      const publishResult = yield call(api.updateHistoryBoard, payload);
      const board = publishResult.resultData;
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'updateLoading',
          value: false,
          message: '保存完成',
          operateData: board,
        },
      });
    },
    // 获取历史排名数据
    * getRankData({ payload }, { call, put }) {
      const response = yield call(api.getHistoryRankChartData, payload);
      const { resultData } = response;
      yield put({
        type: 'getRankDataSuccess',
        payload: { rankData: resultData },
      });
    },
  },
  subscriptions: {},
};
