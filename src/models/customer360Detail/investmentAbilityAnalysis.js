/*
 * @Author: zhangjun
 * @Date: 2018-11-20 16:01:36
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-22 17:21:33
 * @description 新版客户360详情下的账户信息Tab页面的model
 */
import { detailInvestmentAbilityAnalysis as api } from '../../api';

export default {
  namespace: 'detailInvestmentAbilityAnalysis',
  state: {
    // 盈利能力
    profitAbility: {},
    // 投资账户特征
    investmentFeatureLabels: [],
    // 账户资产变动
    assetChangeList: [],
  },
  reducers: {
    // 获取客户盈利能力成功
    getProfitAbilitySuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        profitAbility: payload || {},
      };
    },
    // 获取投资账户特征成功
    getInvestmentFeatureLabelsSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        investmentFeatureLabels: payload || [],
      };
    },
    // 获取账户资产变动成功
    getAssetChangeStateSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        assetChangeList: payload || [],
      };
    }
  },
  effects: {
    // 获取客户盈利能力
    * getProfitAbility({ payload }, { call, put }) {
      const { resultData = {} } = yield call(api.queryProfitAbility, payload);
      yield put({
        type: 'getProfitAbilitySuccess',
        payload: resultData,
      });
    },
    // 获取投资账户特征
    * getInvestmentFeatureLabels({ payload }, { call, put }) {
      const { resultData = [] } = yield call(api.queryInvestmentFeatureLabels, payload);
      yield put({
        type: 'getInvestmentFeatureLabelsSuccess',
        payload: resultData,
      });
    },
    // 获取账户资产变动
    * getAssetChangeState({ payload }, { call, put }) {
      const { resultData = [] } = yield call(api.queryAssetChangeState, payload);
      yield put({
        type: 'getAssetChangeStateSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
  },
};
