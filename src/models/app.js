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
      const resultData = yield call(api.getEmpInfo);
      yield put({
        type: 'getEmpInfoSuccess',
        payload: resultData,
      });
      yield put({
        type: EVENT_PROFILE_ACTION,
        payload: resultData,
      });
    },
  },
  reducers: {
    // 获取员工职责与职位
    getEmpInfoSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        empInfo: resultData,
      };
    },
  },
};
