/*
 * @Author: XuWenKang
 * @Description: 客户反馈modal
 * @Date: 2017-12-13 10:31:34
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-12-21 14:53:14
 */

import { customerFeedback as api } from '../api';

// const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'customerFeedback',
  state: {
    missionList: EMPTY_LIST, // 任务列表
    feedbackList: EMPTY_LIST, // 客户反馈列表
  },
  reducers: {
    getMissionListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        missionList: resultData,
      };
    },
    queryFeedbackListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        feedbackList: resultData,
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
    * queryFeedbackList({ payload }, { call, put }) {
      const response = yield call(api.queryFeedbackList, payload);
      yield put({
        type: 'queryFeedbackListSuccess',
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
  },
  subscriptions: {

  },
};
