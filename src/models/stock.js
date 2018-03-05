/**
 * @Description: 个股相关 model
 * @Author: Liujianshu
 * @Date: 2018-03-01 14:34:40
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-03-01 15:06:30
 */

import { stock as api } from '../api';

export default {
  namespace: 'stock',
  state: {
    list: [],
    page: {},
    detail: {},
  },
  reducers: {
    getStockListSuccess(state, action) {
      console.warn('action', action);
      const { paylaod: { resultData: { list = [], page = {} } } } = action;
      return {
        ...state,
        list,
        page,
      };
    },
    getStockDetailSuccess(state, action) {
      const { paylaod: { resultData = {} } } = action;
      return {
        ...state,
        detail: resultData,
      };
    },
  },
  effects: {
    // 根据类型、分页、关键字、排序等字段查询列表
    * getStockList({ payload }, { call, put }) {
      const response = yield call(api.getStockList, payload);
      yield put({
        type: 'getStockListSuccess',
        paylaod: response,
      });
    },
    // 根据 ID 查询详情
    * getStockDetail({ payload }, { call, put }) {
      const response = yield call(api.getStockDetail, payload);
      yield put({
        type: 'getStockDetailSuccess',
        paylaod: response,
      });
    },
  },
  subscriptions: {},
};
