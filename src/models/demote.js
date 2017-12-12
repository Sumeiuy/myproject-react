/*
 * @Author: LiuJianShu
 * @Date: 2017-12-11 13:22:52
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-12-11 20:21:03
 */
import { demote as api } from '../api';

export default {
  namespace: 'demote',
  state: {
    custList: [],
  },
  reducers: {
    // 清除数据
    clearPropsDataSuccess(state, action) {
      const { payload: { resultData = [] } } = action;
      return {
        ...state,
        protocolProductList: resultData,
        protocolClauseList: resultData,
        underCustList: resultData,
      };
    },
    getCustListSuccess(state, action) {
      const { paylaod: { resultData = [] } } = action;
      return {
        ...state,
        custList: resultData,
      };
    },
  },
  effects: {
    // 根据提醒 ID 以及 empId 获取降级客户列表
    * getCustList({ payload }, { call, put }) {
      const response = yield call(api.getCustList, payload);
      yield put({
        type: 'getCustListSuccess',
        paylaod: response,
      });
    },
    // 操作降级
    * updateCust({ payload }, { call, put }) {
      const response = yield call(api.updateCust, payload);
      yield put({
        type: 'updateCustSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/demote') {
          // 进入页面查询降级客户列表
          const payload = {
            time: '20180101', // TODO ,测试数据，等删除
          };
          dispatch({ type: 'getCustList', payload });
        }
      });
    },
  },
};
