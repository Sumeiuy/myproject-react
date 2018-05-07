/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情modal
 * @Date: 2018-04-17 10:08:03
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-07 15:52:51
*/

import _ from 'lodash';
import moment from 'moment';
import { choicenessCombination as api } from '../api';
import { chartTabList } from '../routes/choicenessCombination/config';

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
    adjustWarehouseHistoryData: EMPTY_OBJECT, // 调仓历史数据
    tableHistoryList: EMPTY_OBJECT,  // 弹窗调仓历史表格数据
    combinationAdjustHistoryData: EMPTY_OBJECT, // 组合调仓数据
    // weeklySecurityTopTenData: EMPTY_LIST, // 近一周表现前十的证券
    combinationTreeList: EMPTY_LIST, // 组合树
    // combinationRankList: EMPTY_LIST, // 组合排名列表
    combinationLineChartData: EMPTY_OBJECT, // 组合折线趋势图
    // rankTabActiveKey: '', // 组合排名tab
    // yieldRankValue: yieldRankList[0].value, // 收益率排序value  默认显示近7天的
    // riskLevel: riskDefaultItem.value, // 所筛选的风险等级
  },
  reducers: {
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
  },
  effects: {
    // 获取调仓历史数据
    * getAdjustWarehouseHistory({ payload }, { call, put }) {
      const response = yield call(api.getAdjustWarehouseHistory, payload);
      // 如果调仓方向为 3，走首页历史调仓，否则走弹窗的 table 历史调仓
      const type = payload.directionCode === '3' ? 'getAdjustWarehouseHistorySuccess' : 'getTableHistorySuccess';
      yield put({
        type,
        payload: response,
      });
    },
    // 获取组合构成证券列表/近一周表现前十的证券
    * getCombinationSecurityList({ payload }, { call, put }) {
      const response = yield call(api.getCombinationSecurityList, payload);
      yield put({
        type: 'getWeeklySecurityTopTenSuccess',
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
  },
  subscriptions: {

  },
};
