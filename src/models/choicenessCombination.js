/*
 * @Author: XuWenKang
 * @Description: 精选组合modal
 * @Date: 2018-04-17 10:08:03
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-24 16:22:02
*/

// import _ from 'lodash';
import { choicenessCombination as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'choicenessCombination',
  state: {
    adjustWarehouseHistoryData: EMPTY_OBJECT, // 调仓历史数据
    combinationAdjustHistoryData: EMPTY_OBJECT, // 组合调仓数据
    weeklySecurityTopTenData: EMPTY_LIST, // 近一周表现前十的证券
    combinationTreeList: EMPTY_LIST, // 组合树
    combinationRankList: EMPTY_LIST, // 组合排名列表
    combinationChartData: EMPTY_OBJECT, // 组合趋势图
  },
  reducers: {
    // 获取调仓历史数据
    getAdjustWarehouseHistorySuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        adjustWarehouseHistoryData: resultData,
      };
    },
    // 获取组合调仓数据
    getCombinationAdjustHistorySuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        adjustWarehouseHistoryData: resultData,
      };
    },
    // 获取近一周表现前十的证券
    getWeeklySecurityTopTenSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        weeklySecurityTopTenData: resultData,
      };
    },
    // 获取组合树
    getCombinationTreeSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        combinationTreeList: resultData,
      };
    },
    // 获取组合排名列表
    getCombinationRankListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        combinationRankList: resultData,
      };
    },
    // 获取对应组合趋势图数据
    getCombinationChartSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        combinationChartData: resultData,
      };
    },
  },
  effects: {
    // 获取调仓历史数据
    * getAdjustWarehouseHistory({ payload }, { call, put }) {
      const response = yield call(api.getAdjustWarehouseHistory, payload);
      yield put({
        type: 'getAdjustWarehouseHistorySuccess',
        payload: response,
      });
    },
    // 获取组合构成证券列表/近一周表现前十的证券
    * getCombinationSecurityList({ payload }, { call, put }) {
      const response = yield call(api.getCombinationSecurityList, payload);
      yield put({
        type: 'getWeeklySecurityTopTenSuccess',
        payload: response,
      });
    },
    // 获取组合树
    * getCombinationTree({ payload }, { call, put }) {
      const response = yield call(api.getCombinationTree, payload);
      yield put({
        type: 'getCombinationTreeSuccess',
        payload: response,
      });
    },
    // 获取组合排名列表
    * getCombinationRankList({ payload }, { call, put }) {
      const response = yield call(api.getCombinationRankList, payload);
      yield put({
        type: 'getCombinationRankListSuccess',
        payload: response,
      });
    },
    // 根据组合id获取对应趋势图数据
    * getCombinationChart({ payload }, { call, put }) {
      const response = yield call(api.getCombinationChart, payload);
      yield put({
        type: 'getCombinationChartSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {

  },
};
