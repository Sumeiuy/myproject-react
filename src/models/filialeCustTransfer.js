/*eslint-disable */
/*
 * @Description: 分公司客户划转 model
 * @Author: XuWenKang
 * @Date: 2017-12-06 15:13:30
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-12-06 15:13:30
 */
import { filialeCustTransfer as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'filialeCustTransfer',
  state: {
    custList: EMPTY_LIST, // 客户列表列表
    oldManager: EMPTY_OBJECT, // 原服务经理
    newManagerList: EMPTY_LIST, // 新服务经理列表
  },
  reducers: {
    getCustListSuccess(state, action) {
      const { paylaod: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        custList: resultData,
      };
    },
    getOldManagerSuccess(state, action) {
      const { paylaod: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        oldManager: resultData,
      };
    },
    getNewManagerListSuccess(state, action) {
      const { paylaod: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        newManagerList: resultData,
      };
    },
  },
  effects: {
    // 查询客户列表
    * getCustList({ payload }, { call, put }) {
      const response = yield call(api.getCustList, payload);
      yield put({
        type: 'getCustListSuccess',
        paylaod: response,
      })
    },
    // 获取原客户经理
    * getOldManager({ payload }, { call, put }) {
      const response = yield call(api.getOldManager, payload);
      yield put({
        type: 'getOldManagerSuccess',
        paylaod: response,
      })
    },
    // 获取新客户经理列表
    * getNewManagerList({ payload }, { call, put }) {
      const response = yield call(api.getNewManagerList, payload);
      yield put({
        type: 'getNewManagerListSuccess',
        paylaod: response,
      })
    },
    // 提交保存
    * saveChange({ payload }, { call, put }) {
      const response = yield call(api.getCustList, payload);
      yield put({
        type: 'getNewManagerListSuccess',
        paylaod: response,
      })
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        // 第一次进入页面查询客户列表
        if (pathname === '/filialeCustTransfer') {
          // 进入页面查询子类型列表
          dispatch({ type: 'getCustList', payload: EMPTY_OBJECT });
          // 进入页面查询新服务经理列表
          dispatch({ type: 'getNewManagerList', payload: EMPTY_OBJECT });
        }
      });
    },
  },
};
/*eslint-disable */
