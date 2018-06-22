/*
 * @Author: XuWenKang
 * @Description: 最新观点modal
 * @Date: 2018-04-17 10:08:03
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-22 15:19:55
*/

// import _ from 'lodash';
import { latestView as api } from '../api';
import config from '../components/latestView/config';


const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'latestView',
  state: {
    // 首页每日首席观点
    dayViewpointData: EMPTY_OBJECT,
    // 首页每周首席观点
    monthViewpointData: EMPTY_OBJECT,
    // 首席观点列表数据
    viewpointData: EMPTY_OBJECT,
    // 首席观点详情
    viewpointDetail: EMPTY_OBJECT,
    // 首页紫金时钟当前周期数据
    ziJinCycleData: EMPTY_OBJECT,
    // 首页紫金时钟列表
    ziJinClockList: EMPTY_LIST,
  },
  reducers: {
    // 获取首页-每日首席观点
    queryDayViewpointSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        dayViewpointData: resultData,
      };
    },
    // 获取首页-每周首席观点
    queryMonthViewpointSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        monthViewpointData: resultData,
      };
    },
    // 获取首席观点列表数据
    queryChiefViewpointListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        viewpointData: resultData,
      };
    },
    // 获取首席观点详情
    queryChiefViewpointDetailSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { id } = resultData;
      const { viewpointDetail } = state;
      return {
        ...state,
        viewpointDetail: {
          ...viewpointDetail,
          [id]: resultData,
        },
      };
    },
    // 获取首页紫金时钟当前周期数据
    queryZiJinClockCycleSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        ziJinCycleData: resultData,
      };
    },
    // 获取首页紫金时钟列表数据
    queryZiJinViewpointListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        ziJinClockList: resultData,
      };
    },
  },
  effects: {
    // 根据类型获取首页-首席观点模块数据
    * queryChiefViewpoint({ payload }, { call, put }) {
      const { type } = payload;
      const response = yield call(api.queryChiefViewpoint, payload);
      switch (type) {
        case config.chiefViewpointType[1].value:
          yield put({
            type: 'queryDayViewpointSuccess',
            payload: response,
          });
          break;
        default:
          yield put({
            type: 'queryMonthViewpointSuccess',
            payload: response,
          });
          break;
      }
    },
    // 获取首席观点列表数据
    * queryChiefViewpointList({ payload }, { call, put }) {
      const response = yield call(api.queryChiefViewpointList, payload);
      yield put({
        type: 'queryChiefViewpointListSuccess',
        payload: response,
      });
    },
    // 获取首席观点详情数据
    * queryChiefViewpointDetail({ payload }, { call, put }) {
      const response = yield call(api.queryChiefViewpointDetail, payload);
      yield put({
        type: 'queryChiefViewpointDetailSuccess',
        payload: response,
      });
    },
    // 获取首页紫金时钟当前周期数据
    * queryZiJinClockCycle({ payload }, { call, put }) {
      const response = yield call(api.queryZiJinClockCycle, payload);
      yield put({
        type: 'queryZiJinClockCycleSuccess',
        payload: response,
      });
    },
    // 获取首页紫金时钟列表数据
    * queryZiJinViewpointList({ payload }, { call, put }) {
      const response = yield call(api.queryZiJinViewpointList, payload);
      yield put({
        type: 'queryZiJinViewpointListSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {

  },
};
