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
        pageSize: 10,
        totalCount: 0,
        totalPage: 1,
      },
    },
    deleteSuccess: false,
  },
  reducers: {
    queryQuestionsSuccess(state, action) {
      const { payload: { pageNum, pageSize, totalCount, totalPage, quesInfoList } } = action;
      return {
        ...state,
        questionInfoList: {
          list: quesInfoList,
          page: {
            pageNum,
            pageSize,
            totalCount,
            totalPage,
          },
        },
      };
    },
    deleteQuestionsSuccess(state, action) {
      return {
        ...state,
        deleteSuccess: action.payload === 'success',
      };
    },
  },
  effects: {
    // 获取问题列表
    * queryQuestions({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryQuestions, payload);
      if (resultData) {
        yield put({
          type: 'queryQuestionsSuccess',
          payload: resultData,
        });
      }
    },
    // 删除单个问题
    * deleteQuestion({ payload }, { call, put }) {
      const { resultData } = yield call(api.deleteQuestion, payload);
      yield put({
        type: 'deleteQuestionsSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
  },
};
