/*
 * @Description: 合作合约 model
 * @Author: LiuJianShu
 * @Date: 2017-09-20 15:13:30
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-09-20 15:51:13
 */
import { contract as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'contract',
  state: {
    detailMessage: EMPTY_OBJECT,
    list: EMPTY_OBJECT,
    drafterList: EMPTY_LIST, // 拟稿人
    empOrgTreeList: EMPTY_OBJECT, // 部门
  },
  reducers: {
    getDetailMessageSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailMessage: resultData,
      };
    },
    getContractListSuccess(state, action) {
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
    getEmpOrgTreeSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;

      return {
        ...state,
        empOrgTreeList: resultData,
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
    * getContractList({ payload }, { call, put }) {
      const response = yield call(api.getContractList, payload);
      yield put({
        type: 'getContractListSuccess',
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
    * getEmpOrgTree({ payload }, { call, put }) {
      const response = yield call(api.getEmpOrgTree, payload);
      yield put({
        type: 'getEmpOrgTreeSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
