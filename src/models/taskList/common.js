/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:32:47
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-04 14:58:16
 * 执行者视图、创建者视图和管理者视图公用的部分model层
 */


import { commonView as api } from '../../api';

const EMPTY_OBJ = {};
const EMPTY_LIST = [];

export default {
  namespace: 'commonView',
  state: {
    // 执行者视图、管理者视图、创建者视图公共列表
    taskList: EMPTY_OBJ,
  },
  reducers: {
    getTaskListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJ } } = action;
      const { page = EMPTY_OBJ, viewBaseInfoList = EMPTY_LIST } = resultData || EMPTY_OBJ;
      return {
        ...state,
        taskList: {
          page,
          resultData: viewBaseInfoList,
        },
      };
    },
  },
  effects: {
    // 执行者视图、管理者视图、创建者视图公共列表
    * getTaskList({ payload }, { call, put }) {
      const listResponse = yield call(api.queryTaskList, payload);
      yield put({
        type: 'getTaskListSuccess',
        payload: listResponse,
      });
    },
  },
  subscriptions: {
  },
};
