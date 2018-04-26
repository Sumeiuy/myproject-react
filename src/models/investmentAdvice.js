/*
 * @Author: zhangjun
 * @Date: 2018-04-25 15:37:57
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-04-26 20:22:17
 */
import { investmentAdvice as api } from '../api';

export default {
  namespace: 'investmentAdvice',
  state: {
    // 投资模板列表
    investmentAdvices: {},
    // 删除是否成功
    deleteSuccessStatus: false,
    // 新建或编辑模版是否成功
    modifySuccessStatus: false,
  },
  reducers: {
    getInvestmentAdviceListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        investmentAdvices: resultData,
      };
    },
    deleteInvestAdviceSuccess(state, action) {
      const { payload = '' } = action;
      return {
        ...state,
        deleteSuccessStatus: payload === 'success',
      };
    },
    modifyInvestAdviceSuccess(state, action) {
      const { payload = '' } = action;
      return {
        ...state,
        modifySuccessStatus: payload === 'success',
      };
    },
  },
  effects: {
    // 获取投资建议模版列表
    * getInvestmentAdviceList({ payload }, { call, put }) {
      const response = yield call(api.getInvestAdviceList, payload);
      yield put({
        type: 'getInvestmentAdviceListSuccess',
        payload: response,
      });
    },

    // 删除投资建议固定话术模板
    * deleteInvestAdvice({ payload }, { call, put }) {
      // 删除时把deleteSuccessStatus改成false
      yield put({
        type: 'deleteInvestAdviceSuccess',
        payload: '',
      });
      const { resultData } = yield call(api.deleteInvestAdvice, payload);
      yield put({
        type: 'deleteInvestAdviceSuccess',
        payload: resultData,
      });
    },

    // 新建或编辑模版
    * modifyInvestAdvice({ payload }, { call, put }) {
      yield put({
        type: 'modifyInvestAdviceSuccess',
        payload: '',
      });
      const { resultData } = yield call(api.modifyInvestAdvice, payload);
      yield put({
        type: 'modifyInvestAdviceSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {},
};
