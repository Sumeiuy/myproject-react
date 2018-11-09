/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性
 * @Date: 2018-11-06 14:59:53
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-07 16:50:03
 */
import { detailCustProperty as api } from '../../api';

// const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

export default {
  namespace: 'detailCustProperty',
  state: {
    // 客户基本信息
    custInfo: EMPTY_OBJECT,
    // 涨乐U会员信息
    zlUMemberInfo: EMPTY_OBJECT,
    // 涨乐U会员等级变更记录
    zlUMemberLevelChangeRecords: EMPTY_OBJECT,
  },
  reducers: {
    queryCustomerPropertySuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        custInfo: payload || EMPTY_OBJECT,
      };
    },
    queryZLUmemberInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        zlUMemberInfo: payload || EMPTY_OBJECT,
      };
    },
    queryZLUmemberLevelChangeRecords(state, action) {
      const { payload } = action;
      return {
        ...state,
        zlUMemberLevelChangeRecords: payload || EMPTY_OBJECT,
      };
    },
  },
  effects: {
    // 获取客户属性信息
    * queryCustomerProperty({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryCustomerProperty, payload);
      yield put({
        type: 'queryCustomerPropertySuccess',
        payload: resultData,
      });
    },
    // 获取涨乐财富通U会员信息
    * queryZLUmemberInfo({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryZLUmemberInfo, payload);
      yield put({
        type: 'queryZLUmemberInfoSuccess',
        payload: resultData,
      });
    },
    // 获取涨乐财富通U会员等级变更记录
    * queryZLUmemberLevelChangeRecords({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryZLUmemberLevelChangeRecords, payload);
      yield put({
        type: 'queryZLUmemberLevelChangeRecordsSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {

  },
};
