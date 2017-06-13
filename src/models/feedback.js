/**
 * @file models/feedback.js
 * @author yangquanjian
 */

// import { routerRedux } from 'dva/router';

// import api from '../api';
// import config from '../config/request';
export default {
  namespace: 'feedback',
  state: {
    problem: {
      popVisible: false,
    },
  },
  reducers: {
    changeProblemVisible(state, action) {
      const { payload: { count } } = action;
      return {
        ...state,
        problem: count,
      };
    },
  },
  effects: {},
  subscriptions: {},
};
