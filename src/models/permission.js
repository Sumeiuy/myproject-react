/**
 * @file models/premissinon.js
 * @author honggaungqing
 */
import { permission as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'permission',
  state: {
    detailMessage: EMPTY_OBJECT, // 详情
    childTypeList: EMPTY_LIST, // 子类型
    hasServerPersonList: EMPTY_LIST, // 已有服务人员列表
    searchServerPersonList: EMPTY_LIST, // 可查询服务人员列表
    nextApproverList: EMPTY_LIST, // 按照条件查询下一审批人列表
    bottonList: EMPTY_LIST, // 按钮组
    modifyCustApplication: EMPTY_OBJECT, // 获取修改私密客户申请 的结果
  },
  reducers: {
    getDetailMessageSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailMessage: resultData,
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
    getChildTypeListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { childList = EMPTY_LIST } = resultData;

      return {
        ...state,
        childTypeList: childList,
      };
    },
    getHasServerPersonListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        hasServerPersonList: resultData,
      };
    },
    getNextApproverListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        nextApproverList: resultData,
      };
    },
    getBottonListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        bottonList: resultData,
      };
    },
    getModifyCustApplicationSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        modifyCustApplication: resultData,
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
    * getSearchServerPersonList({ payload }, { call, put }) {
      const response = yield call(api.getSearchServerPersonelList, payload);
      yield put({
        type: 'getSearchServerPersonListSuccess',
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
    * getHasServerPersonList({ payload }, { call, put }) {
      const response = yield call(api.getHasServerPersonList, payload);
      yield put({
        type: 'getHasServerPersonListSuccess',
        payload: response,
      });
    },
    * getNextApproverList({ payload }, { call, put }) {
      const response = yield call(api.getNextApproverList, payload);
      yield put({
        type: 'getNextApproverListSuccess',
        payload: response,
      });
    },
    * getBottonList({ payload }, { call, put }) {
      const response = yield call(api.getButtonList, payload);
      yield put({
        type: 'getBottonListSuccess',
        payload: response,
      });
    },
    * getModifyCustApplication({ payload }, { call, put }) {
      const response = yield call(api.getModifyCustApplication, payload);
      yield put({
        type: 'getModifyCustApplicationSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
