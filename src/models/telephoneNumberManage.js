/**
 * @file models/taskFeedback.js
 *  任务反馈 store
 * @author Wangjunjun
 */

import { telephoneNumberManage as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
export default {
  namespace: 'telephoneNumberManage',
  state: {
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
    // 新建页面-获取下一步审批人
    nextApprovalData: EMPTY_LIST,
    // 附件列表
    attachmentList: EMPTY_LIST,
  },
  reducers: {
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
        custRange = resultData;
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
      const { payload: { resultData = EMPTY_LIST } } = action;
      console.warn('resultData', resultData);
      return {
        ...state,
        advisorListData: resultData,
      };
    },
    // 新建页面-获取下一步审批人
    queryNextApprovalSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        nextApprovalData: resultData,
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
  },
  effects: {
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
    // 获取新建页面-获取下一步审批人
    * queryNextApproval({ payload }, { call, put }) {
      const response = yield call(api.queryNextApproval, payload);
      yield put({
        type: 'queryNextApprovalSuccess',
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
  },
  subscriptions: {
  },
};
