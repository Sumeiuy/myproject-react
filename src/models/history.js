/**
 * @file models/history.js
 * @author sunweibin
 */
import api from '../api';
import { BoardBasic } from '../config';

export default {
  namespace: 'history',
  state: {
    custRange: [],
    visibleBoards: [], // 可见看板
  },
  reducers: {
    // 获取左上角可见看板
    getAllVisibleReportsSuccess(state, action) {
      const { payload: { allVisibleReports } } = action;
      const visibleBoards = allVisibleReports.resultData || [];
      return {
        ...state,
        visibleBoards: [
          ...BoardBasic.regular,
          ...visibleBoards,
        ],
      };
    },

    // 获取组织机构树
    getCustRangeSuccess(state, action) {
      const { response: { resultData } } = action;
      let custRange;
      if (resultData.level === '1') {
        custRange = [
          { id: resultData.id, name: resultData.name, level: resultData.level },
          ...resultData.children,
        ];
      } else {
        custRange = [resultData];
      }
      return {
        ...state,
        custRange,
      };
    },
  },
  effects: {
    // 初始化获取数据
    * getAllInfo({ payload }, { call, put, select }) {
      const cust = yield select(state => state.report.custRange);
      let firstCust;
      if (cust.length) {
        firstCust = cust[0];
      } else {
        const response = yield call(api.getCustRange, payload.custRange);
        yield put({
          type: 'getCustRangeSuccess',
          response,
        });
        firstCust = response.resultData;
      }
      // 查询当前用户所能够看到的看板报表
      const allVisibleReports = yield call(api.getAllVisibleReports, {
        orgId: firstCust.id,
      });
      yield put({
        type: 'getAllVisibleReportsSuccess',
        payload: { allVisibleReports },
      });
    },
  },
  subscriptions: {},
};
