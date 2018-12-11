/**
 * @Description: 客户360-合约管理-协议model
 * @Author: Liujianshu-K0240007
 * @Date: 2018-11-21 16:39:44
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-12-05 13:51:54
 */

import { detailContractManage as api } from '../../api';

const EMPTY_OBJECT = {};

export default {
  namespace: 'contractManage',
  state: {
    // 协议列表
    protocolList: EMPTY_OBJECT,
    // 登陆人信息
    loginInfo: EMPTY_OBJECT,
    // 通过前置条件
    passPrecondition: EMPTY_OBJECT,
    // 提交数据
    submitData: EMPTY_OBJECT,
    // 删除数据
    deleteData: EMPTY_OBJECT,
    // 合同列表
    agreementList: EMPTY_OBJECT,
    // 合约列表
    contractList: EMPTY_OBJECT,
    // 合约条款
    contractTerms: EMPTY_OBJECT,
    // 审批历史
    approvalHistory: EMPTY_OBJECT,
    // 附件列表
    attachmentList: EMPTY_OBJECT,
  },
  reducers: {
    queryProtocolListSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
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
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        agreementList: payload,
      };
    },
    queryContractListSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        contractList: payload,
      };
    },
    queryContractTermsSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        contractTerms: payload,
      };
    },
    queryApprovalHistorySuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        approvalHistory: payload,
      };
    },
    queryAttachmentListSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        attachmentList: payload,
      };
    },
    // 清除数据
    clearData(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        ...payload,
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
    // 查询合约列表
    * queryContractList({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryContractList, payload);
      yield put({
        type: 'queryContractListSuccess',
        payload: resultData,
      });
    },
    // 查询条款列表
    * queryContractTerms({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryContractTerms, payload);
      yield put({
        type: 'queryContractTermsSuccess',
        payload: resultData,
      });
    },
    // 查询审批历史
    * queryApprovalHistory({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryApprovalHistory, payload);
      yield put({
        type: 'queryApprovalHistorySuccess',
        payload: resultData,
      });
    },
    // 查询附件列表
    * queryAttachmentList({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryAttachmentList, payload);
      yield put({
        type: 'queryAttachmentListSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
  },
};
