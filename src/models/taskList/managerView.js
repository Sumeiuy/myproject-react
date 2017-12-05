/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:30:34
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-05 09:09:11
 * 管理者视图model层
 */

import { performerView as api } from '../../api';

const EMPTY_OBJ = {};
const EMPTY_LIST = [];

export default {
  namespace: 'managerView',
  state: {
    // 任务详情中基本信息
    taskDetailBasicInfo: EMPTY_OBJ,
    // 预览客户明细结果
    custDetailResult: EMPTY_LIST,
  },
  reducers: {
    getTaskDetailBasicInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        taskDetailBasicInfo: payload,
      };
    },
    previewCustDetailSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        custDetailResult: payload,
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
    // 预览客户细分结果
    * previewCustDetail({ payload }, { call, put }) {
      const { resultData } = yield call(api.previewCustDetail, payload);
      yield put({
        type: 'previewCustDetailSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
  },
};
