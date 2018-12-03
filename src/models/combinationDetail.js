/* eslint-disable import/no-anonymous-default-export */
/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情modal
 * @Date: 2018-04-17 10:08:03
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-12 16:04:39
*/

import _ from 'lodash';
import moment from 'moment';
import { choicenessCombination as api } from '../api';
import { chartTabList } from '../components/choicenessCombination/config';


const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

// 根据key值转换为日期
function calcDate(value) {
  // 开始日期
  let startDate = '';
  // 结束日期
  let endDate = '';
  // 结束日期对象
  const endMoment = moment();
  // 开始日期对象
  if (value !== chartTabList[2].key) {
    const startMoment = moment(endMoment).subtract(value, 'month');
    // 开始日期格式化
    startDate = startMoment.format('YYYYMMDD');
    // 结束日期格式化
    endDate = endMoment.format('YYYYMMDD');
  }
  return {
    startDate,
    endDate,
  };
}

export default {
  namespace: 'combinationDetail',
  state: {
    overview: EMPTY_OBJECT, // 组合概览
    compositionPie: EMPTY_LIST, // 组合构成-饼图
    compositionTable: EMPTY_LIST, // 组合构成-表格
    adjustWarehouseHistoryData: EMPTY_OBJECT, // 调仓历史数据
    tableHistoryList: EMPTY_OBJECT, // 弹窗调仓历史表格数据
    combinationAdjustHistoryData: EMPTY_OBJECT, // 组合调仓数据
    combinationTreeList: EMPTY_LIST, // 组合树
    combinationLineChartData: EMPTY_OBJECT, // 组合折线趋势图
    orderCustData: EMPTY_OBJECT, // 订购客户数据
    reportHistoryData: EMPTY_OBJECT, // 组合详情-历史报告模块数据
    modalReportHistoryData: EMPTY_OBJECT, // 组合详情-历史报告弹窗数据
    custRepeatData: EMPTY_OBJECT, // 客户持仓重合数据
  },
  reducers: {
    // 组合详情-概览
    getOverviewSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        overview: resultData,
      };
    },
    // 组合构成-饼图
    getCompositionPieSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        compositionPie: resultData,
      };
    },
    // 组合构成-表格
    querySecurityListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        compositionTable: resultData,
      };
    },
    // 获取调仓历史数据
    getAdjustWarehouseHistorySuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        adjustWarehouseHistoryData: resultData,
      };
    },
    getTableHistorySuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        tableHistoryList: resultData,
      };
    },
    // 获取组合树
    getCombinationTreeSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        rankTabActiveKey: ((resultData[0] || EMPTY_OBJECT).children[0] || EMPTY_OBJECT).key,
        combinationTreeList: resultData,
      };
    },
    // 获取对应组合趋势图数据
    getCombinationLineChartSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        combinationLineChartData: resultData,
      };
    },
    // 订购客户数据
    getOrderingCustListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        orderCustData: resultData,
      };
    },
    // 组合详情-历史报告模块数据
    getReportHistoryListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        reportHistoryData: resultData,
      };
    },
    // 组合详情-弹窗历史报告模块数据
    getModalReportHistoryListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        modalReportHistoryData: resultData,
      };
    },
    // 持仓客户重复数据
    queryHoldRepeatProportionSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        custRepeatData: resultData,
      };
    },
  },
  effects: {
    // 组合详情-概览数据
    * getOverview({ payload }, { call, put }) {
      const response = yield call(api.getOverview, payload);
      yield put({
        type: 'getOverviewSuccess',
        payload: response,
      });
    },
    // 组合构成-饼图
    * getCompositionPie({ payload }, { call, put }) {
      const response = yield call(api.getCompositionPie, payload);
      yield put({
        type: 'getCompositionPieSuccess',
        payload: response,
      });
    },
    // 组合构成-表格
    * querySecurityList({ payload }, { call, put }) {
      const response = yield call(api.getCombinationSecurityList, payload);
      yield put({
        type: 'querySecurityListSuccess',
        payload: response,
      });
    },
    // 获取调仓历史数据
    * getAdjustWarehouseHistory({ payload }, { call, put }) {
      const response = yield call(api.getAdjustWarehouseHistory, payload);
      // 如果pageSize为5，走页面调仓历史，否则走弹窗的 table 历史调仓
      const type = payload.pageSize === 5 ? 'getAdjustWarehouseHistorySuccess' : 'getTableHistorySuccess';
      yield put({
        type,
        payload: response,
      });
    },
    // 获取组合树
    * getCombinationTree({ payload }, { call, put }) {
      const response = yield call(api.getCombinationTree, payload);
      yield put({
        type: 'getCombinationTreeSuccess',
        payload: response,
      });
    },
    // 根据组合id获取对应趋势图数据
    * getCombinationLineChart({ payload }, { call, put }) {
      const newPayload = {
        combinationCode: payload.combinationCode,
        ...calcDate(payload.key),
      };
      const response = yield call(api.getCombinationChart, newPayload);
      if (!_.isEmpty(response) && !_.isEmpty(response.resultData)) {
        yield put({
          type: 'getCombinationLineChartSuccess',
          payload: response,
        });
      }
    },
    // 查询订购客户
    * getOrderingCustList({ payload }, { call, put }) {
      const response = yield call(api.getOrderingCustList, payload);
      yield put({
        type: 'getOrderingCustListSuccess',
        payload: response,
      });
    },
    // 查询历史报告
    * getReportHistoryList({ payload }, { call, put }) {
      const response = yield call(api.getReportHistoryList, payload);
      // 如果pageSize为6走组合详情-历史报告模块数据，否则走历史报告弹窗
      const type = payload.pageSize === 6
        ? 'getReportHistoryListSuccess' : 'getModalReportHistoryListSuccess';
      yield put({
        type,
        payload: response,
      });
    },
    // 查询持仓客户重合数据
    * queryHoldRepeatProportion({ payload }, { call, put }) {
      const response = yield call(api.queryHoldRepeatProportion, payload);
      yield put({
        type: 'queryHoldRepeatProportionSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {

  },
};
