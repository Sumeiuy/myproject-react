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
    drafterList: EMPTY_LIST, // 拟稿人
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
      const { page = EMPTY_OBJECT, applicationList = EMPTY_LIST } = resultData;
      const { listData: preListData = EMPTY_LIST } = state.list;

      return {
        ...state,
        list: {
          page,
          resultData: page.pageNum === 1 ?
            applicationList : [...preListData, ...applicationList],
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
    getDrafterListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { empInfo = EMPTY_LIST } = resultData;

      return {
        ...state,
        drafterList: empInfo,
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
    * getDrafterList({ payload }, { call, put }) {
      const response = yield call(api.getEmpList, payload);
      yield put({
        type: 'getDrafterListSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
