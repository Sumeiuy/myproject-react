/**
 * @file models/app.js
 *  全局模型管理
 * @author maoquan(maoquan@htsc.com)
 */
import api from '../api';
import { EVENT_PROFILE_ACTION } from '../config/log';

export default {
  namespace: 'app',
  state: {
    empInfo: {},
  },
  subscriptions: {},
  effects: {
    // 获取员工职责与职位
    * getEmpInfo({ payload }, { call, put }) {
      const response = yield call(api.getEmpInfo);
      const data = response.resultData;
      if (data) {
        yield put({
          type: 'getEmpInfoSuccess',
          payload: data,
        });
        yield put({
          type: EVENT_PROFILE_ACTION,
          payload: data.empInfo,
        });
      }
    },
  },
  reducers: {
    // 获取员工职责与职位
    getEmpInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        empInfo: payload,
      };
    },
  },
};
