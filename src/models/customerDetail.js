/*
 * @Author: sunweibin
 * @Date: 2018-10-09 15:38:02
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-09 16:14:16
 * @description 新版客户360详情的model
 */
// import { customerDetail as api } from '../api';

export default {
  namespace: 'customerDetail',
  state: {
    // 概要详情数据
    summaryInfo: {},
  },
  reducers: {
    // 清除redux数据
    clearReduxDataSuccess(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 清空数据
    * clearReduxData({ payload }, { put }) {
      yield put({
        type: 'clearReduxDataSuccess',
        payload,
      });
    },
  },
  subscriptions: {
  },
};

