/*
 * @Author: zhangjun
 * @Date: 2018-06-05 17:15:59
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-07 11:09:04
 */

import { stockOptionEvaluation as api } from '../api';

export default {
  namespace: 'stockOptionEvaluation',
  state: {
    // 股票期权申请页面-右侧详情
    detailInfo: {},
  },
  reducers: {
    // 股票期权申请页面-右侧详情
    getDetailInfoSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },
  },
  effects: {
    // 股票期权申请页面-右侧详情
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
