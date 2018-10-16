/*
 * @Author: sunweibin
 * @Date: 2018-10-09 15:38:02
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-09 16:14:16
 * @description 新版客户360详情的model
 */

import { customerDetail as api } from '../api';

const EMPTY_OBJECT = {};

export default {
  namespace: 'customerDetail',
  state: {
    // 概要详情数据
    summaryInfo: EMPTY_OBJECT,
    // 客户概要信息基本数据
    customerBasicInfo: EMPTY_OBJECT,
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
    getCustomerBasicInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        customerBasicInfo: resultData,
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
    // 获取客户基本信息
    * getCustomerBasicInfo({ payload }, { call, put }) {
      const response = yield call(api.queryCustomerBasicInfo, payload);
      yield put({
        type: 'getCustomerBasicInfoSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {
  },
};

