/*
 * @Author: sunweibin
 * @Date: 2018-08-29 10:19:47
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-09-03 16:16:14
 * @description 临时委托他人处理任务Model
 */

import { tempDepute as api } from '../api';

// eslint-disable-next-line
export default {
  namespace: 'tempDepute',
  state: {
    // 委托申请列表
    applyList: {},
    // 可以受托人的部门以及受托人员列表
    deputeEmpList: [],
    // 申请单详情
    applyDetail: {},
    // 是否能够提交委托申请结果
    checkResult: {},
    // 提交申请结果
    submitResult: {},
    // 撤销委托申请结果
    revertResult: {},
    // 流程、审批接口请求结果
    flowResult: {},
    // 驳回后修改的弹出层按钮以及审批人数据
    approvalForUpdate: {},
    // 受托部门列表
    deputeOrgList: [],
    // 审批人列表
    approval: {},
  },
  reducers: {
    queryApplyListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        applyList: resultData,
      };
    },
    queryApplyDetailSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        applyDetail: resultData,
      };
    },
    queryCanDeputeEmpSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        deputeEmpList: resultData.servicePeopleList || [],
      };
    },
    checkApplyAbilitySuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        checkResult: resultData,
      };
    },
    getApprovalInfoSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        approval: resultData,
      };
    },
    queryCanDeputeOrgSuccess(state, action) {
      const { payload: { resultData = [] } } = action;
      return {
        ...state,
        deputeOrgList: resultData || [],
      };
    },
    saveApplySuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        submitResult: resultData,
      };
    },
    revertApplySuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        revertResult: resultData,
      };
    },
    doApproveSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        flowResult: resultData,
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
    // 查询申请单列表
    * queryApplyList({ payload }, { put, call }) {
      const response = yield call(api.queryApplyList, payload);
      yield put({
        type: 'queryApplyListSuccess',
        payload: response,
      });
    },

    // 查询申请单详情
    * queryApplyDetail({ payload }, { put, call }) {
      const response = yield call(api.getApplyDetail, payload);
      yield put({
        type: 'queryApplyDetailSuccess',
        payload: response,
      });
    },

    // 查询可以受托的组织机构和服务经理
    * queryCanDeputeEmp({ payload }, { put, call }) {
      const response = yield call(api.queryCanDeputeEmp, payload);
      yield put({
        type: 'queryCanDeputeEmpSuccess',
        payload: response,
      });
    },

    // 获取新建页面的流程按钮和审批人
    * getApprovalInfo({ payload = {} }, { call, put }) {
      const response = yield call(api.queryNextStepInfo, payload);
      yield put({
        type: 'getApprovalInfoSuccess',
        payload: response,
      });
    },

    // 获取可选受托人部门的列表
    * queryCanDeputeOrg({ payload }, { call, put }) {
      const response = yield call(api.queryCanDeputeOrg, payload);
      yield put({
        type: 'queryCanDeputeOrgSuccess',
        payload: response,
      });
    },

    // 校验是否可以申请任务委托
    * checkApplyAbility({ payload }, { put, call }) {
      const response = yield call(api.checkApplyAbility, payload);
      yield put({
        type: 'checkApplyAbilitySuccess',
        payload: response,
      });
    },

    // 新建提交申请
    * saveApply({ payload }, { put, call }) {
      const response = yield call(api.saveApply, payload);
      yield put({
        type: 'saveApplySuccess',
        payload: response,
      });
    },

    // 撤销委托申请
    * revertApply({ payload }, { put, call }) {
      const response = yield call(api.revertApply, payload);
      yield put({
        type: 'revertApplySuccess',
        payload: response,
      });
    },

    // 流程发起、流程审批
    * doApprove({ payload }, { put, call }) {
      const response = yield call(api.doApprove, payload);
      yield put({
        type: 'doApproveSuccess',
        payload: response,
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
