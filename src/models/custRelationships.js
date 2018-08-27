/* eslint-disable import/no-anonymous-default-export */
/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系信息申请models
 * @Date: 2018-06-08 13:17:14
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-07-02 14:18:56
 */


import { custRelationships as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
export default {
  namespace: 'custRelationships',
  state: {
    // 右侧详情
    detailInfo: EMPTY_OBJECT,
    // 附件列表
    attachmentList: EMPTY_LIST,
    // 可进行关联关系申请的客户列表
    custList: [],
    // 新建页面中-用户选中的客户基本信息
    custDetail: {},
    // 关联关系树
    relationshipTree: [],
    // 驳回后修改页面的详情信息
    detailForUpdate: {},
    // 新建页面的按钮以及审批人
    approval: {},
    // 驳回后修改页面的按钮以及审批人
    approvalForUpdate: {},
    // 数据校验结果
    validateResult: {},
    // 提交申请后的结果
    submitResult: '',
    // 提交流程接口的结果
    flowResult: '',
  },
  reducers: {
    // 客户关联关系申请页面-右侧详情
    getDetailInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },
    // 获取附件列表
    getAttachmentListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        attachmentList: resultData,
      };
    },
    queryCustListSuccess(state, action) {
      const { payload: { resultData: { custList = [] } } } = action;
      return {
        ...state,
        custList,
      };
    },
    getCustDetailSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        custDetail: resultData,
      };
    },
    getRelationshipTreeSuccess(state, action) {
      const { payload: { resultData = [] } } = action;
      return {
        ...state,
        relationshipTree: resultData,
      };
    },
    getDetailForUpdateSuccess(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        detailForUpdate: payload,
      };
    },
    getApprovalInfoForUpdateSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        approvalForUpdate: resultData,
      };
    },
    getApprovalInfoSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        approval: resultData,
      };
    },
    validateDataSuccess(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        validateResult: payload,
      };
    },
    submitApplySuccess(state, action) {
      const { payload = '' } = action;
      return {
        ...state,
        submitResult: payload,
      };
    },
    doApproveFlowSuccess(state, action) {
      const { payload = '' } = action;
      return {
        ...state,
        flowResult: payload,
      };
    },
    clearReduxDataSuccess(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 客户关联关系申请页面-右侧详情
    * getDetailInfo({ payload }, { call, put }) {
      const response = yield call(api.getDetailInfo, payload);
      yield put({
        type: 'getDetailInfoSuccess',
        payload: response,
      });
    },
    // 获取附件信息
    * getAttachmentList({ payload }, { call, put }) {
      const response = yield call(api.getAttachmentList, payload);
      yield put({
        type: 'getAttachmentListSuccess',
        payload: response,
      });
    },
    // 根据关键字查询可申请的客户列表
    * queryCustList({ payload }, { call, put }) {
      const response = yield call(api.queryCustList, payload);
      yield put({
        type: 'queryCustListSuccess',
        payload: response,
      });
    },
    // 获取选中的客户的详情信息
    * getCustDetail({ payload }, { call, put }) {
      const response = yield call(api.getCustDetail, payload);
      yield put({
        type: 'getCustDetailSuccess',
        payload: response,
      });
    },
    // 获取新建页面的流程按钮和审批人
    * getApprovalInfo({ payload = {} }, { call, put }) {
      const response = yield call(api.getButtonList, payload);
      yield put({
        type: 'getApprovalInfoSuccess',
        payload: response,
      });
    },
    // 获取关联关系树
    * getRelationshipTree({ payload }, { call, put }) {
      const response = yield call(api.getRelationshipTree, payload);
      yield put({
        type: 'getRelationshipTreeSuccess',
        payload: response,
      });
    },
    // 获取客户关联信息驳回后修改页面的详情
    * getDetailForUpdate({ payload }, { call, put }) {
      const { resultData } = yield call(api.getDetailInfo, payload);
      const attach = yield call(api.getAttachmentList, { attachment: resultData.attachment || '' });
      yield put({
        type: 'getDetailForUpdateSuccess',
        payload: {
          ...resultData,
          attachmentList: attach.resultData,
        },
      });
    },
    // 获取驳回后修改页面的流程按钮和审批人
    * getApprovalInfoForUpdate({ payload = {} }, { call, put }) {
      const response = yield call(api.getButtonList, payload);
      yield put({
        type: 'getApprovalInfoForUpdateSuccess',
        payload: response,
      });
    },
    // 提交前校验数据
    * validateData({ payload }, { call, put }) {
      yield put({
        type: 'validateDataSuccess',
        payload: { isValid: false },
      });
      const { resultData } = yield call(api.validateData, payload);
      yield put({
        type: 'validateDataSuccess',
        payload: resultData,
      });
    },
    // “是否办理股票质押回购业务“选“否”时，新建提交后不需走审批流程，直接调这个接口
    * chgCustRelaiton({ payload }, { call }) {
      yield call(api.chgCustRelaiton, payload);
    },
    // “是否办理股票质押回购业务“选“是”时，提交申请接口，调完之后还需要走审批流程
    * submitApply({ payload }, { call, put }) {
      yield put({
        type: 'submitApplySuccess',
        payload: '',
      });
      const { resultData } = yield call(api.saveApplication, payload);
      yield put({
        type: 'submitApplySuccess',
        payload: resultData,
      });
    },
    // 走流程
    * doApproveFlow({ payload }, { call, put }) {
      yield put({
        type: 'doApproveFlowSuccess',
        payload: '',
      });
      const { resultData } = yield call(api.doApprove, payload);
      yield put({
        type: 'doApproveFlowSuccess',
        payload: resultData.msg,
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
