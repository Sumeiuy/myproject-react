/*
 * @Author: XuWenKang
 * @Description: 精选组合modal
 * @Date: 2018-04-17 10:08:03
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-27 10:02:21
*/

import _ from 'lodash';
import { choicenessCombination as api } from '../api';
import { chartTabList } from '../routes/choicenessCombination/config';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'choicenessCombination',
  state: {
    adjustWarehouseHistoryData: EMPTY_OBJECT, // 调仓历史数据
    combinationAdjustHistoryData: EMPTY_OBJECT, // 组合调仓数据
    weeklySecurityTopTenData: EMPTY_LIST, // 近一周表现前十的证券
    combinationTreeList: EMPTY_LIST, // 组合树
    combinationRankList: EMPTY_LIST, // 组合排名列表
    combinationLineChartData: EMPTY_OBJECT, // 组合折线趋势图
    rankTabActiveKey: '', // 组合排名tab
    yieldRankValue: '', // 收益率排序value
    riskLevel: EMPTY_LIST, // 所筛选的风险等级
  },
  reducers: {
    // 风险等级筛选
    riskLevelFilter(state, action) {
      const { payload: { value = EMPTY_LIST } } = action;
      // todo 组合排名数据排序
      return {
        ...state,
        riskLevel: value,
      };
    },
    // 收益率排序切换
    yieldRankChange(state, action) {
      const { payload: { value } } = action;
      // todo 组合排名数据排序
      return {
        ...state,
        yieldRankValue: value,
      };
    },
    // 切换组合排名tab
    combinationRankTabchange(state, action) {
      const { payload: { key } } = action;
      return {
        ...state,
        rankTabActiveKey: key,
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
    // 获取组合调仓数据
    getCombinationAdjustHistorySuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        adjustWarehouseHistoryData: resultData,
      };
    },
    // 获取近一周表现前十的证券
    getWeeklySecurityTopTenSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        weeklySecurityTopTenData: resultData,
      };
    },
    // 获取组合树
    getCombinationTreeSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        rankTabActiveKey: resultData[0].key,
        combinationTreeList: resultData,
      };
    },
    // 获取组合排名列表
    getCombinationRankListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        combinationRankList: resultData,
      };
    },
    // 获取对应组合趋势图数据
    getCombinationLineChartSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { combinationLineChartData } = state;
      const newCombinationLineChartData = {};
      newCombinationLineChartData[resultData.combinationCode] = {
        ...resultData,
        // 如果是资产配置类默认显示近一年，否则显示近三个月
        defaultActiveKey: true ? chartTabList[1].key : chartTabList[0].key,
      };
      return {
        ...state,
        combinationLineChartData: {
          ...combinationLineChartData,
          ...newCombinationLineChartData,
        },
      };
    },
  },
  effects: {
    // 获取调仓历史数据
    * getAdjustWarehouseHistory({ payload }, { call, put }) {
      const response = yield call(api.getAdjustWarehouseHistory, payload);
      yield put({
        type: 'getAdjustWarehouseHistorySuccess',
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
    // 获取组合排名列表
    * getCombinationRankList({ payload }, { call, put, take }) {
      const response = yield call(api.getCombinationRankList, payload);
      const list = response.resultData;
      let index = 1;

      yield put({
        type: 'getCombinationRankListSuccess',
        payload: response,
      });
      // 拿到组合排名的列表数据之后，按顺序同步调图表数据接口
      if (!_.isEmpty(list)) {
        // 先手动调第一个图表数据，用于触发 yield take('getCombinationLineChartSuccess')这个条件
        yield put({
          type: 'getCombinationLineChart',
          payload: {
            combinationCode: response.resultData[0].combinationCode,
          },
        });
        while (index < list.length && (yield take('getCombinationLineChartSuccess'))) {
          yield put({
            type: 'getCombinationLineChart',
            payload: {
              combinationCode: response.resultData[index].combinationCode,
            },
          });
          index++;
        }
      }
    },
    // 根据组合id获取对应趋势图数据
    * getCombinationLineChart({ payload }, { call, put }) {
      const response = yield call(api.getCombinationChart, payload);
      yield put({
        type: 'getCombinationLineChartSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {

  },
};
