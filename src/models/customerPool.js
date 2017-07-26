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
    todolistPage: {
      pageSize: 10,
      curPageNum: 1,
      totalPageNum: 1,
      totalRecordNum: 0,
    },
  },
  subscriptions: {},
  effects: {
    * getToDoList({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(api.getToDoList, payload);
      yield put({
        type: 'getToDoListSuccess',
        payload: response,
      });
    },
  },
  reducers: {
    getToDoListSuccess(state, action) {
      const { payload: { data: { todolist, page } } } = action;
      return {
        ...state,
        todolist,
        todolistPage: page,
      };
    },
  },
};
