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
    todolistRecord: [],
    todoPage: {
      curPageNum: 1,
    },
    performanceIndicators: {},
    custRange: [],
    cycle: [],
    position: '',
  },
  subscriptions: {},
  effects: {
    * getToDoList({ }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getToDoList, { empid: '002332' });
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
      // 统计周期
      const statisticalPeriod = yield call(api.getStatisticalPeriod);
      yield put({
        type: 'getStatisticalPeriodSuccess',
        payload: { statisticalPeriod },
      });
      // 绩效指标
      const indicators = yield call(api.getPerformanceIndicators, { request, cycle: firstCust });
      yield put({
        type: 'getHistoryCoreSuccess',
        payload: { indicators },
      });
    },
    * search({ payload }, { put, select }) {
      const todolist = yield select(state => state.customerPool.todolist);
      yield put({
        type: 'searchSuccess',
        payload: todolist.filter(v => v.subject.indexOf(payload) > -1),
      });
    },
    * pageChange({ payload }, { put, select }) {
      const todoPage = yield select(state => state.customerPool.todoPage);
      const newPage = {
        ...todoPage,
        ...payload,
      };
      yield put({
        type: 'pageChangeSuccess',
        payload: newPage,
      });
    },
  },
  reducers: {
    getToDoListSuccess(state, action) {
      const { payload: { resultData: { data } } } = action;
      data.forEach((item) => {
        item.task = {  //eslint-disable-line
          text: item.subject,
          dispatchUri: item.dispatchUri,
        };
      });
      return {
        ...state,
        todolist: data,
        todolistRecord: data,
      };
    },
    searchSuccess(state, action) {
      return {
        ...state,
        todolistRecord: action.payload,
        todoPage: {
          curPageNum: 1,
        },
      };
    },
    pageChangeSuccess(state, action) {
      return {
        ...state,
        todoPage: action.payload,
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
      const { payload: { indicators } } = action;
      const performanceIndicators = indicators.resultData;
      return {
        ...state,
        performanceIndicators,
      };
    },
    // 统计周期
    getStatisticalPeriodSuccess(state, action) {
      const { payload: { statisticalPeriod } } = action;
      const cycle = statisticalPeriod.resultData;
      return {
        ...state,
        cycle,
      };
    },
    // 职责切换
    getPositionSuccess(state, action) {
      const { payload } = action;
      return {
        position: payload,
      };
    },
  },
};
