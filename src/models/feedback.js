/* eslint-disable import/no-anonymous-default-export */
/**
 * @file models/feedback.js
 * @author yangquanjian
 */

import _ from 'lodash';
import { feedback as api } from '../api';
import feedbackHelper from '../helper/page/feedback';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'feedback',
  state: {
    problem: {
      popVisible: false,
    },
    personFeedback: EMPTY_OBJECT,
    list: EMPTY_OBJECT,
    fbDetail: EMPTY_OBJECT,
    recordList: EMPTY_OBJECT,
    processList: EMPTY_LIST,
    empRespDTOList: EMPTY_OBJECT,
  },
  reducers: {
    changeProblemVisible(state, action) {
      const { payload: { count } } = action;
      return {
        ...state,
        problem: count,
      };
    },
    getFeedbackListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { page = EMPTY_OBJECT, feedbackVOList = EMPTY_LIST } = resultData;
      const { listData: preListData = EMPTY_LIST } = state.list;

      return {
        ...state,
        list: {
          page,
          resultData: page.curPageNum === 1 ? feedbackVOList : [...preListData, ...feedbackVOList],
        },
      };
    },
    getPersonFeedbackListSuccess(state, action) {
      const { payload: { resultData } } = action;
      const { page = EMPTY_OBJECT, feedbackVOList = EMPTY_LIST } = resultData || EMPTY_OBJECT;

      return {
        ...state,
        personFeedback: {
          page,
          list: feedbackVOList,
        },
      };
    },
    getFeedbackDetailSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        fbDetail: {
          resultData,
        },
      };
    },
    getFeedbackRecordListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        recordList: {
          resultData,
        },
      };
    },
    getAnserOfQustionListSuccess(state, action) {
      const { payload: { processList = EMPTY_LIST } } = action;
      return {
        ...state,
          processList,
      };
    },
    getEmpListByRespSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        empRespDTOList:{
        resultData,
        }
      };
    }
  },
  effects: {
    * getFeedbackList({ payload }, { call, put }) {
      const { page } = payload;
      if (!_.isEmpty(page)) {
        const response = yield call(api.getFeedbackList, payload);
        yield put({
          type: 'getFeedbackListSuccess',
          payload: response,
        });
      }
    },
    * getPersonFeedbackList({ payload }, { call, put }) {
      const { page } = payload;
      if (!_.isEmpty(page)) {
        const response = yield call(api.getPersonFeedbackList, payload);
        yield put({
          type: 'getPersonFeedbackListSuccess',
          payload: response,
        });
      }
    },
    * getFeedbackDetail({ payload }, { call, put }) {
      const response = yield call(api.getFeedbackDetail, payload);
      yield put({
        type: 'getFeedbackDetailSuccess',
        payload: response,
      });
    },
    * getFeedbackRecordList({ payload }, { call, put }) {
      const response = yield call(api.getFeedbackRecordList, payload);
      yield put({
        type: 'getFeedbackRecordListSuccess',
        payload: response,
      });
    },
    * getAnserOfQustionList({ payload }, { call, put }) {
      const response = yield call(api.getAnserOfQustionList, payload);
      yield put({
        type: 'getAnserOfQustionListSuccess',
        payload: response.resultData || EMPTY_OBJECT,
      });
    },
    * updateFeedback({ payload }, { call, put }) {
      const {
        flag = '',
        request,
        currentQuery,
        currentQuery: {
          pageSize,
          curPageNum,
          curPageSize,
        },
      } = payload;

      const response = yield call(api.updateFeedback, request);
      const { code } = response || {};
      if (code !== '0') {
        return;
      }

      // 我的反馈
      if (flag === 'person') {
        // 记录列表请求
        yield put({
          type: 'getAnserOfQustionList',
          payload: {
            feedbackId: request.id,
          },
        });
        // 刷新反馈列表
        yield put({
          type: 'getPersonFeedbackList',
          payload: {
            userId: request.processerEmpId,
            page: {
              curPageNum,
              pageSize: pageSize || '20',
            },
          },
        });
      } else { // 反馈管理
        // 记录列表请求
        yield put({
          type: 'getFeedbackRecordList',
          payload: {
            feedbackId: request.id,
          },
        });
        // 刷新反馈列表
        yield put({
          type: 'getFeedbackList',
          payload: feedbackHelper.constructPostBody(currentQuery, curPageNum, curPageSize),
        });
      }
      yield put({
        type: 'getFeedbackDetail',
        payload: {
          id: request.id,
        },
      });
    },
    * addFeedbackEvaluation({ payload }, { call, put }) {
      const response = yield call(api.addFeedbackEvaluation, payload);
    },
    * getEmpListByResp({ payload }, { call, put }) {
      const response = yield call(api.getEmpListByResp, payload);
      yield put({
        type: 'getEmpListByRespSuccess',
        payload: response,
      });
    }
  },
  subscriptions: {},
};
