/*
 * @Author: sunweibin
 * @Date: 2018-10-09 16:52:56
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-09 17:21:40
 * @description 新版客户360详情下的账户信息Tab页面的model
 */
import { detailAccountInfo as api } from '../../api';

export default {
  namespace: 'detailAccountInfo',
  state: {
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
  },
  reducers: {
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
