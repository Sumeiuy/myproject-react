/*
 * @Author: XuWenKang
 * @Description: 精选组合modal
 * @Date: 2018-04-17 10:08:03
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-17 10:45:29
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
    // 获取近一周表现前十的证券
    * getWeeklySecurityTopTen({ payload }, { call, put }) {
      const response = yield call(api.getWeeklySecurityTopTen, payload);
      yield put({
        type: 'getWeeklySecurityTopTenSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {

  },
};
