/*
 * @Author: zhangjun
 * @Date: 2018-11-20 16:01:36
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-04 13:19:46
 * @description 新版客户360详情下的账户信息Tab页面的model
 */
import { detailInvestAnalyze as api } from '../../api';

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

export default {
  namespace: 'detailInvestAnalyze',
  state: {
    // 盈利能力
    profitAbility: EMPTY_OBJECT,
    // 投资账户特征
    investmentFeatureLabels: EMPTY_ARRAY,
    // 账户资产变动
    assetChangeList: EMPTY_ARRAY,
    // 账户资产变动图表数据
    assetChangeReportData: EMPTY_ARRAY,
    // 账户收益走势数据
    profitTrendData: EMPTY_OBJECT,
    // brinson归因数据
    attributionData: EMPTY_OBJECT,
    // 期末资产配置数据
    endTermAssetConfigData: EMPTY_OBJECT,
    // 资产配置变动走势
    assetConfigTrendData: EMPTY_OBJECT,
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
    // 获取账户资产变动图表数据成功
    getAssetChangeReportSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        assetChangeReportData: payload || EMPTY_ARRAY,
      };
    },
    // 获取账户收益走势数据成功
    getProfitTrendReportSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        profitTrendData: payload || EMPTY_OBJECT,
      };
    },
    // 获取brinson归因分析成功
    getAttributionAnalysisSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        attributionData: payload || EMPTY_OBJECT,
      };
    },
    // 获取期末资产配置数据成功
    getEndTermAssetConfigSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        endTermAssetConfigData: payload || EMPTY_OBJECT,
      };
    },
    // 获取资产配置变动走势数据成功
    getAssetConfigTrendSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        assetConfigTrendData: payload || EMPTY_OBJECT,
      };
    },
  },
  effects: {
    // 获取客户盈利能力
    * getProfitAbility({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryProfitAbility, payload);
      yield put({
        type: 'getProfitAbilitySuccess',
        payload: resultData,
      });
    },
    // 获取投资账户特征
    * getInvestmentFeatureLabels({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryInvestmentFeatureLabels, payload);
      yield put({
        type: 'getInvestmentFeatureLabelsSuccess',
        payload: resultData,
      });
    },
    // 获取账户资产变动
    * getAssetChangeState({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryAssetChangeState, payload);
      yield put({
        type: 'getAssetChangeStateSuccess',
        payload: resultData,
      });
    },
    // 获取账户资产变动图表
    * getAssetChangeReport({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryAssetChangeReport, payload);
      yield put({
        type: 'getAssetChangeReportSuccess',
        payload: resultData,
      });
    },
    // 获取账户收益走势图表数据
    * getProfitTrendReport({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryProfitTrendReport, payload);
      yield put({
        type: 'getProfitTrendReportSuccess',
        payload: resultData,
      });
    },
    // 获取brinson归因分析
    * getAttributionAnalysis({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryAttributionAnalysis, payload);
      yield put({
        type: 'getAttributionAnalysisSuccess',
        payload: resultData,
      });
    },
    // 获取期末资产配置数据
    * getEndTermAssetConfig({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryEndTermAssetConfig, payload);
      yield put({
        type: 'getEndTermAssetConfigSuccess',
        payload: resultData,
      });
    },
    // 获取资产配置变动走势
    * getAssetConfigTrend({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryAssetConfigTrend, payload);
      yield put({
        type: 'getAssetConfigTrendSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
  },
};
