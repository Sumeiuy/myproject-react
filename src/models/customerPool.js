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
    position: {},
    process: {},
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
    // 获取客户池客户范围
    * getCustomerScope({ payload }, { call, put }) {
      const resultData = yield call(api.getCustomerRange);
      yield put({
        type: 'getCustomerScopeSuccess',
        response: resultData,
      });
    },
    * getStatisticalPeriod({ payload }, { call, put }) {
      // 统计周期
      const statisticalPeriod = yield call(api.getStatisticalPeriod);
      yield put({
        type: 'getStatisticalPeriodSuccess',
        payload: { statisticalPeriod },
      });
    },
    // 初始化获取数据
    * getAllInfo({ payload }, { call, put }) {
      // 代办流程(首页总数)
      const agentProcess = yield call(api.getWorkFlowTaskCount);
      yield put({
        type: 'getWorkFlowTaskCountSuccess',
        payload: { agentProcess },
      });
      // 绩效指标
      const indicators = yield call(api.getPerformanceIndicators);
      yield put({
        type: 'getPerformanceIndicatorsSuccess',
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
      const { payload: { resultData: { empWorkFlowList } } } = action;
      empWorkFlowList.forEach((item) => {
        item.task = {  //eslint-disable-line
          text: item.subject,
          dispatchUri: item.dispatchUri,
        };
      });
      return {
        ...state,
        todolist: empWorkFlowList,
        todolistRecord: empWorkFlowList,
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
    // 客户池用户范围
    getCustomerScopeSuccess(state, action) {
      const { response: { resultData } } = action;
      const custRange = [
        { id: resultData.id, name: resultData.name, level: resultData.level },
        ...resultData.children,
      ];
      return {
        ...state,
        custRange,
      };
    },
    // 绩效指标
    getPerformanceIndicatorsSuccess(state, action) {
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
    // 代办流程(首页总数)
    getWorkFlowTaskCountSuccess(state, action) {
      const { payload: { agentProcess } } = action;
      const process = agentProcess.resultData;
      return {
        ...state,
        process,
      };
    },
    // 职责切换
    getPositionSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        position: payload,
      };
    },
  },
};
