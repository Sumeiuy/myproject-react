/**
 * @file models/premissinon.js
 * @author honggaungqing
 */
import { permission as api, seibel as seibelApi } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'permission',
  state: {
    detailMessage: EMPTY_OBJECT, // 详情
    list: EMPTY_OBJECT,
    // searchServerPersonList: EMPTY_LIST, // 服务人员列表
    drafterList: EMPTY_LIST, // 拟稿人
    custRange: EMPTY_LIST, // 部门
    childTypeList: EMPTY_LIST, // 子类型
    customerList: EMPTY_LIST, // 客户列表
    hasServerPersonList: EMPTY_LIST, // 已有服务人员列表
    searchServerPersonList: EMPTY_LIST, // 可查询服务人员列表
  },
  reducers: {
    getDetailMessageSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailMessage: resultData,
      };
    },
    getPermissionListSuccess(state, action) {
      const { payload: { resultData } } = action;
      let applist = [];
      let page = {};
      if (resultData) {
        applist = resultData.applicationBaseInfoList;
        page = resultData.page;
      }
      return {
        ...state,
        list: {
          page,
          resultData: applist,
        },
      };
    },
    getSearchServerPersonListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { servicePeopleList = EMPTY_LIST } = resultData;
      return {
        ...state,
        searchServerPersonList: servicePeopleList,
      };
    },
    getDrafterListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { empList = EMPTY_LIST } = resultData;

      return {
        ...state,
        drafterList: empList,
      };
    },
    getEmpOrgTreeSuccess(state, action) {
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
    getChildTypeListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { childList = EMPTY_LIST } = resultData;

      return {
        ...state,
        childTypeList: childList,
      };
    },
    getCustomerListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { custList = EMPTY_LIST } = resultData;
      return {
        ...state,
        customerList: custList,
      };
    },
    getHasServerPersonListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        hasServerPersonList: resultData,
      };
    },
  },
  effects: {
    * getDetailMessage({ payload }, { call, put }) {
      const response = yield call(api.getMessage, payload);
      yield put({
        type: 'getDetailMessageSuccess',
        payload: response,
      });
    },
    * getPermissionList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getSeibleList, payload);
      yield put({
        type: 'getPermissionListSuccess',
        payload: response,
      });
      const result = response.resultData && response.resultData.applicationBaseInfoList;
      if (Array.isArray(result) && result.length) {
        const detailList = yield call(api.getMessage, {
          id: result[0].id,
          type: '01',
        });
        yield put({
          type: 'getDetailMessageSuccess',
          payload: detailList,
        });
      }
    },
    * getSearchServerPersonList({ payload }, { call, put }) {
      const response = yield call(api.getSearchServerPersonelList, payload);
      yield put({
        type: 'getSearchServerPersonListSuccess',
        payload: response,
      });
    },
    * getDrafterList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getDrafterList, payload);
      yield put({
        type: 'getDrafterListSuccess',
        payload: response,
      });
    },
    * getEmpOrgTree({ payload }, { call, put }) {
      const response = yield call(seibelApi.getEmpOrgTree, payload);
      yield put({
        type: 'getEmpOrgTreeSuccess',
        payload: response,
      });
    },
    * getChildTypeList({ payload }, { call, put }) {
      const response = yield call(api.getChildTypeList, payload);
      yield put({
        type: 'getChildTypeListSuccess',
        payload: response,
      });
    },
    * getCustomerList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getCustList, payload);
      yield put({
        type: 'getCustomerListSuccess',
        payload: response,
      });
    },
    * getHasServerPersonList({ payload }, { call, put }) {
      const response = yield call(api.getHasServerPersonList, payload);
      yield put({
        type: 'getHasServerPersonListSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
