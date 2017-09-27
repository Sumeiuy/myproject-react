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
    detailMessage: EMPTY_OBJECT, // 详情
    // searchServerPersonList: EMPTY_LIST, // 服务人员列表
    childTypeList: EMPTY_LIST, // 子类型
    hasServerPersonList: EMPTY_LIST, // 已有服务人员列表
    searchServerPersonList: EMPTY_LIST, // 可查询服务人员列表
  },
  reducers: {
    getDetailMessageSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailMessage: resultData,
      };
    },
    getSearchServerPersonListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { servicePeopleList = EMPTY_LIST } = resultData;
      return {
        ...state,
        searchServerPersonList: servicePeopleList,
      };
    },
    getChildTypeListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { childList = EMPTY_LIST } = resultData;

      return {
        ...state,
        childTypeList: childList,
      };
    },
    getHasServerPersonListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        hasServerPersonList: resultData,
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
    * getSearchServerPersonList({ payload }, { call, put }) {
      const response = yield call(api.getSearchServerPersonelList, payload);
      yield put({
        type: 'getSearchServerPersonListSuccess',
        payload: response,
      });
    },
    * getChildTypeList({ payload }, { call, put }) {
      const response = yield call(api.getChildTypeList, payload);
      yield put({
        type: 'getChildTypeListSuccess',
        payload: response,
      });
    },
    * getHasServerPersonList({ payload }, { call, put }) {
      const response = yield call(api.getHasServerPersonList, payload);
      yield put({
        type: 'getHasServerPersonListSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
