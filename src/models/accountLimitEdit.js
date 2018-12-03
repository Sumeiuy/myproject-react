/* eslint-disable import/no-anonymous-default-export */
/**
 * @Description: 账户限制管理 model
 * @Author: Liujianshu
 * @Date: 2018-07-31 14:49:09
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-08 09:42:37
 */
import { accountLimit as api, common as commonApi } from '../api';
import config from '../components/accountLimit/config';
import { time } from '../helper';

const { attachmentMap, RELIEVE_CODE } = config;
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

export default {
  namespace: 'accountLimitEdit',
  state: {
    // 服务经理数据
    empData: EMPTY_OBJECT,
    detailInfo: EMPTY_OBJECT, // 用于展示的详情
    buttonData: EMPTY_OBJECT, // 获取按钮列表和下一步审批人
    limitList: EMPTY_ARRAY,
    saveChangeData: EMPTY_OBJECT, // 保存后的数据
    editFormData: EMPTY_OBJECT, // 用于编辑时修改的详情数据,为了避免直接修改详情数据，浅拷贝于详情数据
    validateData: EMPTY_OBJECT, // 校验数据接口返回值
  },
  reducers: {
    // 数据校验
    validateFormSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        validateData: payload,
      };
    },
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
        editFormData: {
          ...payload,
          limitStartTime: time.format(payload.limitStartTime),
          limitEndTime: time.format(payload.limitEndTime),
        },
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
    // 校验数据
    * validateForm({ payload }, { call, put }) {
      const response = yield call(api.validateForm, payload);
      yield put({
        type: 'validateFormSuccess',
        payload: response,
      });
    },
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
      const editPageAttachmentList = [attachmentMap[0]];
      if (newResultData.operateType === RELIEVE_CODE && newResultData.bankConfirm) {
        editPageAttachmentList.push(attachmentMap[1]);
      }
      newResultData.attachList = editPageAttachmentList.map((parentItem) => {
        let newItem = {};
        attachmentArray.forEach((childItem) => {
          if (parentItem.type === childItem.title) {
            newItem = {
              ...childItem,
              ...parentItem,
              length: (childItem.attachmentList || EMPTY_ARRAY).length,
            };
          }
        });
        return newItem;
      });
      const newCustList = [...newResultData.custList];
      newResultData.custList = newCustList.map(item => ({
        ...item,
        newManagerId: item.managerId,
        newManagerName: item.managerName,
        newLimitAmount: item.limitAmount,
      }));

      // newResultData.attachList = attachmentArray;
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
