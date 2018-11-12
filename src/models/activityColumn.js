/*
 * @Author: zhangjun
 * @Descripter: 平台参数设置-首页内容-活动栏目
 * @Date: 2018-11-05 17:20:04
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-08 10:43:53
 */

import { activityColumn as api } from '../api';

export default {
  namespace: 'activityColumn',
  state: {
    // 提交活动栏目
    submitResult: false,
  },
  reducers: {
    // 提交活动栏目成功
    submitContentSuccess(state, action) {
      const { payload: { resultData = {} }} = action;
      return {
        ...state,
        submitResult: resultData,
      };
    },
  },
  effects: {
    // 提交活动栏目
    * submitContent({ payload = {} }, { put, call }) {
      const response = yield call(api.submitContent, payload);
      yield put({
        type: 'submitContentSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {
  },
};
