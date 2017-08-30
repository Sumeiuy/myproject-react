/**
 * @file models/customerPool.js
 *  目标客户池模型管理
 * @author wangjunjun
 */
import _ from 'lodash';
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
    process: 0,
    empInfo: {},
    motTaskCount: 0,
    dict: {},
    monthlyProfits: [],
    hotwds: {},
    hotPossibleWdsList: [],
    custList: [],
    custPage: {
      pageSize: 10,
      pageNo: 1,
      total: 0,
    },
    historyWdsList: [],
    clearState: {},
    cusgroupList: [],
    cusgroupPage: {
      pageSize: 10,
      pageNo: 1,
      total: 0,
    },
    searchHistoryVal: '',
    taskDictionary: {},
    isAllSelect: false,
    selectedIds: [],
    cusGroupSaveResult: '',
    cusGroupSaveMessage: '',
    resultgroupId: '',
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'getDictionary' });
    },
  },
  effects: {
    * getToDoList({ }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getToDoList);
      yield put({
        type: 'getToDoListSuccess',
        payload: response,
      });
    },
    // 获取客户范围
    * getCustomerScope({ payload }, { call, put }) {
      const resultData = yield call(api.getCustRangeAll);
      yield put({
        type: 'getCustomerScopeSuccess',
        payload: resultData,
      });
    },
    // 绩效指标
    * getPerformanceIndicators({ payload }, { call, put }) {
      const indicators =
        yield call(api.getPerformanceIndicators, payload);
      yield put({
        type: 'getPerformanceIndicatorsSuccess',
        payload: { indicators },
      });
    },
    // 初始化获取数据
    * getAllInfo({ payload }, { call, put }) {
      // 统计周期
      const statisticalPeriod = yield call(api.getStatisticalPeriod);
      // debugger;
      yield put({
        type: 'getStatisticalPeriodSuccess',
        payload: { statisticalPeriod },
      });
      const firstCycle = statisticalPeriod.resultData.kPIDateScopeType;
      // debugger;
      // 代办流程(首页总数)
      const agentProcess = yield call(api.getWorkFlowTaskCount);
      yield put({
        type: 'getWorkFlowTaskCountSuccess',
        payload: { agentProcess },
      });
      // 今日可做任务总数
      const motTaskcount = yield call(api.getMotTaskCount);
      yield put({
        type: 'getMotTaskCountSuccess',
        payload: { motTaskcount },
      });
      // 绩效指标
      const indicators =
        yield call(api.getPerformanceIndicators,
          { ...payload.request, dateType: firstCycle[0].key });
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
    // 获取字典
    * getDictionary({ payload }, { call, put }) {
      const response = yield call(api.getStatisticalPeriod);
      // console.log('dict', response);
      yield put({
        type: 'getDictionarySuccess',
        payload: { response },
      });
    },
    // 获取客户列表
    * getCustomerList({ payload }, { call, put }) {
      const response = yield call(api.getCustomerList, payload);
      yield put({
        type: 'getCustomerListSuccess',
        payload: response,
      });
    },
    // 获取客户列表6个月收益率
    * getCustIncome({ payload }, { call, put }) {
      const response = yield call(api.getCustIncome, payload);
      yield put({
        type: 'getCustIncomeSuccess',
        payload: response,
      });
    },
    // 默认推荐词及热词推荐列表及历史搜索数据
    * getHotWds({ payload }, { call, put }) {
      const response = yield call(api.getHotWds, payload);
      yield put({
        type: 'getHotWdsSuccess',
        payload: { response },
      });
    },
    // 联想的推荐热词列表
    * getHotPossibleWds({ payload }, { call, put }) {
      const response = yield call(api.getHotPossibleWds, payload);
      yield put({
        type: 'getHotPossibleWdsSuccess',
        payload: { response },
      });
    },
    // 默认推荐词及热词推荐列表及历史搜索数据
    * getHistoryWdsList({ payload }, { call, put }) {
      const history = yield call(api.getHistoryWdsList, payload);
      yield put({
        type: 'getHistoryWdsListSuccess',
        payload: { history },
      });
    },
    // 清除历史搜索列表
    * clearSearchHistoryList({ payload }, { call, put }) {
      const clearHistoryState = yield call(api.clearSearchHistoryList, payload);
      yield put({
        type: 'clearSearchHistoryListSuccess',
        payload: { clearHistoryState },
      });
    },
    // 获取客户分组列表信息
    * customerGroupList({ payload }, { call, put }) {
      if (!_.isEmpty(payload)) {
        const response = yield call(api.customerGroupList, payload);
        yield put({
          type: 'getGroupListSuccess',
          payload: response,
        });
      }
    },
    // 添加客户到现有分组
    * addCustomerToGroup({ payload }, { call, put }) {
      if (!_.isEmpty(payload)) {
        const response = yield call(api.saveCustGroupList, payload);
        yield put({
          type: 'addCusToGroupSuccess',
          payload: response,
        });
      }
    },
    // 添加客户到新的分组
    * createCustGroup({ payload }, { call, put }) {
      if (!_.isEmpty(payload)) {
        const response = yield call(api.createCustGroup, payload);
        yield put({
          type: 'addCusToGroupSuccess',
          payload: response,
        });
      }
    },
    // 自建任务字典
    * getTaskDictionary({ payload }, { call, put }) {
      const taskDictionary = yield call(api.getTaskDictionary, payload);
      yield put({
        type: 'getTaskDictionarySuccess',
        payload: { taskDictionary },
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
          flowClass: item.flowClass,
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
      const { payload: { resultData } } = action;
      let custRange = [];
      if (resultData) {
        custRange = [
          { id: resultData.id, name: resultData.name, level: resultData.level },
          ...resultData.children,
        ];
      }
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
      const cycle = statisticalPeriod.resultData.kPIDateScopeType;
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
    // 今日可做任务总数
    getMotTaskCountSuccess(state, action) {
      const { payload: { motTaskcount } } = action;
      const motTaskCount = motTaskcount.resultData;
      return {
        ...state,
        motTaskCount,
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
    getDictionarySuccess(state, action) {
      const { payload: { response } } = action;
      const dict = response.resultData;
      return {
        ...state,
        dict,
      };
    },
    // 默认推荐词及热词推荐列表
    getHotWdsSuccess(state, action) {
      const { payload: { response } } = action;
      const hotWds = response.resultData;
      return {
        ...state,
        hotWds,
      };
    },
    // 联想的推荐热词列表
    getHotPossibleWdsSuccess(state, action) {
      const { payload: { response } } = action;
      const hotPossibleWdsList = response.resultData.hotPossibleWdsList;
      return {
        ...state,
        hotPossibleWdsList,
      };
    },
    getCustomerListSuccess(state, action) {
      const { payload: { resultData: { custListVO } } } = action;
      if (!custListVO) {
        return {
          ...state,
          custList: [],
          custPage: {
            pageSize: 10,
            pageNo: 1,
            total: 0,
          },
        };
      }
      const custPage = {
        pageSize: custListVO.pageSize,
        pageNo: Number(custListVO.curPageNum) + 1,
        total: custListVO.totalCount,
      };
      return {
        ...state,
        custList: custListVO.custList,
        custPage,
      };
    },
    getCustIncomeSuccess(state, action) {
      const { payload: { resultData: { monthlyProfits } } } = action;
      return {
        ...state,
        monthlyProfits,
      };
    },
    // 历史搜索列表
    getHistoryWdsListSuccess(state, action) {
      const { payload: { history: { resultData: { historyWdsList } } } } = action;
      return {
        ...state,
        historyWdsList,
      };
    },
    // 清除历史搜索列表
    clearSearchHistoryListSuccess(state, action) {
      const { payload: { clearHistoryState } } = action;
      return {
        ...state,
        clearState: clearHistoryState,
      };
    },
      // 获取客户分组列表
    getGroupListSuccess(state, action) {
      const { payload: { resultData } } = action;
      if (!resultData) {
        return {
          ...state,
          cusgroupList: [],
          cusgroupPage: {
            total: 0,
          },
          cusGroupSaveResult: '',
        };
      }
      const cusgroupPage = {
        total: resultData.totalPageNum,
      };
      return {
        ...state,
        cusgroupList: resultData.custGroupDTOList,
        cusgroupPage,
        cusGroupSaveResult: '',
      };
    },
    // 保存搜索内容
    saveSearchVal(state, action) {
      const { payload: { searchVal } } = action;
      return {
        ...state,
        searchHistoryVal: searchVal,
      };
    },
    // 自建任务字典
    getTaskDictionarySuccess(state, action) {
      const { payload: { taskDictionary: { resultData } } } = action;
      return {
        ...state,
        taskDictionary: resultData,
      };
    },
    // 保存是否全选
    saveIsAllSelect(state, action) {
      return {
        ...state,
        isAllSelect: action.payload,
      };
    },

    // 保存选中的数据id
    saveSelectedIds(state, action) {
      return {
        ...state,
        selectedIds: action.payload,
      };
    },
      // 添加到现有分组保存成功
    addCusToGroupSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        cusGroupSaveResult: resultData.result,
        resultgroupId: resultData.groupId,
        cusGroupSaveMessage: resultData.message,
      };
    },
  },
};
