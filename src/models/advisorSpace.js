/*
 * @Author: zhangjun
 * @Date: 2018-09-11 14:38:00
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-09-27 15:00:26
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
    roomData: {},
    // 新建时智慧前厅列表
    createRoomData: {},
    // 新建提交结果
    submitResult: {},
    // 参与人列表
    participantData: {},
    // 取消预订结果
    cancelReservationResult: false,
    // 已预订时间段列表
    orderPeriodList: [],
  },
  reducers: {
    // 获取申请单列表成功
    getApplictionListSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        applictionList: resultData,
      };
    },
    // 获取右侧详情成功
    getDetailInfoSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },
    // 获取智慧前厅列表成功
    getRoomListSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        roomData: resultData,
      };
    },
    // 新建时获取智慧前厅列表成功
    getCreateRoomListSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        createRoomData: resultData,
      };
    },
    // 新建提交成功
    submitApplySuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        submitResult: resultData,
      };
    },
    // 获取参与人列表成功
    getParticipantListSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        participantData: resultData,
      };
    },
    // 取消预订成功
    cancelReservationSuccess(state, action) {
      const { payload: { resultData = '' } } = action;
      return {
        ...state,
        cancelReservationResult: resultData,
      };
    },
    clearReduxDataSuccess(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        ...payload,
      };
    },
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
    * getRoomList({ payload = {} }, { put, call }) {
      const response = yield call(api.getRoomList, payload);
      const { action } = payload;
      if (action === 'CREATE') {
        yield put({
          type: 'getCreateRoomListSuccess',
          payload: response,
        });
      } else {
        yield put({
          type: 'getRoomListSuccess',
          payload: response,
        });
      }
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
    },
    // 清空数据
    * clearReduxData({ payload }, { put }) {
      yield put({
        type: 'clearReduxDataSuccess',
        payload,
      });
    },
  },
  subscriptions: {
  },
};
