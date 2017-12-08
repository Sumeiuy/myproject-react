/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:30:34
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-07 17:03:53
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
    // 任务详细信息
    mngrMissionDetailInfo: EMPTY_OBJ,
    // 客户反馈一二级数据
    custFeedback: EMPTY_LIST,
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
    queryMngrMissionDetailInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        mngrMissionDetailInfo: payload,
      };
    },
    countFlowFeedBackSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        custFeedback: payload,
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
      // return yield select(state => state.custDetailResult);
    },
    // 查询任务详细信息
    * queryMngrMissionDetailInfo({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryMngrMissionDetailInfo, payload);
      yield put({
        type: 'queryMngrMissionDetailInfoSuccess',
        payload: resultData,
      });
    },
    * countFlowFeedBack({ payload }, { call, put }) {
      const { resultData } = yield call(api.countFlowFeedBack, payload);
      yield put({
        type: 'countFlowFeedBackSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
  },
};
