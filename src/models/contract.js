/**
 * @file models/contract.js
 * 合约管理
 * @author wanghan
 */

/**
 * @file models/premissinon.js
 * @author honggaungqing
 */
import { message } from 'antd';
import { contract as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'contract',
  state: {
    detailMessage: EMPTY_OBJECT,
    list: EMPTY_OBJECT,
    contractDetail: EMPTY_OBJECT,
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
      const { page = EMPTY_OBJECT, contractVOList = EMPTY_LIST } = resultData;
      const { listData: preListData = EMPTY_LIST } = state.list;

      return {
        ...state,
        list: {
          page,
          resultData: page.pageNum === 1 ?
            contractVOList : [...preListData, ...contractVOList],
        },
      };
    },
    getDetailSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        contractDetail: resultData,
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
    },
    * getDetail({ payload }, { call, put }) {
      const response = yield call(api.getContractDetail, payload);
      yield put({
        type: 'getDetailSuccess',
        payload: response,
      });
    },
    * saveDetail({ payload }, { call, put, select }) {
      yield call(api.getContractDetail, payload);
      message.success('操作成功！');
      const id = yield select(state => state.contract.contractDetail.id);
      yield put({
        type: 'getDetail',
        payload: {
          id,
        },
      });
    },
  },
  subscriptions: {},
};
