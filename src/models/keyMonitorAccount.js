/**
 * @Author: sunweibin
 * @Date: 2018-06-19 16:19:31
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-19 17:26:12
 * @description models/keyMonitorAccount.js
 */

import { keyMonitorAccount as api } from '../api';

export default {
  namespace: 'keyMonitorAccount',
  state: {
    // 重点监控账户列表
    accountListInfo: {},
  },
  reducers: {
    getAccountListInfoSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        accountListInfo: resultData,
      };
    },

    opertateState(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 根据筛选条件获取重点监控账户列表
    * getAccountList({ payload = {} }, { call, put }) {
      const response = yield call(api.getAccountList, payload);
      yield put({
        type: 'getAccountListInfoSuccess',
        payload: response,
      });
    },

    // 清空在redux中保存的查询结果
    * clearReduxState({ payload }, { put }) {
      yield put({
        type: 'opertateState',
        payload,
      });
    },
  },
  subscriptions: {},
};
