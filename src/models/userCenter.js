/* eslint-disable import/no-anonymous-default-export */
/**
 * @Description: 用户中心模块model
 * @Author: xiaZhiQiang
 * @Date: 2018-04-11 14:50:50
 */

import { userCenter as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'userCenter',
  state: {
    userBaseInfo: EMPTY_OBJECT,
    allLabels: EMPTY_LIST,
    LabelAndDescApprover: EMPTY_LIST,
    approvalInfo: EMPTY_OBJECT,
    userInfoForm: EMPTY_OBJECT,
  },
  reducers: {
    queryEmpInfoSuccess(state, action) {
      return {
        ...state,
        userBaseInfo: action.payload,
      };
    },
    queryAllLabelsSuccess(state, action) {
      return {
        ...state,
        allLabels: action.payload,
      };
    },
    queryApproversSuccess(state, action) {
      return {
        ...state,
        LabelAndDescApprover: action.payload,
      };
    },
    queryApprovingEmpInfoSuccess(state, action) {
      return {
        ...state,
        approvalInfo: action.payload,
      };
    },
    cacheUserInfoForm(state, action) {
      return {
        ...state,
        userInfoForm: action.payload,
      };
    },
  },
  effects: {
    // 获取用户基本信息
    * queryEmpInfo({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryEmpInfo);
      if (resultData) {
        yield put({
          type: 'queryEmpInfoSuccess',
          payload: resultData,
        });
      }
    },
    // 获取所有标签
    * queryAllLabels({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryAllLabels);
      if (resultData) {
        yield put({
          type: 'queryAllLabelsSuccess',
          payload: resultData,
        });
      }
    },
    // 获取审批人
    * queryApprovers({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryApprovers);
      if (resultData) {
        yield put({
          type: 'queryApproversSuccess',
          payload: resultData,
        });
      }
    },
    // 提交审批
    * updateEmpInfo({ payload }, { call }) {
      yield call(api.updateEmpInfo, payload);
    },
    // 修改标签
    * updateLabel({ payload }, { call }) {
      yield call(api.updateLabel, payload);
    },
    // 删除标签
    * delLabel({ payload }, { call }) {
      yield call(api.deleteLabel, payload);
    },
    // 添加标签
    * addLabel({ payload }, { call }) {
      yield call(api.addLabel, payload);
    },
    // 查询审批信息
    * queryApprovingEmpInfo({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryApprovingEmpInfo, payload);
      if (resultData) {
        yield put({
          type: 'queryApprovingEmpInfoSuccess',
          payload: resultData,
        });
      }
    },
    // 审批信息
    * approveEmpInfo({ payload }, { call }) {
      yield call(api.approveEmpInfo, payload);
    },
  },
  subscriptions: {
  },
};
