/*
 * @Author: zhangjun
 * @Date: 2018-09-11 14:38:00
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-12 21:00:38
 * @description models/advisorSpace.js
 */

import { advisorSpace as api } from '../api';

export default {
  namespace: 'advisorSpace',
  state: {
    // 申请单列表
    applictionList: {},
    // 右侧详情
    detailInfo: {},
    // 智慧前厅列表
    smartFrontHallData: {},
    // 新建提交结果
    submitResult: {},
    // 参与人列表
    participantList: {},
    // 取消预订结果
    cancelReservationResult: {},
    // 已预订时间段列表
    orderPeriodList: [],
  },
  reducers: {
    // 获取申请单列表成功
    getApplictionListSuccess(state, action) {
      const { payload: { resultData = {} }} = action;
      return {
        ...state,
        applictionList: resultData,
      };
    },
    // 获取右侧详情成功
    getDetailInfoSuccess(state, action) {
      const { payload: { resultData = {} }} = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },
    // 获取智慧前厅列表成功
    getSmartFrontHallListSuccess(state, action) {
      const { payload: { resultData = {} }} = action;
      return {
        ...state,
        smartFrontHallData: resultData,
      };
    },
    // 新建提交成功
    submitApplySuccess(state, action) {
      const { payload: { resultData = {} }} = action;
      return {
        ...state,
        submitResult: resultData,
      };
    },
    // 获取参与人列表成功
    getParticipantListSuccess(state, action) {
      const { payload: { resultData = {} }} = action;
      return {
        ...state,
        participantList: resultData,
      };
    },
    // 取消预订成功
    cancelReservationSuccess(state, action) {
      const { payload: { resultData = {} }} = action;
      return {
        ...state,
        cancelReservationResult: resultData,
      };
    }
  },
  effects: {
    // 获取申请单
    * getApplictionList({ payload = {} }, { put, call }) {
      const response = yield call(api.getApplicationList, payload);
      yield put({
        type: 'getApplictionListSuccess',
        payload: response,
      });
    },
    // 获取右侧详情
    * getDetail({ payload = {} }, { put, call }) {
      const response = yield call(api.getApplicationDetail, payload);
      yield put({
        type: 'getDetailInfoSuccess',
        payload: response,
      });
    },
    // 获取智慧前厅列表
    * getSmartFrontHallList({ payload = {} }, { put, call }) {
      const response = yield call(api.getSmartFrontHallList, payload);
      yield put({
        type: 'getSmartFrontHallListSuccess',
        payload: response,
      });
    },
    // 新建提交
    * submitApply({ payload = {} }, { put, call }) {
      const response = yield call(api.saveApplictaion, payload);
      yield put({
        type: 'submitApplySuccess',
        payload: response,
      });
    },
    // 获取参与人列表
    * getParticipantList({ payload = {} }, { put, call }) {
      const response = yield call(api.getParticipantList, payload);
      yield put({
        type: 'getParticipantListSuccess',
        payload: response,
      });
    },
    // 取消预订
    * cancelReservation({ payload = {} }, { put, call }) {
      const response = yield call(api.cancelReservation, payload);
      yield put({
        type: 'cancelReservationSuccess',
        payload: response,
      });
    }
  },
  subscriptions: {
  },
}
