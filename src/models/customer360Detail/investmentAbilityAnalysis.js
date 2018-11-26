/*
 * @Author: zhangjun
 * @Date: 2018-11-20 16:01:36
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-23 19:27:04
 * @description 新版客户360详情下的账户信息Tab页面的model
 */
import { detailInvestmentAbilityAnalysis as api } from '../../api';

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

export default {
  namespace: 'detailInvestmentAbilityAnalysis',
  state: {
    // 盈利能力
    profitAbility: EMPTY_OBJECT,
    // 投资账户特征
    investmentFeatureLabels: EMPTY_ARRAY,
    // 账户资产变动
    assetChangeList: EMPTY_ARRAY,
    // 账户资产变动图表数据
    assetChangeReportData: EMPTY_ARRAY,
  },
  reducers: {
    // 获取客户盈利能力成功
    getProfitAbilitySuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        profitAbility: payload || EMPTY_OBJECT,
      };
    },
    // 获取投资账户特征成功
    getInvestmentFeatureLabelsSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        investmentFeatureLabels: payload || EMPTY_ARRAY,
      };
    },
    // 获取账户资产变动成功
    getAssetChangeStateSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        assetChangeList: payload || EMPTY_ARRAY,
      };
    },
    // 获取账户资产变动图表数据
    getAssetChangeReportSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        assetChangeReportData: payload || EMPTY_ARRAY,
      };
    }
  },
  effects: {
    // 获取客户盈利能力
    * getProfitAbility({ payload }, { call, put }) {
      const { resultData = EMPTY_OBJECT } = yield call(api.queryProfitAbility, payload);
      yield put({
        type: 'getProfitAbilitySuccess',
        payload: resultData,
      });
    },
    // 获取投资账户特征
    * getInvestmentFeatureLabels({ payload }, { call, put }) {
      const { resultData = EMPTY_ARRAY } = yield call(api.queryInvestmentFeatureLabels, payload);
      yield put({
        type: 'getInvestmentFeatureLabelsSuccess',
        payload: resultData,
      });
    },
    // 获取账户资产变动
    * getAssetChangeState({ payload }, { call, put }) {
      const { resultData = EMPTY_ARRAY } = yield call(api.queryAssetChangeState, payload);
      yield put({
        type: 'getAssetChangeStateSuccess',
        payload: resultData,
      });
    },
    // 获取账户资产变动图表
    * getAssetChangeReport({ payload }, { call, put }) {
      const { resultData = EMPTY_ARRAY } = yield call(api.queryAssetChangeReport, payload);
      yield put({
        type: 'getAssetChangeReportSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
  },
};
