/*
 * @Author: XuWenKang
 * @Description: 精选组合modal
 * @Date: 2018-04-17 10:08:03
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-02 13:30:11
*/

import _ from 'lodash';
import moment from 'moment';
import { choicenessCombination as api } from '../api';
import { yieldRankList, riskDefaultItem, chartTabList } from '../routes/choicenessCombination/config';

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

// 根据传入条件对组合排名数据进行排序筛选
function combinationRankListSortAndFilter(list, condition) {
  const { yieldRankValue, riskLevel } = condition;
  // 先把对应的收益率列表里面的item找出来
  const yieldItem = _.filter(yieldRankList, item => item.value === yieldRankValue)[0]
    || EMPTY_OBJECT;
  // 然后找出对应的收益率的key，进行排序
  const sortList = _.reverse(_.sortBy(list, item => item[yieldItem.showNameKey]));
  return sortList.map((item) => {
    // 匹配对应风险等级的数据
    let show = _.findIndex(riskLevel,
      conditionItem => (item.riskLevel === conditionItem)) > -1;
    // 如果是排序条件是近7天收益率并且当前项是资产配置类组合
    if (yieldRankValue === yieldRankList[0].value && _.isNull(item.weekEarnings)) {
      show = false;
    } else if ((_.findIndex(riskLevel,
      conditionItem => (conditionItem === riskDefaultItem.value)) > -1)
      || _.isEmpty(riskLevel)) {
        // 如果筛选项中有“全部”的字段
      show = true;
    }
    return {
      ...item,
      show,
    };
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms, true));
}

export default {
  namespace: 'choicenessCombination',
  state: {
    adjustWarehouseHistoryData: EMPTY_OBJECT, // 调仓历史数据
    tableHistoryList: EMPTY_OBJECT,  // 弹窗调仓历史表格数据
    combinationAdjustHistoryData: EMPTY_OBJECT, // 组合调仓数据
    weeklySecurityTopTenData: EMPTY_LIST, // 近一周表现前十的证券
    combinationTreeList: EMPTY_LIST, // 组合树
    combinationRankList: EMPTY_LIST, // 组合排名列表
    combinationLineChartData: EMPTY_OBJECT, // 组合折线趋势图
    rankTabActiveKey: '', // 组合排名tab
    yieldRankValue: yieldRankList[0].value, // 收益率排序value  默认显示近7天的
    riskLevel: EMPTY_LIST, // 所筛选的风险等级
  },
  reducers: {
    // 风险等级筛选
    riskLevelFilter(state, action) {
      const { payload: { value = EMPTY_LIST } } = action;
      // 更新风险等级状态，组合排名数据筛选
      return {
        ...state,
        riskLevel: value,
        combinationRankList: combinationRankListSortAndFilter(state.combinationRankList, {
          yieldRankValue: state.yieldRankValue,
          riskLevel: value,
        }),
      };
    },
    // 收益率排序切换
    yieldRankChange(state, action) {
      const { payload: { value } } = action;
      // todo 组合排名数据排序
      return {
        ...state,
        yieldRankValue: value,
        combinationRankList: combinationRankListSortAndFilter(state.combinationRankList, {
          yieldRankValue: value,
          riskLevel: state.riskLevel,
        }),
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
    getTableHistorySuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        tableHistoryList: resultData,
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
        rankTabActiveKey: ((resultData[0] || EMPTY_OBJECT).children[0] || EMPTY_OBJECT).key,
        combinationTreeList: resultData,
      };
    },
    // 获取组合排名列表
    getCombinationRankListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      // 取到组合排名数据之后先进行筛选，排序
      const combinationRankList = combinationRankListSortAndFilter(resultData, {
        yieldRankValue: state.yieldRankValue,
        riskLevel: state.riskLevel,
      });
      return {
        ...state,
        combinationRankList,
      };
    },
    // 获取对应组合趋势图数据
    getCombinationLineChartSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { combinationLineChartData } = state;
      const newCombinationLineChartData = {};
      newCombinationLineChartData[resultData.combinationCode] = {
        ...resultData,
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
    // 获取组合排名列表
    * getCombinationRankList({ payload }, { call, put, take }) {
      const response = yield call(api.getCombinationRankList, payload);
      const list = response.resultData;
      let index = 0;

      yield put({
        type: 'getCombinationRankListSuccess',
        payload: response,
      });
      // 拿到组合排名的列表数据之后，按顺序同步调图表数据接口
      if (!_.isEmpty(list)) {
        do {
          const isAsset = _.isNull(list[index].weekEarnings);
          yield put({
            type: 'getCombinationLineChart',
            payload: {
              combinationCode: list[index].combinationCode,
              key: isAsset ? chartTabList[1].key : chartTabList[0].key,
            },
          });
          index++;
        }
        while (index < list.length && (yield take('getCombinationLineChartComplete')));
      }
    },
    // 根据组合id获取对应趋势图数据
    * getCombinationLineChart({ payload }, { call, put, race }) {
      const newPayload = {
        combinationCode: payload.combinationCode,
        ...calcDate(payload.key),
      };
      const { response } = yield race({
        response: call(api.getCombinationChart, newPayload),
        filed: delay(15000),
      });
      // 用于触发下一次查询图表信息
      yield put({
        type: 'getCombinationLineChartComplete',
      });
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
