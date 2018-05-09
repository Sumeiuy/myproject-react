/**
 * @Author: sunweibin
 * @Date: 2018-05-08 13:27:31
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-09 13:27:12
 * @description 营业部非投顾签约客户分配
 */

import { businessDepartmentCustDistribute as api } from '../api';

export default {
  namespace: 'custDistribute',
  state: {
    // 签约客户分配右侧详情
    detailInfo: {},
  },

  reducers: {
    getApplyDetailSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        detailInfo: payload,
      };
    },
  },

  effects: {
    // 获取营业部非投顾签约客户分配申请单详情
    * getApplyDetail({ payload }, { call, put }) {
      const { resultData = {} } = yield call(api.getAppDetail, payload);
      yield put({
        type: 'getApplyDetailSuccess',
        payload: resultData,
      });
    },
  },

  subscriptions: {},
};
