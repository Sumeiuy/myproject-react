/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:30:34
 * @Last Modified by: zhushengnan
 * @Last Modified time: 2018-01-18 15:49:48
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
    custDetailResult: EMPTY_OBJ,
    // 任务详细信息
    mngrMissionDetailInfo: EMPTY_OBJ,
    // 客户反馈一二级数据
    custFeedback: EMPTY_LIST,
    // 任务实施进度数据
    missionImplementationDetail: EMPTY_OBJ,
    exportExcel: {},
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
    countFlowStatusSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        missionImplementationDetail: payload,
      };
    },
    exportCustListExcelSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        exportExcel: payload,
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
    * countFlowStatus({ payload }, { call, put }) {
      const { resultData } = yield call(api.countFlowStatus, payload);
      yield put({
        type: 'countFlowStatusSuccess',
        payload: resultData,
      });
    },
    * exportCustListExcel({ payload }, { call, put }) {
      const { resultData } = yield call(api.countFlowStatus, payload);
      yield put({
        type: 'exportCustListExcelSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
  },
};
