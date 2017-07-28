/**
 * @file models/customerPool.js
 *  目标客户池模型管理
 * @author wangjunjun
 */
import api from '../api';

export default {
  namespace: 'customerPool',
  state: {
    todolist: [],
  },
  subscriptions: {},
  effects: {
    * getToDoList({ payload }, { call, put }) {
      const response = yield call(api.getToDoList, payload);
      yield put({
        type: 'getToDoListSuccess',
        payload: response,
      });
    },
  },
  reducers: {
    getToDoListSuccess(state, action) {
      const { payload: { resultData: { data } } } = action;
      data.forEach((item) => {
        item.task = {  //eslint-disable-line
          text: item.subject,
          dispatchUri: item.dispatchUri,
        };
      });
      return {
        ...state,
        todolist: data,
      };
    },
  },
};
