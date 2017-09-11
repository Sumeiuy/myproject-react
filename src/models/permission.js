/**
 * @file models/premissinon.js
 * @author honggaungqing
 */

// import { routerRedux } from 'dva/router';

import _ from 'lodash';
import { permission as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'permission',
  state: {
    list: EMPTY_OBJECT,
  },
  reducers: {
    getPermissionListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { page = EMPTY_OBJECT, permissionVOList = EMPTY_LIST } = resultData;
      const { listData: preListData = EMPTY_LIST } = state.list;

      return {
        ...state,
        list: {
          page,
          resultData: page.pageNum === 1 ?
            permissionVOList : [...preListData, ...permissionVOList],
        },
      };
    },
  },
  effects: {
    * getPermissionList({ payload }, { call, put }) {
      const { page } = payload;
      if (!_.isEmpty(page)) {
        const response = yield call(api.getPermissionList, payload);
        yield put({
          type: 'getPermissionListSuccess',
          payload: response,
        });
      }
    },
  },
  subscriptions: {},
};
