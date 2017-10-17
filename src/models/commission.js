/**
 * @file models/report.js
 * @author sunweibin
 */
import _ from 'lodash';
import { commission as api, seibel as seibelApi } from '../api';

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
    // 咨询订阅详情
    subscribeDetail: {},
    // 单个用户的审批记录
    approvalRecord: {},
    // 查询审批记录流程状态
    recordLoading: false,
    // 筛选的已申请客户列表
    filterCustList: [],
    // 筛选的拟稿人列表
    filterDrafterList: [],
    // 校验进程
    validataLoading: false,
    // 检验结果
    validateResult: '',
    // 筛选的可申请客户列表
    canApplyCustList: [],
    // 提交批量佣金调整申请后的BatchNum
    batchnum: '',
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

    getSubscribeDetailSuccess(state, action) {
      const { payload: { detailRes, attachmentRes, approvalRes } } = action;
      const detailResult = detailRes.resultData;
      const attachmentResult = attachmentRes.resultData;
      const approvalResult = approvalRes.resultData;
      return {
        ...state,
        subscribeDetail: {
          base: detailResult,
          attachmentList: attachmentResult,
          approvalHistory: approvalResult,
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

    validateCustInfoSuccess(state, action) {
      const { payload: { msg } } = action;
      return {
        ...state,
        validateResult: msg,
      };
    },

    getCanApplyCustListSuccess(state, action) {
      const { payload: { resultData } } = action;
      let canApplyCustList = [];
      if (resultData && !_.isEmpty(resultData.custList)) {
        canApplyCustList = resultData.custList;
      }
      return {
        ...state,
        canApplyCustList,
      };
    },

    submitBatchSuccess(state, action) {
      const { payload: { resultData } } = action;
      let batchnum = 'fail';
      if (resultData && resultData.batchnum) {
        batchnum = resultData.batchnum;
      }
      return {
        ...state,
        batchnum,
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
      console.warn('getCommissionDetail', payload);
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
      const recordResponse = yield call(api.querySingleCustApprovalRecord, {
        flowCode,
        loginuser,
      });
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

    // 筛选可申请的客户列表
    * getCanApplyCustList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getCanApplyCustList, payload);
      yield put({
        type: 'getCanApplyCustListSuccess',
        payload: response,
      });
    },

    // 提交批量佣金调整申请
    * submitBatchCommission({ payload }, { call, put }) {
      const response = yield call(api.submitBatchCommission, payload);
      yield put({
        type: 'submitBatchSuccess',
        payload: response,
      });
    },

    // 查询咨询订阅详情数据
    * getSubscribeDetail({ payload }, { call, put }) {
      const detailRes = yield call(api.queryConsultSubscribeDetail,
        {
          action: 'query',
          applyType: 'Internal',
          operationType: 'SP Purchase',
          ...payload,
        });
      // 通过查询到的详情数据的attachmentNum获取附件信息
      const detailRD = detailRes.resultData;
      const attachmentRes = yield call(api.getAttachment, { attachment: detailRD.attachmentNum });
      const approvalRes = yield call(api.querySingleCustApprovalRecord, {
        flowCode: detailRD.flowCode,
      });
      // TODO 还差一个当前审批步骤的接口
      yield put({
        type: 'getSubscribeDetailSuccess',
        payload: { detailRes, attachmentRes, approvalRes },
      });
    },
  },
  subscriptions: {},
};
