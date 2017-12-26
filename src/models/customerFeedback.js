/*
 * @Author: XuWenKang
 * @Description: 客户反馈modal
 * @Date: 2017-12-13 10:31:34
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-12-26 09:18:46
 */

import { customerFeedback as api } from '../api';

const EMPTY_OBJECT = {};
// const EMPTY_LIST = [];

export default {
  namespace: 'customerFeedback',
  state: {
    missionData: EMPTY_OBJECT, // 任务列表
    feedbackData: EMPTY_OBJECT, // 客户反馈列表
  },
  reducers: {
    getMissionListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        missionData: resultData,
      };
    },
    getFeedbackListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        feedbackData: resultData,
      };
    },
    emptyMissionDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        missionData: payload,
      };
    },
  },
  effects: {
    // 查询任务列表
    * getMissionList({ payload }, { call, put }) {
      const response = yield call(api.getMissionList, payload);
      yield put({
        type: 'getMissionListSuccess',
        payload: response,
      });
    },
    // 删除任务下所关联客户反馈选项
    * delCustomerFeedback({ payload }, { call }) {
      yield call(api.delCustomerFeedback, payload);
    },
    // 添加任务下所关联客户反馈选项
    * addCustomerFeedback({ payload }, { call }) {
      yield call(api.addCustomerFeedback, payload);
    },
    // 查询客户反馈列表
    * getFeedbackList({ payload }, { call, put }) {
      const response = yield call(api.getFeedbackList, payload);
      yield put({
        type: 'getFeedbackListSuccess',
        payload: response,
      });
    },
    // 删除客户反馈
    * delFeedback({ payload }, { call }) {
      yield call(api.delFeedback, payload);
    },
    // 增加客户反馈
    * addFeedback({ payload }, { call }) {
      yield call(api.addFeedback, payload);
    },
    // 清空任务列表数据
    * emptyMissionData({ payload }, { put }) {
      yield put({
        type: 'emptyMissionDataSuccess',
        payload: EMPTY_OBJECT,
      });
    },
  },
  subscriptions: {
  },
};
