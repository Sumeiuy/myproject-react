/**
 * @file models/commissionChange.js
 * @author baojiajia
 */
import _ from 'lodash';
import { commission as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'commissionChange',
  state: {
    // 审批人员列表
    approvalUserList: [],
    // 驳回后修改的单佣金调整详情
    singleDetailToChange: {},
    // 咨询订阅详情
    subscribeDetailToChange: {},
    // 资讯退订详情
    unsubscribeDetailToChange: {},
    // 单佣金目标股基佣金率码值列表
    singleGJCommission: [],
    // 资讯订阅可供用户订阅的产品
    consultSubProductList: [],
    // 资讯退订中用户可退订的服务
    consultUnsubProductList: [],
    // 新增资讯订阅申请的orderId
    consultSubId: '',
    // 新增资讯退订申请的orderId
    consultUnsubId: '',
    // 单佣金调整中的其他佣金费率的选项列表
    singleOtherCommissionOptions: [],
    // 咨询订阅、咨询退订调整页面客户查询列表
    subscribeCustomerList: [],
    // 单佣金调整中的可选产品列表
    singleComProductList: [],
    // 产品三匹配信息
    threeMatchInfo: {},
    // 新建咨讯订阅可选产品列表
    subscribelProList: [],
    // 新建咨讯退订可选产品列表
    unSubscribelProList: [],
    // 单佣金调整申请成功
    singleSubmit: '',
    // 单佣金调整页面客户查询列表
    singleCustomerList: {},
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

    getSingleDetailToChangeSuccess(state, action) {
      const { payload: { detailRes, attachmentRes, approvalListRes } } = action;
      const baseRD = detailRes.resultData;
      const attachmentResult = attachmentRes.resultData;
      const approvalRD = approvalListRes.resultData && approvalListRes.resultData.employList;
      return {
        ...state,
        singleDetailToChange: {
          base: baseRD,
          attachmentList: attachmentResult,
          approvalList: approvalRD,
        },
      };
    },

    getSubscribeDetailToChangeSuccess(state, action) {
      const { payload: { detailRes, attachmentRes } } = action;
      const detailResult = detailRes.resultData;
      const attachmentResult = attachmentRes.resultData;
      return {
        ...state,
        subscribeDetailToChange: {
          base: detailResult,
          attachmentList: attachmentResult,
        },
      };
    },

    getUnSubscribeDetailToChangeSuccess(state, action) {
      const { payload: { detailRes, attachmentRes } } = action;
      const detailResult = detailRes.resultData;
      const attachmentResult = attachmentRes.resultData;
      return {
        ...state,
        unsubscribeDetailToChange: {
          base: detailResult,
          attachmentList: attachmentResult,
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

    getGJCommissionRateSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        gjCommission: resultData || [],
      };
    },

    getSingleGJCommissionRateSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        singleGJCommission: resultData || [],
      };
    },

    getSubscribeProductListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        consultSubProductList: resultData,
      };
    },

    getUnSubscribeProductListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        consultUnsubProductList: resultData,
      };
    },

    submitConsultSubscribeSuccess(state, action) {
      const { payload: { resultData } } = action;
      const orderId = resultData && resultData.orderId;
      return {
        ...state,
        consultSubId: orderId,
      };
    },

    submitConsultUnSubscribeSuccess(state, action) {
      const { payload: { resultData } } = action;
      const orderId = resultData && resultData.orderId;
      return {
        ...state,
        consultUnsubId: orderId,
      };
    },

    submitSingleCommissionSuccess(state, action) {
      const { payload: { resultData } } = action;
      const singleSubmit = resultData && resultData.id;
      return {
        ...state,
        singleSubmit,
      };
    },

    getOtherCommissionOptionsSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        singleOtherCommissionOptions: resultData,
      };
    },

    getSingleCustListSuccess(state, action) {
      const { payload: { resultData } } = action;
      let list = [];
      if (!_.isEmpty(resultData)) {
        list = resultData.custInfos;
      }
      return {
        ...state,
        singleCustomerList: list[0] || {},
      };
    },

    getSubscribelCustListSuccess(state, action) {
      const { payload: { resultData } } = action;
      let list = [];
      if (!_.isEmpty(resultData)) {
        list = resultData;
      }
      return {
        ...state,
        subscribeCustomerList: list,
      };
    },

    getSingleComProductListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        singleComProductList: resultData,
      };
    },

    getSubscribelProListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        subscribelProList: resultData,
      };
    },

    getUnSubscribelProListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        unSubscribelProList: resultData,
      };
    },

    queryThreeMatchInfoSuccess(state, action) {
      const { payload: { response, prdCode } } = action;
      const resultData = response.resultData || {};
      return {
        ...state,
        threeMatchInfo: { ...resultData, productCode: prdCode },
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
    // 获取审批人员列表
    * getAprovalUserList({ payload }, { call, put }) {
      const response = yield call(api.queryAprovalUserList, payload);
      yield put({
        type: 'getAprovalUserListSuccess',
        payload: response,
      });
    },

    // 提交单佣金调整申请
    * submitSingleCommission({ payload }, { call, put }) {
      const submitRes = yield call(api.submitSingleCommission, payload);
      yield put({
        type: 'submitSingleCommissionSuccess',
        payload: submitRes,
      });
    },

    // 查询单佣金目标股基佣金率码值
    * getSingleGJCommissionRate({ payload }, { call, put }) {
      const singleRes = yield call(api.querySingleGJCommissionRate, payload);
      yield put({
        type: 'getSingleGJCommissionRateSuccess',
        payload: singleRes,
      });
    },

    // 驳回后修改单佣金调整详情数据
    * getSingleDetailToChange({ payload }, { call, put, select }) {
      const { empInfo } = yield select(state => state.app.empInfo);
      const { flowCode } = payload;
      // 查询驳回后单佣金调整的详情基本数据
      const detailRes = yield call(api.querySingleDetail, {
        flowCode,
      });
      const detailRD = detailRes.resultData;
      // 获取客户信息
      const customerRes = yield call(api.querySingleCustomer, {
        keywords: detailRD.custNum,
        postionId: empInfo.postnId,
        deptCode: empInfo.occDivnNum,
      });
      yield put({
        type: 'getSingleCustListSuccess',
        payload: customerRes,
      });
      const customerRD = customerRes.resultData.custInfos[0];
      // 获取目前目标股基佣金率下的可选产品
      yield put({
        type: 'getSingleComProductList',
        payload: {
          custRowId: customerRD.id,
          commRate: detailRD.newCommission,
        },
      });
      // 获取当前用户的其他佣金率选项
      yield put({
        type: 'getSingleOtherCommissionOptions',
        payload: {
          custRowId: customerRD.id,
        },
      });
      // 查询附件信息
      const attachmentRes = yield call(api.getAttachment, { attachment: detailRD.attachmentNum });
      // 查询当前审批人列表
      const approvalListRes = yield call(api.queryAprovalUserList, {
        loginUser: empInfo.empNum,
        btnId: '130000', // 该参数为单佣金查询审批人的固定参数
      });
      yield put({
        type: 'getSingleDetailToChangeSuccess',
        payload: { detailRes, attachmentRes, approvalListRes },
      });
    },

    // 驳回后修改查询咨询订阅详情数据
    * getSubscribeDetailToChange({ payload }, { call, put }) {
      const { flowCode, custType } = payload;
      const detailRes = yield call(api.queryConsultDetail,
        {
          action: 'query',
          operationType: 'subscribe',
          workFlowNumber: flowCode,
          type: custType,
        });
      // 通过查询到的详情数据的attachmentNum获取附件信息
      const detailRD = detailRes.resultData;
      const attachmentRes = yield call(api.getAttachment, { attachment: detailRD.attachmentNum });
      yield put({
        type: 'getSubscribeDetailToChangeSuccess',
        payload: { detailRes, attachmentRes },
      });
    },

    // 驳回后修改查询咨询退订详情数据
    * getUnSubscribeDetailToChange({ payload }, { call, put }) {
      const { flowCode, custType } = payload;
      const detailRes = yield call(api.queryConsultDetail,
        {
          action: 'query',
          operationType: 'unsubscribe',
          workFlowNumber: flowCode,
          type: custType,
        });
      // 通过查询到的详情数据的attachmentNum获取附件信息
      const detailRD = detailRes.resultData;
      const attachmentRes = yield call(api.getAttachment, { attachment: detailRD.attachmentNum });
      yield put({
        type: 'getUnSubscribeDetailToChangeSuccess',
        payload: { detailRes, attachmentRes },
      });
    },

    // 查询资讯订阅产品列表
    * getSubscribeProductList({ payload }, { call, put }) {
      const response = yield call(api.queryConsultSubscribeProductList, payload);
      yield put({
        type: 'getSubscribeProductListSuccess',
        payload: response,
      });
    },

    // 查询资讯退订中的可退订产品列表
    * getUnSubscribeProductList({ payload }, { call, put }) {
      const response = yield call(api.queryConsultUnSubProductList, payload);
      yield put({
        type: 'getUnSubscribeProductListSuccess',
        payload: response,
      });
    },

    // 新增资讯订阅申请
    * submitConsultSubscribe({ payload }, { call, put }) {
      const response = yield call(api.newConsultApply, {
        action: 'new',
        operationType: 'subscribe',
        ...payload,
      });
      yield put({
        type: 'submitConsultSubscribeSuccess',
        payload: response,
      });
    },

     // 新增资讯退订申请
    * submitConsultUnSubscribe({ payload }, { call, put }) {
      const response = yield call(api.newConsultApply, {
        action: 'new',
        operationType: 'unsubscribe',
        ...payload,
      });
      yield put({
        type: 'submitConsultUnSubscribeSuccess',
        payload: response,
      });
    },

    // 单佣金调整页面客户查询列表
    * getSingleCustList({ payload }, { call, put }) {
      const response = yield call(api.querySingleCustomer, payload);
      yield put({
        type: 'getSingleCustListSuccess',
        payload: response,
      });
    },

    // 查询单佣金调整中的其他佣金费率选项
    * getSingleOtherCommissionOptions({ payload }, { call, put }) {
      const response = yield call(api.queryOtherCommissionOptions, payload);
      yield put({
        type: 'getOtherCommissionOptionsSuccess',
        payload: response,
      });
    },

    // 查询单佣金调整中的可选产品列表
    * getSingleComProductList({ payload }, { call, put }) {
      const response = yield call(api.querySingleCommissionProductList, payload);
      yield put({
        type: 'getSingleComProductListSuccess',
        payload: response,
      });
    },
    // 查询产品与客户的三匹配信息
    * queryThreeMatchInfo({ payload }, { call, put }) {
      const response = yield call(api.queryThreeMatchInfo, payload);
      const { prdCode } = payload;
      yield put({
        type: 'queryThreeMatchInfoSuccess',
        payload: { response, prdCode },
      });
    },
    // 查询咨讯订阅中的可选产品列表
    * getSubscribelProList({ payload }, { call, put }) {
      const response = yield call(api.queryConsultSubscribeProductList, payload);
      yield put({
        type: 'getSubscribelProListSuccess',
        payload: response,
      });
    },
    // 查询咨讯退订中的可选产品列表
    * getUnSubscribelProList({ payload }, { call, put }) {
      const response = yield call(api.queryConsultUnSubProductList, payload);
      yield put({
        type: 'getUnSubscribelProListSuccess',
        payload: response,
      });
    },
    // 清空在redux中保存的查询结果
    * clearReduxState({ payload }, { put }) {
      const { clearList } = payload;
      for (let i = 0; i < clearList.length; i++) {
        const { name, value = [] } = clearList[i];
        yield put({
          type: 'opertateState',
          payload: {
            name,
            value,
          },
        });
      }
    },
  },
  subscriptions: {},
};
