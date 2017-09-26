/*
 * @Description: 合作合约 model
 * @Author: LiuJianShu
 * @Date: 2017-09-20 15:13:30
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-09-26 09:35:09
 */
import { contract as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'contract',
  state: {
    baseInfo: EMPTY_OBJECT,
    attachmentList: EMPTY_LIST, // 附件信息
  },
  reducers: {
    // 获取详情
    getBaseInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        baseInfo: resultData,
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
    // 删除附件
    deleteAttachmentSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { attaches = EMPTY_LIST } = resultData;
      return {
        ...state,
        attachmentList: attaches,
      };
    },
  },
  effects: {
    // 获取详情
    * getBaseInfo({ payload }, { call, put }) {
      const response = yield call(api.getContractDetail, payload);
      yield put({
        type: 'getBaseInfoSuccess',
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
    * deleteAttachment({ payload }, { call, put }) {
      const response = yield call(api.deleteAttachment, payload);
      yield put({
        type: 'deleteAttachmentSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
