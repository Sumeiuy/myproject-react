/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系信息申请models
 * @Date: 2018-06-08 13:17:14
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-06-08 13:21:06
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
  },
  subscriptions: {
  },
};
