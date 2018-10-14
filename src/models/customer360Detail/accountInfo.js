/*
 * @Author: sunweibin
 * @Date: 2018-10-09 16:52:56
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-10-14 17:19:50
 * @description 新版客户360详情下的账户信息Tab页面的model
 */
import { detailAccountInfo as api } from '../../api';

export default {
  namespace: 'detailAccountInfo',
  state: {
    //实时持仓下的实时资产数据
    realTimeAsset: {},
    //实时持仓下的证券实时持仓数据
    securitiesHolding: {},
    //实时持仓下的产品实时持仓数据
    storageOfProduct: {},
    // 资产分布的雷达数据
    assetsRadarData: {},
    // 资产分布的雷达上具体指标的数据
    specificIndexData: [],
    // 负债详情的数据
    debtDetail: {},
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
    getStorageOfProductSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        storageOfProduct: payload || {},
      };
    },
    getAssetRadarDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        assetsRadarData: payload || {},
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
    //实时持仓中的产品实时持仓
    * getStorageOfProduct({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryStorageOfProduct, payload);
      yield put({
        type: 'getStorageOfProductSuccess',
        payload: resultData,
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
