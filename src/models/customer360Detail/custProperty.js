/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性
 * @Date: 2018-11-06 14:59:53
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-29 20:30:07
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
    // 个人客户联系方式列表数据
    personalContactWay: {},
    // 机构客户联系方式列表数据
    orgContactWay: {},
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
    queryPersonalContactWaySuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        personalContactWay: payload || {},
      };
    },
    queryOrgContactWaySuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        orgContactWay: payload || {},
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
    * updateCustBasicInfo({ payload }, { call }) {
      // 因为此处只是单纯的修改值，并且组件中需要判断修改成功与否展示loading状态
      const { resultData } = yield call(api.updateCustBasicInfo, payload);
      return resultData;
    },
    // 编辑个人客户、机构客户的基本信息
    * changePhoneInfo({ payload }, { call }) {
      // 因为此处只是单纯的修改值，并且组件中需要判断修改成功与否展示loading状态
      const { resultData } = yield call(api.changePhoneInfo, payload);
      return resultData;
    },
    // 查询个人客户联系方式信息数据
    * queryPersonalContactWay({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryPersonalContactWay, payload);
      yield put({
        type: 'queryPersonalContactWaySuccess',
        payload: resultData,
      });
    },
    // 查询机构客户联系方式信息数据
    * queryOrgContactWay({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryOrgContactWay, payload);
      yield put({
        type: 'queryOrgContactWaySuccess',
        payload: resultData,
      });
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
    * updateOrgFinaceData({ payload }, { call }) {
      const { resultData } = yield call(api.updateOrgFinaceData, payload);
      return resultData;
    },
    // 新增|修改个人客户电话信息
    * updatePerPhone({ payload }, { call }) {
      const { resultData } = yield call(api.updatePerPhone, payload);
      return resultData;
    },
    // 新增|修改个人客户地址信息
    * updatePerAddress({ payload }, { call }) {
      const { resultData } = yield call(api.updatePerAddress, payload);
      return resultData;
    },
    // 新增|修改个人客户其他信息
    * updatePerOther({ payload }, { call }) {
      const { resultData } = yield call(api.updatePerOther, payload);
      return resultData;
    },
    // 删除个人客户|机构客户的非主要联系方式
    * delContact({ payload }, { call }) {
      const { resultData } = yield call(api.delContact, payload);
      return resultData;
    },
  },
  subscriptions: {
  },
};
