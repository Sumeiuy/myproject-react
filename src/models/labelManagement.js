/* eslint-disable import/no-anonymous-default-export */
import _ from 'lodash';
import { labelManagement as api } from '../api';
import { toastM } from '../utils/sagaEffects';

const EMPTY_OBJECT = {};
// const EMPTY_LIST = [];
const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_TEN_SIZE = 10;


export default {
  namespace: 'labelManagement',
  state: {
    // 标签列表数据
    labelListInfo: EMPTY_OBJECT,
    // 分组列表数据
    custGroupListInfo: EMPTY_OBJECT,
    // 分组下的客户列表数据
    groupCustInfo: EMPTY_OBJECT,
    // 通过关键字联想出来的标签数据
    possibleLabelListInfo: EMPTY_OBJECT,
    // 标签下的客户
    labelCustInfo: EMPTY_OBJECT,
  },
  reducers: {
    // 获取标签列表
    queryLabelListSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        labelListInfo: payload,
      };
    },
    // 查询分组列表数据
    queryCustGroupListSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        custGroupListInfo: payload,
      };
    },
    // 查询分组下的客户
    queryGroupCustListSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        groupCustInfo: payload,
      };
    },
    // 通过关键字联想标签
    queryPossibleLabelsSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        possibleLabelListInfo: payload,
      };
    },
    // 清空联想标签数据
    clearPossibleLabels(state) {
      return {
        ...state,
        possibleLabelListInfo: EMPTY_OBJECT,
      };
    },
    // 查询标签下的客户
    queryLabelCustSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        labelCustInfo: payload,
      };
    },
  },
  effects: {
    // 获取标签列表
    * queryLabelList({ payload }, { call, put }) {
      const { code, resultData } = yield call(api.queryLabelList, payload);
      if (code === '0') {
        yield put({
          type: 'queryLabelListSuccess',
          payload: resultData,
        });
      }
    },
    // 删除单个标签
    * deleteLabel({ payload }, { call }) {
      const response = yield call(api.deleteLabel, payload);
      return response;
    },
    // 给分组内客户打标签
    * signLabelForGroupCust({ payload }, { call }) {
      const response = yield call(api.signLabelForGroupCust, payload);
      return response;
    },
    // 查询分组列表数据
    * queryCustGroupList({ payload }, { call, put }) {
      const { code, resultData } = yield call(api.queryCustGroupList, payload);
      if (code === '0') {
        yield put({
          type: 'queryCustGroupListSuccess',
          payload: resultData,
        });
      }
    },
    // 查询分组下的客户
    * queryGroupCustList({ payload }, { call, put }) {
      const { code, resultData } = yield call(api.queryGroupCustList, payload);
      if (code === '0') {
        yield put({
          type: 'queryGroupCustListSuccess',
          payload: resultData,
        });
      }
    },
    // 通过关键字联想标签
    * queryPossibleLabels({ payload }, { call, put }) {
      const { code, resultData } = yield call(api.queryLabelList, payload);
      if (code === '0') {
        yield put({
          type: 'queryPossibleLabelsSuccess',
          payload: resultData,
        });
      }
    },
    // 分组转标签
    * group2Label({ payload }, { call }) {
      const response = yield call(api.group2Label, payload);
      return response;
    },
    // 查询标签下的客户
    * queryLabelCust({ payload }, { call, put }) {
      const { code, resultData } = yield call(api.queryLabelCust, payload);
      if (code === '0') {
        yield put({
          type: 'queryLabelCustSuccess',
          payload: resultData,
        });
      }
    },
    * deleteLabelCust({ payload }, { call }) {
      const response = yield call(api.deleteLabelCust, payload);
      return response;
    },
    * isSendCustsServedByEmp({ payload }, { call }) {
      const response = yield call(api.isSendCustsServedByEmp, payload);
      return response;
    },
    // 新建编辑标签信息
    * operateLabel({ payload }, { call, put }) {
      const { request, request: { labelIds }, keyWord, pageNum, pageSize } = payload;
      const { resultData } = yield call(api.operateLabel, request);
      let message;
      if (resultData !== 'success') {
        return;
      }
      const hasLabelId = !_.isEmpty(labelIds) && labelIds[0];
      if (hasLabelId) {
        // 更新
        message = '更新标签成功';
      } else {
        message = '新建标签成功';
      }
      yield put({
        type: 'toastM',
        message,
        duration: 2,
      });
      // 成功之后，更新标签列表信息
      yield put({
        type: 'queryLabelList',
        payload: {
          currentPage: pageNum || INITIAL_PAGE_NUM,
          pageSize: pageSize || INITIAL_PAGE_TEN_SIZE,
          keyWord,
          countFlag: 'Y',
        },
      });
      if (hasLabelId) {
        // 成功之后，更新标签下客户信息
        yield put({
          type: 'queryLabelCust',
          payload: {
            pageNum: INITIAL_PAGE_NUM,
            pageSize: INITIAL_PAGE_TEN_SIZE,
            labelId: labelIds[0],
          },
        });
      }
    },
    * toastM({ message, duration }) {
      yield toastM(message, duration);
    },
    // 标签名重名校验
    checkDuplicationName: [
      function* getHotPossibleWds({ payload }, { call }) {
        const { resultData } = yield call(api.checkDuplicationName, payload);
        return !resultData;
      },
      { type: 'takeLatest' }],
  },
  subscriptions: {
  },
};
