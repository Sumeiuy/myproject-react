/**
 * @file models/app.js
 *  全局模型管理
 * @author maoquan(maoquan@htsc.com)
 */
import api from '../api';

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
        response: resultData,
      });
    },
  },
  reducers: {
    // 获取员工职责与职位
    getEmpInfoSuccess(state, action) {
      const { response: { resultData } } = action;
      return {
        ...state,
        empInfo: resultData,
      };
    },
  },
};
