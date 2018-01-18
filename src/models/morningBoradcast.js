/**
 * Created By K0170179 on 2018/1/17
 * 每日晨报
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */

import { morningBoradcast as api } from '../api';

export default {
  namespace: 'morningBoradcast',
  state: {
    boradcastList: [],
    boradcastDetail: {},
  },
  reducers: {
    // 搜索晨报列表成功
    getBoradcastListSuccess(state, action) {
      const { payload: { data: { dataList = [] } } } = action;
      return {
        ...state,
        boradcastList: dataList,
      };
    },
    getBoradcastDetailSuccess(state, action) {
      const { payload: { data = {} } } = action;
      return {
        ...state,
        boradcastDetail: data,
      };
    },
  },
  effects: {
    * getBoradcastList({ payload }, { call, put }) {
      const response = yield call(api.searchBoradcastList, payload);
      yield put({
        type: 'getBoradcastListSuccess',
        payload: response,
      });
    },
    * getBoradcastDetail({ payload }, { call, put }) {
      const response = yield call(api.searchBoradcastDetail, payload);
      yield put({
        type: 'getBoradcastDetailSuccess',
        payload: response,
      });
    },
  },
};
