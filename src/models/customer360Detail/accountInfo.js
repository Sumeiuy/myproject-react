/*
 * @Author: sunweibin
 * @Date: 2018-10-09 16:52:56
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-24 14:14:53
 * @description 新版客户360详情下的账户信息Tab页面的model
 */
import { detailAccountInfo as api } from '../../api';

import _ from 'lodash';

export default {
  namespace: 'detailAccountInfo',
  state: {
    //实时持仓下的实时资产数据
    realTimeAsset: {},
    //实时持仓下的证券实时持仓数据
    securitiesHolding: [],
    //实时持仓下的产品实时持仓数据
    productHoldingData: [],
    // 资产分布的雷达数据
    assetsRadarData: {},
    // 资产分布的雷达上具体指标的数据
    specificIndexData: [],
    // 负债详情的数据
    debtDetail: {},
    // 收益走势基本指标数据
    custBasicData: {},
    // 收益走势对比指标数据
    custCompareData: {},
    // 账户概要信息
    accountSummaryInfo: {},
    // 普通账户、信用账户、期权账户信息
    accountInfo: {
      normalAccount: {},
      creditAccount: {},
      optionAccount: {},
    },
  },
  reducers: {
    getRealTimeAssetSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        realTimeAsset: payload || {},
      };
    },
    getSecuritiesHoldingSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        securitiesHolding: payload || {},
      };
    },
    getProductHoldingDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        productHoldingData: payload || {},
      };
    },
    getAssetRadarDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        assetsRadarData: payload || {},
      };
    },
    getProfitRateInfoSuccess(state, action) {
      const { payload } = action;
      const { withCustPofit, resultData } = payload;
      if(withCustPofit) { // 需要同时更新基准数据和对比数据
        return {
          ...state,
          custBasicData: {
            indexLine: resultData.earningLine,
            indexData: resultData.earningData,
            timeLine: resultData.timeLine,
          },
          custCompareData: {
            indexLine: resultData.indexLine,
            indexData: resultData.indexData,
            timeLine: resultData.timeLine,
          },
        };
      }
      // 只需要更新对比数据
      return {
        ...state,
        custCompareData: {
          indexLine: resultData.indexLine,
          indexData: resultData.indexData,
          timeLine: resultData.timeLine,
        },
      };
    },
    querySpecificIndexDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        specificIndexData: payload || {},
      };
    },
    queryDebtDetailSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        debtDetail: payload || {},
      };
    },
    queryAccountSummarySuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        accountSummaryInfo: payload || {},
      };
    },
    queryAccountInfoSuccess(state, action) {
      const { payload } = action;
      const { accountInfo } = state;
      return {
        ...state,
        accountInfo: {
          ...accountInfo,
          ...payload,
        },
      };
    },
    // 清除redux数据
    clearReduxDataSuccess(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 查询资产分布的雷达图数据
    * getAssetRadarData({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryAssetRadarData, payload);
      yield put({
        type: 'getAssetRadarDataSuccess',
        payload: resultData,
      });
    },
    // 查询收益走势图表数据
    * getProfitRateInfo({ payload }, { put, call }) {
      const { withCustPofit } = payload;
      const { resultData } = yield call(api.queryProfitRateInfo, payload);
      yield put({
        type: 'getProfitRateInfoSuccess',
        payload: { resultData, withCustPofit },
      });
    },
    // 查询资产分布的雷达上具体指标的数据
    * querySpecificIndexData({ payload }, { put, call }) {
      const { resultData } = yield call(api.querySpecificIndexData, payload);
      yield put({
        type: 'querySpecificIndexDataSuccess',
        payload: resultData,
      });
    },
    // 查询资产分布的负债详情的数据
    * queryDebtDetail({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryDebtDetail, payload);
      yield put({
        type: 'queryDebtDetailSuccess',
        payload: resultData,
      });
    },
    //实时持仓中的实时资产
    * getRealTimeAsset({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryRealTimeAsset, payload);
      yield put({
        type: 'getRealTimeAssetSuccess',
        payload: resultData,
      });
    },
    //实时持仓中的证券实时持仓
    * getSecuritiesHolding({ payload }, { put, call }) {
      const { resultData } = yield call(api.querySecuritiesHolding, payload);
      yield put({
        type: 'getSecuritiesHoldingSuccess',
        payload: resultData,
      });
    },
    // 实时持仓中的产品实时持仓
    * getProductHoldingData({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryStorageOfProduct, payload);
      yield put({
        type: 'getProductHoldingDataSuccess',
        payload: resultData,
      });
    },
    // 查询账户概要信息
    * queryAccountSummary({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryAccountSummary, payload);
      yield put({
        type: 'queryAccountSummarySuccess',
        payload: resultData,
      });
    },
    // 查询普通账户、信用账户、期权账户
    * queryAccountInfo({ payload }, { put, call }) {
      const { accountType } = payload;
      const { resultData } = yield call(api.queryAccountInfo, payload);
      const type = `${_.lowerCase(accountType)}Account`;
      yield put({
        type: 'queryAccountInfoSuccess',
        payload: { [type]: resultData || {} },
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
