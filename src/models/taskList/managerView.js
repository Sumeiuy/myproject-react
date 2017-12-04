/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:30:34
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-04 15:09:16
 * 管理者视图model层
 */

import { managerView as api } from '../../api';

const EMPTY_OBJ = {};
// const EMPTY_LIST = [];

export default {
  namespace: 'managerView',
  state: {
    // 任务详情中基本信息
    taskDetailBasicInfo: EMPTY_OBJ,
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
      // 清除查询上次目标客户列表的条件
      yield put({ type: 'clearParameter' });
      const { resultData } = yield call(api.queryTaskDetailBasicInfo, payload);
      if (resultData) {
        yield put({
          type: 'getTaskDetailBasicInfoSuccess',
          payload: resultData,
        });
      }
    },
  },
  subscriptions: {
  },
};
