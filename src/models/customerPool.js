/**
 * @file models/customerPool.js
 *  目标客户池模型管理
 * @author wangjunjun
 */
import api from '../api';

export default {
  namespace: 'customerPool',
  state: {
    todolist: [],
    todolistPage: {
      pageSize: 10,
      curPageNum: 1,
      totalPageNum: 1,
      totalRecordNum: 0,
    },
    performanceIndicators: {},
    custRange: [],
  },
  subscriptions: {},
  effects: {
    * getToDoList({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(api.getToDoList, payload);
      yield put({
        type: 'getToDoListSuccess',
        payload: response,
      });
    },
    // 初始化获取数据
    * getAllInfo({ payload }, { call, put, select }) {
      const cust = yield select(state => state.customerPool.custRange);
      const { request } = payload;
      let firstCust;
      if (cust.length) {
        firstCust = cust[0];
      } else {
        const response = yield call(api.getCustomerRange, { empId: request.empId });
        yield put({
          type: 'getCustomerRangeSuccess',
          response,
        });
        firstCust = response.resultData;
      }
      // 绩效指标
      const Indicators = yield call(api.getPerformanceIndicators, { request, cycle: firstCust });
      yield put({
        type: 'getHistoryCoreSuccess',
        payload: { Indicators },
      });
    },
  },
  reducers: {
    getToDoListSuccess(state, action) {
      const { payload: { data: { todolist, page } } } = action;
      return {
        ...state,
        todolist,
        todolistPage: page,
      };
    },
    getCustomerRangeSuccess(state, action) {
      const { response: { resultData } } = action;
      return {
        ...state,
        custRange: resultData,
      };
    },
    // 绩效指标
    getHistoryCoreSuccess(state, action) {
      const { payload: { Indicators } } = action;
      const performanceIndicators = Indicators.resultData;
      return {
        ...state,
        performanceIndicators,
      };
    },
  },
};
