/**
 * @Description: 账户限制管理 model
 * @Author: Liujianshu
 * @Date: 2018-07-31 14:49:09
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-08 09:42:37
 */
import { accountLimit as api, common as commonApi } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

export default {
  namespace: 'accountLimitEdit',
  state: {
    detailInfo: EMPTY_OBJECT, // 用于展示的详情
    buttonData: EMPTY_OBJECT, // 获取按钮列表和下一步审批人
    limitList: EMPTY_ARRAY,
    saveChangeData: EMPTY_OBJECT,  // 保存后的数据
    editFormData: EMPTY_OBJECT, // 用于编辑时修改的详情数据,为了避免直接修改详情数据，浅拷贝于详情数据
  },
  reducers: {
    // 详情数据修改
    editFormChange(state, action) {
      const { payload: { type = '', value = '' } } = action;
      const newEditFormData = { ...state.editFormData };
      newEditFormData[type] = value;
      return {
        ...state,
        editFormData: newEditFormData,
      };
    },
    // 详情
    queryDetailInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        detailInfo: payload,
        editFormData: { ...payload },
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
  },
  subscriptions: {},
};
