/*
 * @Author: wangyikai
 * @Date: 2018-11-19 15:33:09
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-26 18:11:09
 */

import { detailBusinessHand as api } from '../../api';

export default {
  namespace: 'detailBusinessHand',
  state: {
    // 业务办理下已开通业务数据
    openBusinessData: [],
    // 业务办理下未开通业务数据
    notOpenBusinessData: [],
    // 业务办理下未开通业务中的操作弹框数据
    operationData: [],
  },
  reducers: {
    // 业务办理下已开通业务的数据
    getOpenBusinessSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        openBusinessData: payload || {},
      };
    },
    // 业务办理下未开通业务的数据
    getNotOpenBusinessSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        notOpenBusinessData: payload || {},
      };
    },
    // 业务办理下未开通业务的操作弹框数据
    getDetailOperationSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        operationData: payload || {},
      };
    },
  },
  effects: {
    // 查询业务办理下已开通业务信息
    * getOpenBusiness({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryOpenBusiness, payload);
      yield put({
        type: 'getOpenBusinessSuccess',
        payload: resultData,
      });
    },
    // 查询业务办理下未开通业务信息
    * getNotOpenBusiness({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryNotOpenBusiness, payload);
      yield put({
        type: 'getNotOpenBusinessSuccess',
        payload: resultData,
      });
    },
    // 查询业务办理下未开通业务中的操作弹框信息
    * getDetailOperation({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryDetailOperation, payload);
      yield put({
        type: 'getDetailOperationSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {},
};
