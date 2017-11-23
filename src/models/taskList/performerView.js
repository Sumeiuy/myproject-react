/**
 * @Description: 执行者视图 model
 * @file models/taskList/performerView.js
 * @author hongguangqing
 */

import { performerView as api } from '../../api';

export default {
  namespace: 'performerView',
  state: {
    // 任务详情中基本信息
    taskDetailBasicInfo: {},
  },
  reducers: {
    getTaskDetailBasicInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        taskDetailBasicInfo: payload,
      };
    },
  },
  effects: {
    // 执行者视图的详情基本信息
    * getTaskDetailBasicInfo({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryTaskDetailBasicInfo, payload);
      yield put({
        type: 'getTaskDetailBasicInfoSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/taskList/performerView') {
          // 进入页面根据url中的id来获取
          const { currentId } = query;
          dispatch({ type: 'getTaskDetailBasicInfo', payload: { missionId: currentId } });
        }
      });
    },
  },
};
