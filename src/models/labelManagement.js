// import _ from 'lodash';
// import queryString from 'query-string';
import { labelManagement as api } from '../api';
// import { emp, url } from '../helper';

const EMPTY_OBJECT = {};
// const EMPTY_LIST = [];
// const INITIAL_PAGE_NUM = 1;
// const INITIAL_PAGE_TEN_SIZE = 10;


export default {
  namespace: 'labelManagement',
  state: {
    labelListInfo: EMPTY_OBJECT,
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
    // 新建或编辑标签
    * operateLabel({ payload }, { call }) {
      const response = yield call(api.operateLabel, payload);
      return response;
    },
    // 给分组内客户打标签
    * signLabelForGroupCust({ payload }, { call }) {
      const response = yield call(api.signLabelForGroupCust, payload);
      return response;
    },
  },
  subscriptions: {
  },
};
