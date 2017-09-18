/**
 * @file models/contract.js
 * 合约管理
 * @author wanghan
 */

// import { routerRedux } from 'dva/router';

import { message } from 'antd';
// import _ from 'lodash';
import { contract as api } from '../api';
// import { helper } from '../utils';
// import config from '../config/request';
const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'contract',
  state: {
    list: EMPTY_LIST,
    contractDetail: EMPTY_OBJECT,
  },
  reducers: {
    getDetailSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        contractDetail: resultData,
      };
    },
  },
  effects: {
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
