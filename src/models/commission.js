/**
 * @file models/report.js
 * @author sunweibin
 */
import { commission as api, seibel as seibelApi } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'commission',
  state: {
    // 新建佣金目标产品测试
    productList: [],
    // 批量佣金左侧列表
    list: {},
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
    // 可选部门组织机构树
    custRange: [],
  },
  reducers: {

    getProductList(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        productList: resultData,
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
      const response = yield call(api.queryProduct, payload);
      yield put({
        type: 'getProductList',
        payload: response,
      });
    },

    // 批量佣金Home列表
    * getCommissionList({ payload }, { call, put }) {
      const listResponse = yield call(seibelApi.getSeibleList, payload);
      yield put({
        type: 'getCommissionListSuccess',
        payload: listResponse,
      });
      const appList = listResponse.resultData.applicationBaseInfoList;
      if (Array.isArray(appList) && appList.length) {
        yield put({
          type: 'getCommissionDetail',
          payload: { batchNum: appList[0].bussiness1 },
        });
      }
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

    // 根据用户输入的关键字，来查询可选的客户列表
    * searchCustList({ payload }, { call, put }) {
      const custResponse = yield call(seibelApi.getCustList, payload);
      yield put({
        type: 'searchCustListSuccess',
        payload: custResponse,
      });
    },

    // 根据用户输入的关键字，来查询可选的拟稿人列表
    * searchDrafterList({ payload }, { call, put }) {
      const drafterResponse = yield call(seibelApi.getDrafterList, payload);
      yield put({
        type: 'searchDrafterListSuccess',
        payload: drafterResponse,
      });
    },

    // 组织结构树
    * getCustRange({ payload }, { call, put }) {
      const response = yield call(seibelApi.getEmpOrgTree, payload);
      yield put({
        type: 'getCustRangeSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
