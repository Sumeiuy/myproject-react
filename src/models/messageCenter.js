/* eslint-disable import/no-anonymous-default-export */
/*
 * @Author: zhangjun
 * @Date: 2018-05-22 22:38:38
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-05-24 10:28:14
 */
import { messageCenter as api } from '../api';

export default {
  namespace: 'messageCenter',
  state: {
    // 消息通知提醒列表
    remindMessages: {},
  },

  reducers: {
    // 获取消息通知提醒列表
    getRemindMessageListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        remindMessages: resultData,
      };
    },
  },

  effects: {
    // 获取消息通知提醒列表
    * getRemindMessageList({ payload }, { call, put }) {
      const response = yield call(api.getRemindMessageList, payload);
      yield put({
        type: 'getRemindMessageListSuccess',
        payload: response,
      });
    },
  },
};
