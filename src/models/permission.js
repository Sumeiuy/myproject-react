/**
 * @file models/premissinon.js
 * @author honggaungqing
 */

// import { routerRedux } from 'dva/router';
// import { message } from 'antd';
// import _ from 'lodash';
import { permission as api } from '../api';
// import { helper } from '../utils';

const EMPTY_OBJECT = {};
// const EMPTY_LIST = [];

export default {
  namespace: 'permission',
  state: {
    detailMessage: EMPTY_OBJECT,
  },
  reducers: {
    getDetailMessageSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailMessage: resultData,
      };
    },
  },
  effects: {
    * getDetailMessage({ payload }, { call, put }) {
      const response = yield call(api.getMessage, payload);

      yield put({
        type: 'getDetailMessageSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
