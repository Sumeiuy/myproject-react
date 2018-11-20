/*
 * @Author: yuanhaojie
 * @Date: 2018-11-20 16:16:41
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-20 17:04:08
 * @Description: 新版客户360详情下的产品订单Tab页面的model
 */
import { detailProductOrder as api } from '../../api';

const EMPTY_ARRAY = [];

export default {
  namespace: 'productOrder',
  state: {
    serviceOrderFlow: EMPTY_ARRAY,
  },
  reducers: {
    queryServiceOrderFlowSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        serviceOrderFlow: payload || EMPTY_ARRAY,
      };
    },
  },
  effects: {
    * queryServiceOrderFlow({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryServiceOrderFlow, payload);
      yield put({
        type: 'queryServiceOrderFlowSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
  },
};
