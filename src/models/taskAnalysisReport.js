/*
 * @Author: zhangjun
 * @Descripter: 任务分析报表models
 * @Date: 2018-10-05 12:11:39
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-09 21:54:35
 */
import { taskAnalysisReport as api } from '../api';

const EMPTY_LIST = [];

export default {
  namespace: 'taskAnalysisReport',
  state: {
    // 任务-客户报表数据
    taskCustomerList: [],
    // 完成服务客户统计数据
    completeServiceCustList: [],
    // 达标服务客户统计数据
    complianceServiceCustList: [],
    // 服务渠道统计数据
    serviceChannelList: [],
  },
  reducers: {
    // 获取任务-客户报表数据成功
    getTaskCustomerSuccess(state, action) {
      const { payload: { resultData: { reportList = EMPTY_LIST } } } = action;
      return {
        ...state,
        taskCustomerList: reportList,
      };
    },
    // 获取完成服务客户统计数据成功
    getCompleteServiceCustSuccess(state, action) {
      const { payload: { resultData: { reportList = EMPTY_LIST } } } = action;
      return {
        ...state,
        completeServiceCustList: reportList,
      };
    },
    // 获取达标服务客户统计数据成功
    getComplianceServiceCustSuccess(state, action) {
      const { payload: { resultData: { reportList = EMPTY_LIST } } } = action;
      return {
        ...state,
        complianceServiceCustList: reportList,
      };
    },
    // 获取服务渠道统计数据成功
    getServiceChannelSuccess(state, action) {
      const { payload: { resultData: { reportList = EMPTY_LIST } } } = action;
      return {
        ...state,
        serviceChannelList: reportList,
      };
    },
  },
  effects: {
    // 获取任务-客户报表数据
    * getTaskCustomer({ payload }, { call, put }) {
      const response = yield call(api.queryTaskCustomerReport, payload);
      yield put({
        type: 'getTaskCustomerSuccess',
        payload: response,
      });
    },
    // 获取完成服务客户统计数据
    * getCompleteServiceCust({ payload }, { call, put }) {
      const response = yield call(api.queryCompleteServiceCustReport, payload);
      yield put({
        type: 'getCompleteServiceCustSuccess',
        payload: response,
      });
    },
    // 获取达标服务客户统计数据
    * getComplianceServiceCust({ payload }, { call, put }) {
      const response = yield call(api.queryComplianceServiceCustReport, payload);
      yield put({
        type: 'getComplianceServiceCustSuccess',
        payload: response,
      });
    },
    // 获取服务渠道统计数据
    * getServiceChannel({ payload }, { call, put }) {
      const response = yield call(api.queryServiceChannelReport, payload);
      yield put({
        type: 'getServiceChannelSuccess',
        payload: response,
      });
    },
  },
};
