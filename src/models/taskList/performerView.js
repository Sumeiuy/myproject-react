/**
 * @Description: 执行者视图 model
 * @file models/taskList/performerView.js
 * @author hongguangqing
 */

import { performerView as api } from '../../api';

const EMPTY_OBJ = {};
const EMPTY_LIST = [];

const PAGE_SIZE = 8;
const PAGE_NO = 1;

export default {
  namespace: 'performerView',
  state: {
    // 任务详情中基本信息
    taskDetailBasicInfo: EMPTY_OBJ,
    // 任务详情中目标客户列表信息
    targetCustList: {
      list: EMPTY_LIST,
      page: {
        pageNo: PAGE_NO,
        pageSize: PAGE_SIZE,
        totalCount: 0,
      },
    },
  },
  reducers: {
    getTaskDetailBasicInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        taskDetailBasicInfo: payload,
      };
    },
    queryTargetCustSuccess(state, action) {
      const { page, list } = action.payload;
      return {
        ...state,
        targetCustList: {
          list,
          page,
        },
      };
    },
  },
  effects: {
    // 执行者视图的详情基本信息
    * getTaskDetailBasicInfo({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryTaskDetailBasicInfo, payload);
      if (resultData) {
        yield put({
          type: 'getTaskDetailBasicInfoSuccess',
          payload: resultData,
        });
      }
    },
    // 执行者视图的详情目标客户
    * queryTargetCust({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryTargetCust, payload);
      if (resultData) {
        yield put({
          type: 'queryTargetCustSuccess',
          payload: resultData,
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/taskList/performerView') {
          const {
            currentId = '',
            orgId = '',
            pageSize = PAGE_SIZE,
            pageNo = PAGE_NO,
          } = query;
          dispatch({ type: 'getTaskDetailBasicInfo', payload: { missionId: currentId } });
          dispatch({
            type: 'queryTargetCust',
            payload: {
              missionId: currentId,
              orgId,
              pageSize,
              pageNo,
            },
          });
        }
      });
    },
  },
};
