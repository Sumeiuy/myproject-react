/**
 * @file models/developRelationship.js
 * @author honggaungqing
 */

import { message } from 'antd';
import { developRelationship as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const CREATREPEATCODE = '-2'; // 客户正在处理中不能重复处理

export default {
  namespace: 'developRelationship',
  state: {
    detailInfo: EMPTY_OBJECT, // 详情
    createDevelopRelationship: EMPTY_OBJECT, // 获取创建开发关系认定申请的结果
    createCustList: EMPTY_LIST, // 查询可申请开发关系认定的客户
    isValidCust: EMPTY_OBJECT, // 查询可申请开发关系认定的客户是否可用
    oldDevelopTeamList: EMPTY_LIST, // 原开发团队
    addEmpList: EMPTY_LIST, // 查询可添加新开发团队服务经理的接口
    buttonList: EMPTY_OBJECT, // 获取按钮列表和下一步审批人
  },
  reducers: {
    getDetailInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },
    getCreateDevelopRelationshipSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        createDevelopRelationship: resultData,
      };
    },
    getCreateCustListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { custList = EMPTY_LIST } = resultData;
      return {
        ...state,
        createCustList: custList,
      };
    },
    getIsValidCustSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      console.warn('resultData', resultData);
      return {
        ...state,
        isValidCust: resultData,
      };
    },
    getOldDevelopTeamListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        oldDevelopTeamList: resultData,
      };
    },
    getAddEmpListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        addEmpList: resultData,
      };
    },
    getButtonListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        buttonList: resultData,
      };
    },

  },
  effects: {
    // 右侧详情
    * getDetailInfo({ payload }, { call, put }) {
      const response = yield call(api.getDetailInfo, payload);
      yield put({
        type: 'getDetailInfoSuccess',
        payload: response,
      });
    },
    // 新建开发关系认定
    * getCreateDevelopRelationship({ payload }, { call, put }) {
      const response = yield call(api.createDevelopRelationship, payload);
      const code = response.code;
      const msg = response.msg;
      if (code === CREATREPEATCODE) {
        message.error(msg);
      } else {
        yield put({
          type: 'getCreateDevelopRelationshipSuccess',
          payload: response,
        });
        message.success('私密客户创建成功！');
      }
    },
    // 查询可申请开发关系认定的客户
    * getCreateCustList({ payload }, { call, put }) {
      const response = yield call(api.getCreateCust, payload);
      yield put({
        type: 'getCreateCustListSuccess',
        payload: response,
      });
    },
    // 查询可申请开发关系认定的客户是否可用
    * getIsValidCust({ payload }, { call, put }) {
      const response = yield call(api.isValidCust, payload);
      yield put({
        type: 'getIsValidCustSuccess',
        payload: response,
      });
    },
    // 查询新建时原开发团队
    * getOldDevelopTeamList({ payload }, { call, put }) {
      const response = yield call(api.getOldDevelopTeamList, payload);
      yield put({
        type: 'getOldDevelopTeamListSuccess',
        payload: response,
      });
    },
    // 查询可添加新开发团队服务经理的接口
    * getAddEmpList({ payload }, { call, put }) {
      const response = yield call(api.getAddEmpList, payload);
      yield put({
        type: 'getAddEmpListSuccess',
        payload: response,
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
  },
  subscriptions: {},
};
