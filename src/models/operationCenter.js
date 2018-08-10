/* eslint-disable import/no-anonymous-default-export */
/**
 * @Descripter: 平台参数设置/运营中心
 * @Author: K0170179
 * @Date: 2018/4/28
 */


import { operationCenter as api, customerPool as customerPoolApi } from '../api';

const EMPTY_LIST = [];

export default {
  namespace: 'operationCenter',
  state: {
    hotWds: EMPTY_LIST,
    custLabels: EMPTY_LIST,
  },
  reducers: {
    queryHotWds3Success(state, action) {
      return {
        ...state,
        hotWds: action.payload,
      };
    },
    queryCustLabelsSuccess(state, action) {
      return {
        ...state,
        custLabels: action.payload,
      };
    },
  },
  effects: {
    // 获取首页热词列表
    * queryHotWds3({ payload }, { call, put }) {
      const { resultData } = yield call(customerPoolApi.getHotWds, payload);
      if (resultData) {
        yield put({
          type: 'queryHotWds3Success',
          payload: resultData,
        });
      }
    },
    // 查询用户标签（来自标准镜和普通）
    * queryCustLabels({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryCustLabels, payload);
      if (resultData) {
        yield put({
          type: 'queryCustLabelsSuccess',
          payload: resultData,
        });
      }
    },
    // 查询用户标签（来自标准镜和普通）
    * updataCustLabels({ payload }, { call }) {
      yield call(api.updataCustLabels, payload);
    },
  },
  subscriptions: {
  },
};
