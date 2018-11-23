/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性
 * @Date: 2018-11-06 14:59:53
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-22 13:43:02
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
    // 紫金积分会员信息
    zjPointMemberInfo: EMPTY_OBJECT,
    // 紫金积分会员积分兑换流水
    zjPointExchangeFlow: EMPTY_OBJECT,
    // 财务信息
    financeData: EMPTY_OBJECT,
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
    queryZLUmemberLevelChangeRecordsSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        zlUMemberLevelChangeRecords: payload || EMPTY_OBJECT,
      };
    },
    queryZjPointMemberInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        zjPointMemberInfo: payload || EMPTY_OBJECT,
      };
    },
    queryZjPointExchangeFlowSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        zjPointExchangeFlow: payload || EMPTY_OBJECT,
      };
    },
    queryFinanceDetailSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        financeData: payload || EMPTY_OBJECT,
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
    // 获取紫金积分会员信息
    * queryZjPointMemberInfo({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryZjPointMemberInfo, payload);
      yield put({
        type: 'queryZjPointMemberInfoSuccess',
        payload: resultData,
      });
    },
    // 获取紫金积分会员积分兑换流水
    * queryZjPointExchangeFlow({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryZjPointExchangeFlow, payload);
      yield put({
        type: 'queryZjPointExchangeFlowSuccess',
        payload: resultData,
      });
    },
    // 编辑个人客户、机构客户的基本信息
    * updateCustBasicInfo({ payload }, { put, call }) {
      // 因为此处只是单纯的修改值，并且组件中需要判断修改成功与否展示loading状态
      const { resultData } = yield call(api.updateCustBasicInfo, payload);
      return resultData;
    },
    // 查询个人客户、机构客户的财务信息
    * queryFinanceDetail({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryFinanceDetail, payload);
      yield put({
        type: 'queryFinanceDetailSuccess',
        payload: resultData,
      });
    },
    // 编辑个人客户的财务信息
    * updatePerFinaceData({ payload }, { put, call }) {
      const { resultData } = yield call(api.updatePerFinaceData, payload);
      return resultData;
    },
    // 编辑机构客户的财务信息
    * updateOrgFinaceData({ payload }, { put, call }) {
      const { resultData } = yield call(api.updateOrgFinaceData, payload);
      return resultData;
    },

  },
  subscriptions: {

  },
};
