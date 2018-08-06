/**
 * @Description: 账户限制管理 model
 * @Author: Liujianshu
 * @Date: 2018-07-31 14:49:09
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-08-02 17:05:37
 */
import { accountLimit as api, common as commonApi } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

export default {
  namespace: 'accountLimit',
  state: {
    detailInfo: EMPTY_OBJECT, // 详情
    buttonData: EMPTY_OBJECT, // 获取按钮列表和下一步审批人
    custData: EMPTY_ARRAY, // 客户列表列表
    limitList: EMPTY_ARRAY,
    saveChangeData: EMPTY_OBJECT,  // 保存后的数据
    notifiesData: EMPTY_OBJECT,  // 消息提醒页面数据
  },
  reducers: {
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
        custData: resultData,
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
    saveChangeSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        saveChangeData: resultData,
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
  },
  effects: {
    // 右侧详情
    * queryDetailInfo({ payload }, { call, put }) {
      const response = yield call(api.queryDetailInfo, payload);
      const { resultData = EMPTY_OBJECT } = response;
      const newResultData = { ...resultData };
      const attachmentList = newResultData.attachmentList || [];

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
      newResultData.attachmentList = attachmentArray;
      yield put({
        type: 'queryDetailInfoSuccess',
        payload: newResultData,
      });
    },
    // 查询客户列表
    * queryCustList({ payload }, { call, put }) {
      const response = yield call(api.queryCustList, payload);
      yield put({
        type: 'queryCustListSuccess',
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
    // 提交
    * saveChange({ payload }, { call, put }) {
      const response = yield call(api.saveChange, payload);
      yield put({
        type: 'saveChangeSuccess',
        payload: response,
      });
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
  },
  subscriptions: {},
};
