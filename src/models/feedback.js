/**
 * @file models/feedback.js
 * @author yangquanjian
 */

// import { routerRedux } from 'dva/router';

import api from '../api';
// import config from '../config/request';
const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'feedback',
  state: {
    problem: {
      popVisible: false,
    },
    list: EMPTY_OBJECT,
    fbDetail: EMPTY_OBJECT,
  },
  reducers: {
    changeProblemVisible(state, action) {
      const { payload: { count } } = action;
      return {
        ...state,
        problem: count,
      };
    },
    getFeedbackListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { pageDTO, feedbackList } = resultData;
      const { listData: preListData = EMPTY_LIST } = state.list;
      return {
        ...state,
        list: pageDTO.curPageNum === 1 ? { page: pageDTO, resultData: feedbackList }
          : { page: pageDTO, resultData: [...preListData, ...feedbackList] },
      };
    },
    getFeedbackDetailSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        fbDetail: {
          resultData,
        },
      };
    },
  },
  effects: {
    * getFeedbackList({ payload }, { call, put }) {
      const response = yield call(api.getFeedbackList, payload);
      yield put({
        type: 'getFeedbackListSuccess',
        payload: response,
      });
    },
    * getFeedbackDetail({ payload }, { call, put }) {
      const response = yield call(api.getFeedbackDetail, payload);
      yield put({
        type: 'getFeedbackDetailSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
