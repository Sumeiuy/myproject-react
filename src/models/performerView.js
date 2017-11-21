/**
 * @Description: 执行者视图 model
 * @file models/performerView.js
 * @author hongguangqing
 */

import { performerView as api } from '../api';

export default {
  namespace: 'performerView',
  state: {
    taskDetailBasicInfo: {},
  },
  reducers: {
    getTaskDetailBasicInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        taskDetailBasicInfo: payload,
      };
    },
  },
  effects: {
    // 执行者视图的详情基本信息
    * getTaskDetailBasicInfo({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryTaskDetailBasicInfo, payload);
      yield put({
        type: 'getTaskDetailBasicInfoSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {},
};
