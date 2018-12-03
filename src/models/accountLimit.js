/* eslint-disable import/no-anonymous-default-export */
/**
 * @Description: 账户限制管理 model
 * @Author: Liujianshu
 * @Date: 2018-07-31 14:49:09
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-29 20:48:11
 */
import { accountLimit as api, common as commonApi } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

// eslint-disable-next-line
export default {
  namespace: 'accountLimit',
  state: {
    // 服务经理数据
    empData: EMPTY_OBJECT,
    detailInfo: EMPTY_OBJECT, // 详情
    buttonData: EMPTY_OBJECT, // 获取按钮列表和下一步审批人
    searchCustData: EMPTY_ARRAY, // 客户列表列表
    addedCustData: EMPTY_ARRAY, // 已添加的客户列表
    limitList: EMPTY_ARRAY,
    notifiesData: EMPTY_OBJECT, // 消息提醒页面数据
    validateData: EMPTY_OBJECT, // 校验数据接口返回值
  },
  reducers: {
    // 获取服务经理列表
    queryEmpDataSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        empData: {
          list: resultData.servicePeopleList || EMPTY_ARRAY,
          page: resultData.page || EMPTY_OBJECT,
        },
      };
    },
    // 详情
    queryDetailInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        detailInfo: payload,
      };
    },
    // 查询客户
    queryCustListSuccess(state, action) {
      const { payload: { resultData = EMPTY_ARRAY } } = action;
      return {
        ...state,
        searchCustData: resultData,
      };
    },
    // 查询已添加的客户
    queryAddedCustListSuccess(state, action) {
      const { payload: { resultData = EMPTY_ARRAY } } = action;
      return {
        ...state,
        addedCustData: resultData,
      };
    },
    // 查询限制类型
    queryLimtListSuccess(state, action) {
      const { payload: { resultData = EMPTY_ARRAY } } = action;
      return {
        ...state,
        limitList: resultData,
      };
    },
    // 下一步按钮和审批人
    queryButtonListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        buttonData: resultData,
      };
    },
    // 消息提醒页面数据
    queryNotifiesListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        notifiesData: resultData,
      };
    },
    // 消息提醒页面数据
    validateFormSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        validateData: payload,
      };
    },
    // 清除数据成功
    clearDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 获取服务经理列表
    * queryEmpData({ payload }, { call, put }) {
      const response = yield call(commonApi.getEmpList, payload);
      yield put({
        type: 'queryEmpDataSuccess',
        payload: response,
      });
    },
    // 右侧详情
    * queryDetailInfo({ payload }, { call, put }) {
      const response = yield call(api.queryDetailInfo, payload);
      const { resultData = EMPTY_OBJECT } = response;
      const newResultData = { ...resultData };
      const attachmentList = newResultData.attachmentList || [];
      newResultData.attachList = [];
      const attachmentArray = [];
      for (let i = 0; i < attachmentList.length; i++) {
        const item = attachmentList[i];
        const attachmentPayload = {
          attachment: item.attachment,
        };
        const attachmentResponse = yield call(commonApi.getAttachmentList, attachmentPayload);
        const responsePayload = {
          attachmentList: attachmentResponse.resultData,
          title: item.title,
          attachment: item.attachment,
        };
        attachmentArray.push(responsePayload);
      }
      newResultData.attachList = attachmentArray;
      yield put({
        type: 'queryDetailInfoSuccess',
        payload: newResultData,
      });
    },
    // 查询客户列表
    * queryCustList({ payload }, { call, put }) {
      const response = yield call(api.queryCustList, payload);
      let type = 'queryCustListSuccess';
      if (payload.attachment) {
        type = 'queryAddedCustListSuccess';
      }
      yield put({
        type,
        payload: response,
      });
    },
    // 查询限制类型列表
    * queryLimtList({ payload }, { call, put }) {
      const response = yield call(api.queryLimtList, payload);
      yield put({
        type: 'queryLimtListSuccess',
        payload: response,
      });
    },
    // 查询下一把按钮和审批人
    * queryButtonList({ payload }, { call, put }) {
      const response = yield call(api.queryButtonList, payload);
      yield put({
        type: 'queryButtonListSuccess',
        payload: response,
      });
    },
    // 校验数据
    * validateForm({ payload }, { call, put }) {
      const response = yield call(api.validateForm, payload);
      yield put({
        type: 'validateFormSuccess',
        payload: response,
      });
    },
    // 提交
    * saveChange({ payload }, { call }) {
      yield call(api.saveChange, payload);
    },
    // 提交保存
    * doApprove({ payload }, { call }) {
      yield call(api.doApprove, payload);
    },
    // 消息提醒页面数据
    * queryNotifiesList({ payload }, { call, put }) {
      const response = yield call(api.queryNotifiesList, payload);
      yield put({
        type: 'queryNotifiesListSuccess',
        payload: response,
      });
    },
    // 清除数据
    * clearData({ payload }, { put }) {
      yield put({
        type: 'clearDataSuccess',
        payload,
      });
    },
  },
  subscriptions: {},
};
