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
  },
  reducers: {
    queryUserBaseInfoSuccess(state, action) {
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
    queryEmpLabelAndDescApproverSuccess(state, action) {
      return {
        ...state,
        LabelAndDescApprover: action.payload,
      };
    },
  },
  effects: {
    // 获取问题列表
    * queryUserBaseInfo({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryUserBaseInfo);
      if (resultData) {
        yield put({
          type: 'queryUserBaseInfoSuccess',
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
    * queryEmpLabelAndDescApprover({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryEmpLabelAndDescApprover);
      if (resultData) {
        yield put({
          type: 'queryEmpLabelAndDescApproverSuccess',
          payload: resultData,
        });
      }
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
  },
  subscriptions: {
  },
};
