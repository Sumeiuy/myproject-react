/**
 * @file models/premissinon.js
 * @author honggaungqing
 */

import { permission as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'permission',
  state: {
    detailMessage: EMPTY_OBJECT,
    list: EMPTY_OBJECT,
    serverPersonelList: EMPTY_LIST,
  },
  reducers: {
    getDetailMessageSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;

      return {
        ...state,
        detailMessage: resultData,
      };
    },
    getPermissionListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { page = EMPTY_OBJECT, permissionVOList = EMPTY_LIST } = resultData;
      const { listData: preListData = EMPTY_LIST } = state.list;

      return {
        ...state,
        list: {
          page,
          resultData: page.pageNum === 1 ?
            permissionVOList : [...preListData, ...permissionVOList],
        },
      };
    },
    getServerPersonelListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        serverPersonelList: resultData,
      };
    },
  },
  effects: {
    * getDetailMessage({ payload }, { call, put }) {
      const response = yield call(api.getMessage, payload);
      yield put({
        type: 'getDetailMessageSuccess',
        payload: response,
      });
    },
    * getPermissionList({ payload }, { call, put }) {
      const response = yield call(api.getPermissionList, payload);
      yield put({
        type: 'getPermissionListSuccess',
        payload: response,
      });
    },
    * getServerPersonelList({ payload }, { call, put }) {
      const response = yield call(api.getServerPersonelList, payload);
      yield put({
        type: 'getServerPersonelListSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
