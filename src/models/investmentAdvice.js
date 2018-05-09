/*
 * @Author: zhangjun
 * @Date: 2018-04-25 15:37:57
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-05-08 10:03:26
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
    // 投资建议文本撞墙检测是否有股票代码
    testWallCollisionStatus: false,
  },
  reducers: {
    // 投资模板列表
    getInvestmentAdviceListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        investmentAdvices: resultData,
      };
    },
    // 删除是否成功
    deleteInvestAdviceSuccess(state, action) {
      const { payload = '' } = action;
      return {
        ...state,
        deleteSuccessStatus: payload === 'success',
      };
    },
    // 新建或编辑模版是否成功
    modifyInvestAdviceSuccess(state, action) {
      const { payload = '' } = action;
      return {
        ...state,
        modifySuccessStatus: payload === 'success',
      };
    },
    // 投资建议文本撞墙检测是否有股票代码
    testWallCollisionSuccess(state, action) {
      const { payload = '' } = action;
      return {
        ...state,
        testWallCollisionStatus: payload === 'success',
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

    // 投资建议文本撞墙检测
    * testWallCollision({ payload }, { call, put }) {
      // 检测时把testWallCollisionStatus改成false
      yield put({
        type: 'testWallCollisionSuccess',
        payload: '',
      });
      const { resultData } = yield call(api.testWallCollision, payload);
      yield put({
        type: 'testWallCollisionSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {},
};
