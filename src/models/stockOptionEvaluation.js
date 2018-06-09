/*
 * @Author: zhangjun
 * @Date: 2018-06-05 17:15:59
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-08 21:28:24
 */

import { stockOptionEvaluation as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
export default {
  namespace: 'stockOptionEvaluation',
  state: {
    // 股票期权申请页面-右侧详情
    detailInfo: EMPTY_OBJECT,
    // 附件列表
    attachmentList: EMPTY_LIST,
  },
  reducers: {
    // 股票期权申请页面-右侧详情
    getDetailInfoSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },

    // 获取附件列表成功
    getAttachmentListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        attachmentList: resultData,
      };
    },
  },
  effects: {
    // 股票期权申请页面-右侧详情
    * getDetailInfo({ payload }, { call, put }) {
      const response = yield call(api.getDetailInfo, payload);
      yield put({
        type: 'getDetailInfoSuccess',
        payload: response,
      });
    },

    // 获取附件列表
    * getAttachmentList({ payload }, { call, put }) {
      const response = yield call(api.getAttachmentList, payload);
      yield put({
        type: 'getAttachmentListSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
