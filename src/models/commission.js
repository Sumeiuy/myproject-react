/**
 * @file models/report.js
 * @author sunweibin
 */
import _ from 'lodash';
import { commission as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'commission',
  state: {
    // 查询到的目标产品列表
    productList: [],
    // 审批人员列表
    approvalUserList: [],
    // 批量佣金右侧详情
    detail: {},
    // 单个用户的审批记录
    approvalRecord: {},
    // 查询审批记录流程状态
    recordLoading: false,
    // 筛选的客户列表
    filterCustList: [],
    // 筛选的拟稿人列表
    filterDrafterList: [],
    // 校验进程
    validataLoading: false,
    // 检验结果
    validateResult: '',
  },
  reducers: {
    getProductListSuccess(state, action) {
      const { payload: { resultData } } = action;
      let list = [];
      if (!_.isEmpty(resultData)) {
        list = resultData;
      }
      return {
        ...state,
        productList: list,
      };
    },

    getCommissionListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { page = EMPTY_OBJECT, applicationBaseInfoList = EMPTY_LIST } = resultData;

      return {
        ...state,
        list: {
          page,
          resultData: applicationBaseInfoList,
        },
      };
    },

    getCommissionDetailSuccess(state, action) {
      const { payload: { detailRes, custListRes } } = action;
      const detailResult = detailRes.resultData;
      const listResult = custListRes.resultData;
      return {
        ...state,
        detail: {
          ...detailResult,
          custList: listResult,
        },
      };
    },

    getApprovalRecordsSuccess(state, action) {
      const { payload: { recordResponse, cust } } = action;
      return {
        ...state,
        approvalRecord: {
          cust,
          approval: recordResponse.resultData,
        },
      };
    },

    getAprovalUserListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        approvalUserList: resultData.employList,
      };
    },

    searchCustListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        filterCustList: resultData.custList,
      };
    },

    searchDrafterListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        filterDrafterList: resultData.empList,
      };
    },

    validateCustInfoSuccess(state, action) {
      const { payload: { msg } } = action;
      return {
        ...state,
        validateResult: msg,
      };
    },

    opertateState(state, action) {
      const { payload: { name, value } } = action;
      return {
        ...state,
        [name]: value,
      };
    },
  },
  effects: {
    // 新建批量佣金调整用户选择的目标产品列表
    * getProductList({ payload }, { call, put }) {
      const response = yield call(api.queryProductList, payload);
      yield put({
        type: 'getProductListSuccess',
        payload: response,
      });
    },

    // 批量佣金调整Home的右侧详情
    * getCommissionDetail({ payload }, { call, put }) {
      const detailRes = yield call(api.getCommissionDetail, { type: 'BatchProcess', ...payload });
      const custListRes = yield call(api.getCommissionDetailCustList, {
        batchNum: payload.batchNum,
      });
      yield put({
        type: 'getCommissionDetailSuccess',
        payload: { detailRes, custListRes },
      });
    },

    // 批量佣金调整详情页面中单个客户的审批记录
    * getApprovalRecords({ payload }, { call, put }) {
      yield put({
        type: 'opertateState',
        payload: {
          name: 'recordLoading',
          value: true,
          message: '开始查询审批记录',
        },
      });
      const { flowCode, loginuser, ...reset } = payload;
      const recordResponse = yield call(api.querySingleCustApprovalRecord, { flowCode, loginuser });
      yield put({
        type: 'getApprovalRecordsSuccess',
        payload: { recordResponse, cust: reset },
      });
      yield put({
        type: 'opertateState',
        payload: {
          name: 'recordLoading',
          value: false,
          message: '查询审批记录结束',
        },
      });
    },

    // 获取审批人员列表
    * getAprovalUserList({ payload }, { call, put }) {
      const response = yield call(api.queryAprovalUserList, payload);
      yield put({
        type: 'getAprovalUserListSuccess',
        payload: response,
      });
    },

    // 校验客户信息
    * validateCustInfo({ payload }, { call, put }) {
      yield put({
        type: 'opertateState',
        payload: {
          name: 'validataLoading',
          value: true,
          message: '开始校验',
        },
      });
      const response = yield call(api.validateCustInfo, payload);
      yield put({
        type: 'validateCustInfoSuccess',
        payload: response,
      });
      yield put({
        type: 'opertateState',
        payload: {
          name: 'validataLoading',
          value: false,
          message: '结束校验',
        },
      });
    },
  },
  subscriptions: {},
};
