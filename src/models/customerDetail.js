/*
 * @Author: sunweibin
 * @Date: 2018-10-09 15:38:02
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 17:33:58
 * @description 新版客户360详情的model
 */
import { customerDetail as api } from '../api';

export default {
  namespace: 'customerDetail',
  state: {
    // 概要详情数据
    summaryInfo: {},
    // 更多重点标签信息
    moreLabelInfo: {},
    // 客户概要信息基本数据
    customerBasicInfo: {},
  },
  reducers: {
    queryCustSummaryInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        summaryInfo: payload || {},
      };
    },
    queryAllKeyLabelsSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        moreLabelInfo: payload || {},
      };
    },
    // 清除redux数据
    clearReduxDataSuccess(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        ...payload,
      };
    },
    getCustomerBasicInfoSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        customerBasicInfo: resultData,
      };
    },
  },
  effects: {
    // 查询新版360客户详情下的概要信息
    * queryCustSummaryInfo({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryCustSummaryInfo, payload);
      yield put({
        type: 'queryCustSummaryInfoSuccess',
        payload: resultData,
      });
    },
    // 查询新版360客户详情下的概要信息
    * queryAllKeyLabels({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryAllKeyLabels, payload);
      yield put({
        type: 'queryAllKeyLabelsSuccess',
        payload: resultData,
      });
    },
    // 清空数据
    * clearReduxData({ payload }, { put }) {
      yield put({
        type: 'clearReduxDataSuccess',
        payload,
      });
    },
    // 获取客户基本信息
    * getCustomerBasicInfo({ payload }, { call, put }) {
      const response = yield call(api.queryCustomerBasicInfo, payload);
      yield put({
        type: 'getCustomerBasicInfoSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {
  },
};
