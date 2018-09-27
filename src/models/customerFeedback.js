/* eslint-disable import/no-anonymous-default-export */
/*
 * @Author: XuWenKang
 * @Description: 客户反馈modal
 * @Date: 2017-12-13 10:31:34
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-29 10:55:27
 */

import { customerFeedback as api } from '../api';

const EMPTY_OBJECT = {};

export default {
  namespace: 'customerFeedback',
  state: {
    // 任务列表
    missionData: EMPTY_OBJECT,
    // 客户反馈列表
    feedbackData: EMPTY_OBJECT,
    // 客户反馈维护修改后，需要提示用户有多少条涨乐可选项超过4个
    taskNum: 0,
    // 查询任务绑定客户反馈列表时，返回的MOT任务和自建任务是否有客户可选项超过4个的任务
    hasOver4OptionsTask: {},
  },
  reducers: {
    getMissionListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        missionData: resultData,
      };
    },

    queryOverFourSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        hasOver4OptionsTask: resultData,
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
    modifyFeedbackSuccess(state, action) {
      const { payload: { num = 0 } } = action;
      return {
        ...state,
        taskNum: num,
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
      const over4Response = yield call(api.hasOverFour, {});
      yield put({
        type: 'queryOverFourSuccess',
        payload: over4Response,
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
    // 编辑客户反馈
    * modifyFeedback({ payload }, { call, put }) {
      // 先将taskNum置为零
      yield put({
        type: 'modifyFeedbackSuccess',
        payload: { num: 0 },
      });
      const { resultData } = yield call(api.modifyFeedback, payload);
      yield put({
        type: 'modifyFeedbackSuccess',
        payload: resultData,
      });
    },
    // 清空任务列表数据
    * emptyMissionData({ payload }, { put }) {
      yield put({
        type: 'emptyMissionDataSuccess',
        payload: EMPTY_OBJECT,
      });
    },
  },
};
