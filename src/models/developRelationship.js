/**
 * @file models/developRelationship.js
 * @author honggaungqing
 */

import { developRelationship as api } from '../api';

const EMPTY_OBJECT = {};

export default {
  namespace: 'developRelationship',
  state: {
    detailInfo: EMPTY_OBJECT, // 详情
  },
  reducers: {
    getDetailInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },
  },
  effects: {
    * getDetailInfo({ payload }, { call, put }) {
      const response = yield call(api.getDetailInfo, payload);
      yield put({
        type: 'getDetailInfoSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
