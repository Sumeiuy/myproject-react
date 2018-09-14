/* eslint-disable import/no-anonymous-default-export */
/**
 * @Description: 丰富首页内容 model
 * @Author: Liujianshu
 * @Date: 2018-09-12 15:36:16
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-09-13 17:17:40
 */
import { newHome as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

export default {
  namespace: 'newHome',
  state: {
    keyAttention: EMPTY_ARRAY,
    guessYourInterests: EMPTY_ARRAY,
    productCalendar: EMPTY_ARRAY,
    chiefView: EMPTY_OBJECT,
    introCombination: EMPTY_ARRAY,
  },
  reducers: {
    // 重点关注
    queryKeyAttentionSuccess(state, action) {
      const { payload: { resultData = EMPTY_ARRAY } } = action;
      return {
        ...state,
        keyAttention: resultData,
      };
    },
    // 猜你感兴趣
    queryGuessYourInterestsSuccess(state, action) {
      const { payload: { resultData = EMPTY_ARRAY } } = action;
      return {
        ...state,
        guessYourInterests: resultData,
      };
    },
    // 日历产品
    queryProductCalendarSuccess(state, action) {
      const { payload: { resultData = EMPTY_ARRAY } } = action;
      return {
        ...state,
        productCalendar: resultData,
      };
    },
    // 首席观点
    queryChiefViewSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        chiefView: resultData,
      };
    },
    // 组合推荐
    queryIntroCombinationSuccess(state, action) {
      const { payload: { resultData = EMPTY_ARRAY } } = action;
      return {
        ...state,
        introCombination: resultData,
      };
    },
  },
  effects: {
    // 重点关注
    * queryKeyAttention({ payload }, { call, put }) {
      const response = yield call(api.queryKeyAttention, payload);
      yield put({
        type: 'queryKeyAttentionSuccess',
        payload: response,
      });
    },
    // 猜你感兴趣
    * queryGuessYourInterests({ payload }, { call, put }) {
      const response = yield call(api.queryGuessYourInterests, payload);
      yield put({
        type: 'queryGuessYourInterestsSuccess',
        payload: response,
      });
    },
    // 产品日历
    * queryProductCalendar({ payload }, { call, put }) {
      const response = yield call(api.queryProductCalendar, payload);
      yield put({
        type: 'queryProductCalendarSuccess',
        payload: response,
      });
    },
    // 首席观点
    * queryChiefView({ payload }, { call, put }) {
      const response = yield call(api.queryChiefView, payload);
      yield put({
        type: 'queryChiefViewSuccess',
        payload: response,
      });
    },
    // 组合推荐
    * queryIntroCombination({ payload }, { call, put }) {
      const response = yield call(api.queryIntroCombination, payload);
      yield put({
        type: 'queryIntroCombinationSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
