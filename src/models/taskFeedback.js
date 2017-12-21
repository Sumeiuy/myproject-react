/**
 * @file models/taskFeedback.js
 *  任务反馈 store
 * @author Wangjunjun
 */

import { taskFeedback as api } from '../api';

export default {
  namespace: 'taskFeedback',
  state: {
    questionInfoList: {
      list: [],
      page: {
        pageNum: 1,
        pageSize: 5,
        totalCount: 0,
        totalPage: 1,
      },
    },
  },
  reducers: {
    queryQuestionsSuccess(state, action) {
      console.log('action>>>', action);
    },
  },
  effects: {
    // 获取问题列表
    * queryQuestions({ payload }, { call, put }) {
      const res = yield call(api.queryQuestions, payload);
      if (res) {
        yield put({
          type: 'queryQuestionsSuccess',
          payload: res,
        });
      }
    },
  },
  subscriptions: {
  },
};
