/* eslint-disable import/no-anonymous-default-export */
/**
 * @file models/telephoneNumberManage.js
 *   手机分配和申请模块store
 * @author hongguangqing
 */

import { telephoneNumberManage as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
export default {
  namespace: 'telephoneNumberManage',
  state: {
    // 电话拨号信息
    config: {},
    // 投顾手机分配页面筛选-服务经理列表
    empList: EMPTY_LIST,
    // 投顾手机分配页面筛选-部门组织机构树
    custRange: EMPTY_LIST,
    // 投顾手机分配页面表格列表数据
    advisorBindListData: EMPTY_OBJECT,
    // 手机申请页面-右侧详情
    detailInfo: EMPTY_OBJECT,
    // 申请详情页面的服务经理表格的数据
    empAppBindingList: EMPTY_OBJECT,
    // 新建页面-投顾查询列表
    advisorListData: EMPTY_OBJECT,
    // 附件列表
    attachmentList: EMPTY_LIST,
    // 批量投顾查询列表
    batchAdvisorListData: EMPTY_OBJECT,
    // 新建修改的更新接口
    updateBindingFlowAppId: '',
    // 按钮组
    buttonList: {},
    // 验证提交数据结果
    validateResultData: {},
  },
  reducers: {
    // 获取电话拨号信息成功
    getConfigSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        config: resultData,
      };
    },
    // 投顾手机分配页面筛选-服务经理列表
    queryEmpListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      // 当 resultData 为null时，不会启用 resultData 的默认值的。此处要在用使用时写成 resultData || EMPTY_LIST
      const { servicePeopleList = EMPTY_LIST } = resultData || EMPTY_LIST;
      return {
        ...state,
        empList: servicePeopleList,
      };
    },
    // 投顾手机分配页面筛选-部门组织机构树
    getCustRangeSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      let custRange;
      if (resultData.level === '1') {
        custRange = [
          { id: resultData.id, name: resultData.name, level: resultData.level },
          ...resultData.children,
        ];
      } else {
        custRange = [resultData];
      }
      return {
        ...state,
        custRange,
      };
    },
    // 投顾手机分配页面表格列表数据
    queryAdvisorBindListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        advisorBindListData: resultData,
      };
    },
    // 手机申请页面-右侧详情
    getDetailInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },
    // 申请详情页面的服务经理表格数据
    queryEmpAppBindingListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        empAppBindingList: resultData,
      };
    },
    // 新建页面-投顾查询列表
    queryAdvisorListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        advisorListData: resultData,
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
    // 批量投顾查询列表
    queryBatchAdvisorListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        batchAdvisorListData: resultData,
      };
    },
    // 新建修改的更新接口
    updateBindingFlowSuccess(state, action) {
      const { payload: { resultData = '' } } = action;
      return {
        ...state,
        updateBindingFlowAppId: resultData,
      };
    },
    // 清除数据
    clearPropsSuccess(state) {
      return {
        ...state,
        advisorListData: EMPTY_OBJECT,
        nextApprovalData: EMPTY_LIST,
        batchAdvisorListData: EMPTY_OBJECT,
      };
    },
    // 获取按钮信息
    getButtonListSuccess(state, action) {
      const { payload: { resultData = [] } } = action;
      return {
        ...state,
        buttonList: resultData,
      };
    },
    // 验证提交数据结果
    validateDataSuccess(state, action) {
      const { payload: { resultData = [] } } = action;
      return {
        ...state,
        validateResultData: resultData,
      };
    },
  },
  effects: {
    // 获取电话拨号信息
    * getConfig({ payload }, { call, put }) {
      const response = yield call(api.queryPhoneInfo, payload);
      yield put({
        type: 'getConfigSuccess',
        payload: response,
      });
    },
    // 获取服务经理
    * queryEmpList({ payload }, { call, put }) {
      const response = yield call(api.queryEmpList, payload);
      yield put({
        type: 'queryEmpListSuccess',
        payload: response,
      });
    },
    // 获取组织机构数
    * getCustRange({ payload }, { call, put }) {
      const response = yield call(api.getCustRange, payload);
      yield put({
        type: 'getCustRangeSuccess',
        payload: response,
      });
    },
    // 投顾手机分配页面表格列表数据
    * queryAdvisorBindList({ payload }, { call, put }) {
      const response = yield call(api.queryAdvisorBindList, payload);
      yield put({
        type: 'queryAdvisorBindListSuccess',
        payload: response,
      });
    },
    // 手机申请页面-右侧详情
    * getDetailInfo({ payload }, { call, put }) {
      const response = yield call(api.getDetailInfo, payload);
      yield put({
        type: 'getDetailInfoSuccess',
        payload: response,
      });
    },
    // 获取申请详情页面的服务经理表格数据
    * queryEmpAppBindingList({ payload }, { call, put }) {
      const response = yield call(api.queryEmpAppBinding, payload);
      yield put({
        type: 'queryEmpAppBindingListSuccess',
        payload: response,
      });
    },
    // 获取新建页面-投顾查询列表
    * queryAdvisorList({ payload }, { call, put }) {
      const response = yield call(api.queryAdvisorList, payload);
      yield put({
        type: 'queryAdvisorListSuccess',
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
    // 批量投顾查询列表
    * queryBatchAdvisorList({ payload }, { call, put }) {
      const response = yield call(api.queryAdvisorList, payload);
      yield put({
        type: 'queryBatchAdvisorListSuccess',
        payload: response,
      });
    },
    // 更新接口
    * updateBindingFlow({ payload }, { call, put }) {
      const response = yield call(api.updateBindingFlow, payload);
      yield put({
        type: 'updateBindingFlowSuccess',
        payload: response,
      });
    },
    // 走流程接口
    * doApprove({ payload }, { call }) {
      yield call(api.doApprove, payload);
    },
    // 清除数据
    * clearProps({ payload }, { put }) {
      yield put({
        type: 'clearPropsSuccess',
        payload: [],
      });
    },
    // 获取按钮列表和下一步审批人
    * getButtonList({ payload }, { call, put }) {
      const response = yield call(api.getButtonList, payload);
      yield put({
        type: 'getButtonListSuccess',
        payload: response,
      });
    },
    // 验证提交数据接口
    * validateData({ payload }, { call, put }) {
      const response = yield call(api.validateData, payload);
      yield put({
        type: 'validateDataSuccess',
        payload: response,
      });
    },
    // 删除绑定的服务经理
    * deleteBindingAdvisor({ payload }, { call }) {
      yield call(api.deleteBindingAdvisor, payload);
    },
  },
  subscriptions: {
  },
};
