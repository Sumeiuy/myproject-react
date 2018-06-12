/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系信息申请models
 * @Date: 2018-06-08 13:17:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-12 10:28:09
 */


import { custRelationships as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
export default {
  namespace: 'custRelationships',
  state: {
    // 手机申请页面-右侧详情
    detailInfo: EMPTY_OBJECT,
    // 附件列表
    attachmentList: EMPTY_LIST,
    // 可进行关联关系申请的客户列表
    custList: [],
    // 用户选中的客户基本信息
    custDetail: {},
    // 关联关系树
    relationshipTree: [],
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
    // 获取关联关系树
    * getRelationshipTree({ payload }, { call, put }) {
      const response = yield call(api.getRelationshipTree, payload);
      yield put({
        type: 'getRelationshipTreeSuccess',
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
