/**
 * @Description: 客户360-合约管理-协议model
 * @Author: Liujianshu-K0240007
 * @Date: 2018-11-21 16:39:44
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-11-22 13:35:06
 */

import { customerDetailContractManage as api } from '../../api';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

export default {
  namespace: 'contractManage',
  state: {
    // 协议列表
    protocolList: EMPTY_LIST,
    // 登陆人信息
    loginInfo: EMPTY_OBJECT,
    // 通过前置条件
    passPrecondition: EMPTY_OBJECT,
    // 提交数据
    submitData: EMPTY_OBJECT,
    // 删除数据
    deleteData: EMPTY_OBJECT,
    // 合同列表
    agreementList: EMPTY_LIST,
  },
  reducers: {
    queryProtocolListSuccess(state, action) {
      const { payload = EMPTY_LIST } = action;
      return {
        ...state,
        protocolList: payload,
      };
    },
    queryLoginInfoSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        loginInfo: payload,
      };
    },
    queryPassPreconditionSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        passPrecondition: payload,
      };
    },
    submitProtocolSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        submitData: payload,
      };
    },
    deleteProtocolSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        deleteData: payload,
      };
    },
    queryAgreementListSuccess(state, action) {
      const { payload = EMPTY_LIST } = action;
      return {
        ...state,
        agreementList: payload,
      };
    },
  },
  effects: {
    // 查询协议列表
    * queryProtocolList({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryProtocolList, payload);
      yield put({
        type: 'queryProtocolListSuccess',
        payload: resultData,
      });
    },
    // 查询登陆人信息，是否有权限显示按钮
    * queryLoginInfo({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryLoginInfo, payload);
      yield put({
        type: 'queryLoginInfoSuccess',
        payload: resultData,
      });
    },
    // 判断是否通过投顾签约前置条件
    * queryPassPrecondition({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryPassPrecondition, payload);
      yield put({
        type: 'queryPassPreconditionSuccess',
        payload: resultData,
      });
    },
    // 提交协议
    * submitProtocol({ payload }, { put, call }) {
      const { resultData } = yield call(api.submitProtocol, payload);
      yield put({
        type: 'submitProtocolSuccess',
        payload: resultData,
      });
    },
    // 删除协议
    * deleteProtocol({ payload }, { put, call }) {
      const { resultData } = yield call(api.deleteProtocol, payload);
      yield put({
        type: 'deleteProtocolSuccess',
        payload: resultData,
      });
    },
    // 查询协议列表
    * queryAgreementList({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryAgreementList, payload);
      yield put({
        type: 'queryAgreementListSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
  },
};
