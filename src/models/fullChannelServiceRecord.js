/**
 * @file models/fullChannelServiceRecord.js
 *  全渠道服务记录管理
 * @author wagnjunjun
 */
import { fullChannelServiceRecord as api } from '../api';

export default {
  namespace: 'fullChannelServiceRecord',
  state: {
    serviceRecordList: [],
    serviceRecordPage: {
      pageSize: 10,
      totalNum: 0,
      curPageNum: 1,
    },
  },
  subscriptions: {},
  effects: {
    // 获取全渠道服务记录
    * getServiceRecordList({ payload }, { call, put }) {
      const { resultData } = yield call(api.getServiceRecordList, payload);
      yield put({
        type: 'getServiceRecordListSuccess',
        payload: resultData,
      });
    },

  },
  reducers: {
    // 获取全渠道服务记录
    getServiceRecordListSuccess(state, action) {
      const { page, list } = action.payload;
      const emptyPage = {
        pageSize: 10,
        totalNum: 0,
        curPageNum: 1,
      };
      return {
        ...state,
        serviceRecordList: list || [],
        serviceRecordPage: page || emptyPage,
      };
    },

  },
};
