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
    drafterList: EMPTY_LIST, // 拟稿人
    custList: EMPTY_LIST, // 客户
    custRange: EMPTY_LIST, // 部门
  },
  reducers: {
    getDetailMessageSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      console.warn('resultData', resultData);
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
    getDrafterListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { empInfo = EMPTY_LIST } = resultData;

      return {
        ...state,
        drafterList: empInfo,
      };
    },
    getCustListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { tcustList = EMPTY_LIST } = resultData;

      return {
        ...state,
        custList: tcustList,
      };
    },
    getEmpOrgTreeSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      let custRange;
      if (resultData.level === '1') {
        custRange = [
          { id: resultData.id, name: resultData.name, level: resultData.level },
          ...resultData.children,
        ];
      } else {
        custRange = [resultData];
      }
      console.warn('custRange111', custRange);
      return {
        ...state,
        custRange,
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
      const result = response.resultData.applicationList;
      if (Array.isArray(result) && result.length) {
        const detailList = yield call(api.getMessage, {
          id: result[0].id,
        });
        console.warn('detailList', detailList);
        yield put({
          type: 'getDetailMessageSuccess',
          payload: detailList,
        });
      }
    },
    * getDrafterList({ payload }, { call, put }) {
      const response = yield call(api.getDrafterList, payload);
      yield put({
        type: 'getDrafterListSuccess',
        payload: response,
      });
    },
    * getCustList({ payload }, { call, put }) {
      const response = yield call(api.getCustList, payload);
      yield put({
        type: 'getCustListSuccess',
        payload: response,
      });
    },
    * getEmpOrgTree({ payload }, { call, put }) {
      const response = yield call(api.getEmpOrgTree, payload);
      console.warn('response123', response);
      yield put({
        type: 'getEmpOrgTreeSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
