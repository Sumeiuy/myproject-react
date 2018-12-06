/*
 * @Author: sunweibin
 * @Date: 2018-10-09 16:52:56
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-10 13:05:03
 * @description 新版客户360详情下的账户信息Tab页面的model
 */
import _ from 'lodash';

import { data } from '../../helper';
import { detailAccountInfo as api } from '../../api';


export default {
  namespace: 'detailAccountInfo',
  state: {
    // 实时持仓下的实时资产数据
    realTimeAsset: {},
    // 实时持仓下的证券实时持仓数据
    securitiesHolding: [],
    // 实时持仓下的产品实时持仓数据
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
    // 客户是否有已实施的流程
    hasDoingFlow: false,
    // 证券历史持仓明细
    stockHistoryHoldingData: {},
    // 产品历史持仓明细
    productHistoryHoldingData: {},
    // 期权历史持仓明细
    optionHistoryHoldingData: {},
    // 交易流水弹出层中的历史账户下的业务类别(包含普通、信用)
    tradeFlowBusnTypeDict: {
      normal: [],
      credit: [],
    },
    // 交易流水弹出层中的资金变动下的业务类别(包含普通、信用、期权)
    tradeFlowCapitalBusnTypeDict: {
      normal: [],
      credit: [],
      option: [],
    },
    // 账户信息下的业务类别(包含普通、信用、期权)
    accountBusnTypeDict: {
      normal: [],
      credit: [],
      option: [],
    },
    // 全产品目录
    productCatalogTree: [],
    // 普通账户交易流水
    standardTradeFlowRes: {},
    // 信用账户交易流水
    creditTradeFlowRes: {},
    // 期权账户交易流水
    optionTradeFlowRes: {},
    // 资金变动交易流水
    capitalChangeFlowRes: {},
    // 账户变动
    accountChangeRes: {
      normalAccountChange: {},
      creditAccountChange: {},
      optionAccountChange: {},
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
      if (withCustPofit) { // 需要同时更新基准数据和对比数据
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
        specificIndexData: payload || [],
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
    queryProductHistoryHoldingSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        productHistoryHoldingData: resultData || {},
      };
    },
    queryStockHistoryHoldingSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        stockHistoryHoldingData: resultData || {},
      };
    },
    queryOptionHistoryHoldingSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        optionHistoryHoldingData: resultData || {},
      };
    },
    queryTradeFlowBusnTypeDictSuccess(state, action) {
      const { payload } = action;
      const { tradeFlowBusnTypeDict } = state;
      return {
        ...state,
        tradeFlowBusnTypeDict: {
          ...tradeFlowBusnTypeDict,
          ...payload,
        }
      };
    },
    queryTradeFlowCaptialBusnTypeDictSuccess(state, action) {
      const { payload } = action;
      const { tradeFlowCapitalBusnTypeDict } = state;
      return {
        ...state,
        tradeFlowCapitalBusnTypeDict: {
          ...tradeFlowCapitalBusnTypeDict,
          ...payload,
        }
      };
    },
    queryAccountBusnTypeDictSuccess(state, action) {
      const { payload } = action;
      const { accountBusnTypeDict } = state;
      return {
        ...state,
        accountBusnTypeDict: {
          ...accountBusnTypeDict,
          ...payload,
        }
      };
    },
    queryProductCatalogTreeSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        productCatalogTree: (resultData && resultData.allProductMenuTree) || [],
      };
    },
    queryStandardTradeFlowSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        standardTradeFlowRes: resultData || {},
      };
    },
    queryCreditTradeFlowSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        creditTradeFlowRes: resultData || {},
      };
    },
    queryOptionTradeFlowSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        optionTradeFlowRes: resultData || {},
      };
    },
    queryCapitalTradeFlowSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        capitalChangeFlowRes: resultData || {},
      };
    },
    queryAccountChangeSuccess(state, action) {
      const { payload } = action;
      const { accountChangeRes } = state;
      return {
        ...state,
        accountChangeRes: {
          ...accountChangeRes,
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
    // 查询客户是否有已实施的流程
    queryHasDoingFlowSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        hasDoingFlow: payload || false,
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
        payload: {
          resultData,
          withCustPofit,
        },
      });
    },

    // 查询资产分布的雷达上具体指标的数据
    * querySpecificIndexData({ payload }, { put, call }) {
      const { resultData } = yield call(api.querySpecificIndexData, payload);
      // 给数据一个key,避免在组件中render时候，每一次都会变化
      const newResultData = _.map(resultData, (item) => {
        const { children } = item;
        const childrenData = _.map(children, data.addKey);
        const newItem = data.addKey(item);
        return {
          ...newItem,
          children: childrenData,
        };
      });
      yield put({
        type: 'querySpecificIndexDataSuccess',
        payload: newResultData,
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
    // 实时持仓中的实时资产
    * getRealTimeAsset({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryRealTimeAsset, payload);
      yield put({
        type: 'getRealTimeAssetSuccess',
        payload: resultData,
      });
    },
    // 实时持仓中的证券实时持仓
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
    // 查询客户是否有已实施的流程
    * queryHasDoingFlow({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryHasDoingFlow, payload);
      yield put({
        type: 'queryHasDoingFlowSuccess',
        payload: resultData,
      });
    },
    // 查询证券历史持仓明细
    * queryStockHistoryHolding({ payload }, { put, call }) {
      const response = yield call(api.queryStockHistoryHolding, payload);
      yield put({
        type: 'queryStockHistoryHoldingSuccess',
        payload: response,
      });
    },
    // 查询客户产品历史持仓明细
    * queryProductHistoryHolding({ payload }, { put, call }) {
      const response = yield call(api.queryProductHistoryHolding, payload);
      yield put({
        type: 'queryProductHistoryHoldingSuccess',
        payload: response,
      });
    },
    // 查询期权历史持仓明细
    * queryOptionHistoryHolding({ payload }, { put, call }) {
      const response = yield call(api.queryOptionHistoryHolding, payload);
      yield put({
        type: 'queryOptionHistoryHoldingSuccess',
        payload: response,
      });
    },
    // 查询交易流水中的账户历史Tabs业务类别
    * queryTradeFlowBusnTypeDict({ payload }, { put, call }) {
      // 因为业务类别中普通账户和信用账户的是不一样的，所以需要这样做区分
      const { accountType } = payload;
      const { resultData } = yield call(api.queryBusnTypeDict, payload);
      const type = _.lowerCase(accountType);
      yield put({
        type: 'queryTradeFlowBusnTypeDictSuccess',
        payload: { [type]: (resultData && resultData.list) || [] },
      });
    },
    // 查询交易流水中的资金变动的业务类别
    * queryTradeFlowCapitalBusnTypeDict({ payload }, { put, call }) {
      // 因为资金变动的与交易流水历史账户中的业务类别不一样
      const { accountType } = payload;
      const { resultData } = yield call(api.queryBusnTypeDict, payload);
      const type = _.lowerCase(accountType);
      yield put({
        type: 'queryTradeFlowCaptialBusnTypeDictSuccess',
        payload: { [type]: (resultData && resultData.list) || [] },
      });
    },
    // 查询账户信息下的业务类别，因为与交易流水中的也不一样所以分开处理
    * queryAccountBusnTypeDict({ payload }, { put, call }) {
      // 因为业务类别中普通账户/信用账户/期权账户的是不一样的，所以需要这样做区分
      const { accountType } = payload;
      const { resultData } = yield call(api.queryBusnTypeDict, payload);
      const type = _.lowerCase(accountType);
      yield put({
        type: 'queryAccountBusnTypeDictSuccess',
        payload: { [type]: (resultData && resultData.list) || [] },
      });
    },
    // 查询产品代码
    * queryProductCodeList({ payload }, { call }) {
      // 目前查询产品代码使用此种方式，直接将数据返回给结果，由调用者自己保存
      const { resultData } = yield call(api.queryFinProductList, payload);
      return (resultData && resultData.list) || [];
    },
    // 查询全产品目录
    * queryProductCatalogTree({ payload }, { put, call }) {
      const response = yield call(api.queryProductCatalogTree, payload);
      yield put({
        type: 'queryProductCatalogTreeSuccess',
        payload: response,
      });
    },
    // 查询普通账户交易流水
    * queryStandardTradeFlow({ payload }, { put, call }) {
      const response = yield call(api.queryStandardTradeFlow, payload);
      yield put({
        type: 'queryStandardTradeFlowSuccess',
        payload: response,
      });
    },
    // 查询信用账户交易流水
    * queryCreditTradeFlow({ payload }, { put, call }) {
      const response = yield call(api.queryCreditTradeFlow, payload);
      yield put({
        type: 'queryCreditTradeFlowSuccess',
        payload: response,
      });
    },
    // 查询期权账户交易流水
    * queryOptionTradeFlow({ payload }, { put, call }) {
      const response = yield call(api.queryOptionTradeFlow, payload);
      yield put({
        type: 'queryOptionTradeFlowSuccess',
        payload: response,
      });
    },
    // 查询资金变动交易流水
    * queryCapitalTradeFlow({ payload }, { put, call }) {
      const response = yield call(api.queryCapitalTradeFlow, payload);
      yield put({
        type: 'queryCapitalTradeFlowSuccess',
        payload: response,
      });
    },
    // 查询账户变动
    * queryAccountChange({ payload }, { put, call }) {
      const { accountType } = payload;
      const { resultData } = yield call(api.queryAccountChange, payload);
      const type = `${_.lowerCase(accountType)}AccountChange`;
      yield put({
        type: 'queryAccountChangeSuccess',
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
