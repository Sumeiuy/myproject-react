/*
 * @Description: 合作合约 model
 * @Author: LiuJianShu
 * @Date: 2017-09-20 15:13:30
 * @Last Modified by:   XuWenKang
 * @Last Modified time: 2017-09-27 10:21:09
 */
import { contract as api, ceFileDelete, seibel as seibelApi } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'contract',
  state: {
    detailMessage: EMPTY_OBJECT,
    list: EMPTY_OBJECT,
    drafterList: EMPTY_LIST, // 拟稿人
    empOrgTreeList: EMPTY_OBJECT, // 部门
    attaches: EMPTY_LIST, // 附件信息
    custList: EMPTY_LIST, // 客户列表
    contractDetail: EMPTY_OBJECT, // 合约详情
    contractNumList: EMPTY_LIST, // 合作合约编号列表
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
    ceFileDeleteSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        attachment: resultData,
      };
    },
    getCutListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { custList = EMPTY_LIST } = resultData;
      return {
        ...state,
        custList,
      };
    },
    getContractDetailSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        contractDetail: resultData,
      };
    },
    saveContractDataSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      console.log(resultData);
      return {
        ...state,
      };
    },
    getContractNumListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        contractNumList: resultData,
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
    * ceFileDelete({ payload }, { call, put }) {
      const response = yield call(ceFileDelete, payload);
      yield put({
        type: 'ceFileDeleteSuccess',
        payload: response,
      });
    },
    * getCutList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getCanApplyCustList, payload);
      yield put({
        type: 'getCutListSuccess',
        payload: response,
      });
    },
    * getContractDetail({ payload }, { call, put }) {
      const response = yield call(api.getContractDetail, payload);
      yield put({
        type: 'getContractDetailSuccess',
        payload: response,
      });
    },
    * saveContractData({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(api.saveContractData, payload);
      yield put({
        type: 'saveContractDataSuccess',
        payload: response,
      });
    },
    * getContractNumList({ payload }, { call, put }) {
      const response = yield call(api.getContractNumList, payload);
      yield put({
        type: 'getContractNumListSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
