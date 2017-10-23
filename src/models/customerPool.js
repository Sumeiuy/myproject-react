/**
 * @file models/customerPool.js
 *  目标客户池模型管理
 * @author wangjunjun
 */
import _ from 'lodash';
import queryString from 'query-string';
import pathToRegexp from 'path-to-regexp';
import { customerPool as api } from '../api';
import { helper, sagaEffects } from '../utils';

const { toastM } = sagaEffects;

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const LIST_MAX = 1e4;
const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_SIZE = 10;

export default {
  namespace: 'customerPool',
  state: {
    information: {},     // 资讯
    performanceIndicators: [],  // 投顾指标
    hsRateAndBusinessIndicator: [],  // 沪深归集率和开通业务指标（经营指标）
    // 存放从服务端获取的全部代办数据
    todolist: [],
    // 存放筛选后数据
    todolistRecord: [],
    // 待办列表页码
    todoPage: {
      curPageNum: 1,
    },
    manageIndicators: {},
    // 组织机构树
    custRange: [],
    // 时间周期：本年、本季、本月
    cycle: [],
    process: {},
    empInfo: {},
    // 客户列表中对应的每个客户的近6个月的收益
    monthlyProfits: {},
    hotwds: {},
    hotPossibleWdsList: [],
    // 目标客户列表数据
    custList: [],
    // 目标客户列表页码
    custPage: {
      pageSize: 10,
      pageNo: 1,
      total: 0,
    },
    historyWdsList: [],
    clearState: {},
    cusgroupList: [],
    cusgroupPage: {
      pageSize: 0,
      pageNo: 0,
      total: 0,
    },
    searchHistoryVal: '',
    cusGroupSaveResult: '',
    createTaskResult: {},
    cusGroupSaveMessage: '',
    resultgroupId: '',
    incomeData: [], // 净收入
    custContactData: {}, // 客户联系方式
    serviceRecordData: {}, // 服务记录
    // 添加服务记录成功的标记
    addServeRecordSuccess: false,
    isFollow: {},
    followLoading: false,
    fllowCustData: {},
    custEmail: {},
    // 分组维度，客户分组列表
    customerGroupList: {},
    // 指定分组下的客户列表
    groupCustomerList: {},
    // 客户分组历史搜索列表
    customerHistoryWordsList: [],
    // 客户分组是否清除历史搜索成功
    isClearCustomerHistorySuccess: false,
    // 客户分组历史搜索值，点击过按钮
    customerSearchHistoryVal: '',
    // 客户分组热词列表
    customerHotPossibleWordsList: [],
    // 编辑，新增客户分组结果
    operateGroupResult: '',
    // 删除分组结果
    deleteGroupResult: '',
    // 删除分组下客户结果
    deleteCustomerFromGroupResult: {},
    // 360服务记录查询数据
    serviceLogData: [],
    // 360服务记录查询更多数据
    serviceLogMoreData: [],
    // 预览客户细分数据
    priviewCustFileData: {},
    // 存储的任务流程数据
    storedTaskFlowData: {},
    // 当前选中tab
    currentTab: '',
    // 提交任务流程结果
    submitTaskFlowResult: '',
    // 可查询服务人员列表
    searchServerPersonList: EMPTY_LIST,
    // 列表页的服务营业部
    serviceDepartment: EMPTY_LIST,
    // 标签圈人
    circlePeopleData: [],
    peopleOfLabelData: [],
    // 审批人列表
    approvalList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'getCustRangeByAuthority' });
      history.listen(({ pathname, search }) => {
        const params = queryString.parse(search);
        const serviceLogUrl = pathToRegexp('/customerPool/serviceLog').exec(pathname);
        const custGroupUrl = pathToRegexp('/customerPool/customerGroup').exec(pathname);
        if (serviceLogUrl) {
          const { pageSize, serveDateToPaged } = params;
          if (_.isEmpty(pageSize)) params.pageSize = null;
          if (_.isEmpty(serveDateToPaged)) params.serveDateToPaged = null;
          dispatch({
            type: 'getServiceLog',
            payload: params,
          });
        }

        if (custGroupUrl) {
          const { curPageNum, curPageSize, keyWord = null } = params;
          dispatch({
            type: 'customerGroupList',
            payload: {
              pageNum: curPageNum || INITIAL_PAGE_NUM,
              pageSize: curPageSize || INITIAL_PAGE_SIZE,
              empId: helper.getEmpId(),
              keyWord,
            },
          });
        }
      });
    },
  },
  effects: {
    // 投顾绩效
    * getPerformanceIndicators({ payload }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getPerformanceIndicators, payload);
      yield put({
        type: 'getPerformanceIndicatorsSuccess',
        payload: response,
      });
    },
    // 沪深归集率和开通业务指标（经营指标）
    * getHSRateAndBusinessIndicator({ payload }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getHSRateAndBusinessIndicator, payload);
      yield put({
        type: 'getHSRateAndBusinessIndicatorSuccess',
        payload: response,
      });
    },
    // 资讯列表和详情
    * getInformation({ payload }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getInformation, payload);
      yield put({
        type: 'getInformationSuccess',
        payload: response,
      });
    },
    // 代办流程任务列表
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
    * getManageIndicators({ payload }, { call, put }) {
      const indicators =
        yield call(api.getManageIndicators, payload);
      yield put({
        type: 'getManageIndicatorsSuccess',
        payload: { indicators },
      });
    },
    // (首页总数)
    * getToBeDone({ payload }, { call, put }) {
      const queryNumbers = yield call(api.getQueryNumbers, payload);
      yield put({
        type: 'getWorkFlowTaskCountSuccess',
        payload: { queryNumbers },
      });
    },
    // 代办流程任务搜索
    * search({ payload }, { put, select }) {
      const todolist = yield select(state => state.customerPool.todolist);
      yield put({
        type: 'searchSuccess',
        payload: todolist.filter(v => v.subject.indexOf(payload) > -1),
      });
    },
    // 代办流程任务页数改变
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
      yield put({
        type: 'getCustIncomeReq',
      });
      const { resultData: { monthlyProfits } } = yield call(api.getCustIncome, payload);
      yield put({
        type: 'getCustIncomeSuccess',
        payload: { ...payload, monthlyProfits },
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
          payload: {
            groupId: payload.groupId,
            result: response.resultData,
          },
        });
      }
    },
    // 添加客户到新的分组
    * createCustGroup({ payload }, { call, put }) {
      if (!_.isEmpty(payload)) {
        const { resultData } = yield call(api.createCustGroup, payload);
        yield put({
          type: 'addCusToGroupSuccess',
          payload: {
            result: resultData,
          },
        });
      }
    },
    // 自建任务提交
    * createTask({ payload }, { call, put }) {
      const createTaskResult = yield call(api.createTask, payload);
      yield put({
        type: 'createTaskSuccess',
        payload: { createTaskResult },
      });
    },
    // 获取净创收数据
    * getIncomeData({ payload }, { call, put }) {
      const response = yield call(api.queryKpiIncome, payload);
      const { resultData } = response;
      yield put({
        type: 'getIncomeDataSuccess',
        payload: resultData,
      });
    },
    // 获取个人和机构联系方式
    * getCustContact({ payload }, { call, put, select }) {
      const custContactData = yield select(state => state.customerPool.custEmail);
      const custId = payload.custId;
      let resultData = null;
      if (!_.isEmpty(custContactData[custId])) {
        resultData = custContactData[custId];
      } else {
        const response = yield call(api.queryCustContact, payload);
        resultData = response.resultData;
      }
      yield put({
        type: 'getCustContactSuccess',
        payload: { resultData, custId },
      });
    },
    * getCustEmail({ payload }, { call, put, select }) {
      const custEmailData = yield select(state => state.customerPool.custContactData);
      const { custId } = payload;
      let resultData = null;
      if (!_.isEmpty(custEmailData[custId])) {
        resultData = custEmailData[custId];
      } else {
        const response = yield call(api.queryCustContact, payload);
        resultData = response.resultData;
      }
      yield put({
        type: 'getCustEmailSuccess',
        payload: { resultData, custId },
      });
    },
    // 获取最近五次服务记录
    * getServiceRecord({ payload }, { call, put }) {
      const response = yield call(api.queryRecentServiceRecord, payload);
      const { resultData } = response;
      const { custId } = payload;
      yield put({
        type: 'getServiceRecordSuccess',
        payload: { resultData, custId },
      });
    },
    * getFollowCust({ payload }, { call, put }) {
      yield put({
        type: 'getFollowCustSuccess',
        payload: {
          value: true,
          message: '开始开始',
        },
      });
      const response = yield call(api.followCust, payload);
      const { resultData } = response;
      yield put({
        type: 'getFollowCustSuccess',
        payload: {
          value: false,
          message: '关注成功',
          fllowCustData: resultData,
        },
      });
    },
    // 列表页添加服务记录
    * addServeRecord({ payload }, { call, put }) {
      const res = yield call(api.addServeRecord, payload);
      yield put({
        type: 'addServeRecordSuccess',
        payload: res,
      });
    },
    // 获取客户分组
    * getCustomerGroupList({ payload }, { call, put }) {
      const response = yield call(api.queryCustomerGroupList, payload);
      const { resultData } = response;
      yield put({
        type: 'getCustomerGroupListSuccess',
        payload: resultData,
      });
    },
    // 获取分组客户
    * getGroupCustomerList({ payload }, { call, put }) {
      const response = yield call(api.queryGroupCustomerList, payload);
      const { resultData } = response;
      yield put({
        type: 'getGroupCustomerListSuccess',
        payload: resultData,
      });
    },
    // 分组客户下联想的推荐热词列表
    * getCustomerHotPossibleWds({ payload }, { call, put }) {
      const response = yield call(api.queryPossibleCustList, payload);
      const { resultData } = response;
      yield put({
        type: 'getCustomerHotPossibleWdsSuccess',
        payload: resultData,
      });
    },
    // 分组客户下默认推荐词及热词推荐列表及历史搜索数据
    * getCustomerHistoryWdsList({ payload }, { call, put }) {
      const history = yield call(api.getHistoryWdsList, payload);
      yield put({
        type: 'getCustomerHistoryWdsListSuccess',
        payload: { history },
      });
    },
    // 分组客户下清除历史搜索列表
    * clearCustomerSearchHistoryList({ payload }, { call, put }) {
      const clearHistoryState = yield call(api.clearSearchHistoryList, payload);
      yield put({
        type: 'clearCustomerSearchHistoryListSuccess',
        payload: { clearHistoryState },
      });
    },
    // 新增，编辑客户分组
    * operateGroup({ payload }, { call, put }) {
      const { groupId } = payload;
      const response = yield call(api.operateGroup, payload);
      const { resultData } = response;
      let message;
      yield put({
        type: 'operateGroupSuccess',
        payload: resultData,
      });
      if (groupId) {
        // 更新
        message = '更新分组成功';
      } else {
        message = '新增分组成功';
      }
      yield put({
        type: 'toastM',
        message,
        duration: 2,
      });
      // 成功之后，更新分组信息
      yield put({
        type: 'getCustomerGroupList',
        payload: {
          pageNum: 1,
          pageSize: 10,
        },
      });
    },
    * toastM({ message, duration }) {
      yield toastM(message, duration);
    },
    // 删除客户分组
    * deleteGroup({ payload }, { call, put }) {
      const response = yield call(api.deleteGroup, payload);
      const { resultData } = response;
      yield put({
        type: 'deleteGroupSuccess',
        payload: resultData,
      });
      yield put({
        type: 'toastM',
        message: '删除分组成功',
        duration: 2,
      });
      // 删除成功之后，更新分组信息
      yield put({
        type: 'getCustomerGroupList',
        payload: {
          pageNum: 1,
          pageSize: 10,
        },
      });
    },
    * deleteCustomerFromGroup({ payload }, { call, put }) {
      const response = yield call(api.deleteCustomerFromGroup, payload);
      const { custId, groupId } = payload;
      const { resultData } = response;
      yield put({
        type: 'deleteCustomerFromGroupSuccess',
        payload: { resultData, custId, groupId },
      });
      yield put({
        type: 'toastM',
        message: '删除分组下客户成功',
        duration: 2,
      });
      // 删除成功之后，更新分组信息
      yield put({
        type: 'getCustomerGroupList',
        payload: {
          pageNum: 1,
          pageSize: 10,
        },
      });
    },
    // 360服务记录查询
    * getServiceLog({ payload }, { call, put }) {
      const response = yield call(api.queryAllServiceRecord, payload);
      const { resultData } = response;
      yield put({
        type: 'getServiceLogSuccess',
        payload: { resultData },
      });
    },
    * getSearchServerPersonList({ payload }, { call, put, select }) {
      const { resultData = EMPTY_OBJECT } = yield call(api.getSearchServerPersonelList, payload);
      const { empInfo } = yield select(state => state.app.empInfo);
      const myInfo = {
        ptyMngName: empInfo.empName,
        ptyMngId: empInfo.empNum,
      };
      const all = {
        ptyMngName: '所有人',
        ptyMngId: '',
      };
      const { servicePeopleList = EMPTY_LIST } = resultData;
      yield put({
        type: 'getSearchServerPersonListSuccess',
        payload: [all, myInfo, ...servicePeopleList],
      });
    },
    // 360服务记录查询更多服务
    * getServiceLogMore({ payload }, { call, put }) {
      const response = yield call(api.queryAllServiceRecord, payload);
      const { resultData } = response;
      yield put({
        type: 'getServiceLogMoreSuccess',
        payload: { resultData },
      });
    },
    // 预览客户细分导入数据
    * priviewCustFile({ payload }, { call, put }) {
      const response = yield call(api.priviewCustFile, payload);
      const { resultData } = response;
      yield put({
        type: 'priviewCustFileSuccess',
        payload: resultData,
      });
    },
    // 根据权限获取组织机构树
    * getCustRangeByAuthority({ payload }, { call, put }) {
      console.log('1111111111111111');
      const resultData = yield call(api.getCustRangeByAuthority);
      console.log('resultData>>>>>>>', resultData);
      yield put({
        type: 'getCustRangeByAuthoritySuccess',
        payload: resultData,
      });
    },
    // 标签圈人
    * getCirclePeople({ payload }, { call, put }) {
      const response = yield call(api.labelCirclePeople, payload);
      const { resultData } = response;
      yield put({
        type: 'getCirclePeopleSuccess',
        payload: { resultData },
      });
    },
    // 标签圈人-id查询客户列表
    * getPeopleOfLabel({ payload }, { call, put }) {
      const response = yield call(api.labelCirclePeople, payload);
      const { resultData } = response;
      yield put({
        type: 'getPeopleOfLabelSuccess',
        payload: { resultData },
      });
    },
    // 提交任务流程
    * submitTaskFlow({ payload }, { call, put }) {
      const response = yield call(api.submitTaskFlow, payload);
      const { resultData } = response;
      yield put({
        type: 'submitTaskFlowSuccess',
        payload: resultData,
      });
    },
    // 获取审批人列表
    * getApprovalList({ payload }, { call, put }) {
      const response = yield call(api.queryFlowStepInfo, payload);
      const { resultData = EMPTY_OBJECT } = response;
      const { flowButtons: [{ flowAuditors }] } = resultData;

      yield put({
        type: 'getApprovalListSuccess',
        payload: flowAuditors,
      });
    },
  },
  reducers: {
    getPerformanceIndicatorsSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        performanceIndicators: resultData,
      };
    },
    getHSRateAndBusinessIndicatorSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        hsRateAndBusinessIndicator: resultData,
      };
    },
    getInformationSuccess(state, action) {
      const { payload: { resultData } } = action;
      // 记录页码对应的列表数据
      return {
        ...state,
        information: resultData,
      };
    },
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
    // 经营指标
    getManageIndicatorsSuccess(state, action) {
      const { payload: { indicators } } = action;
      const manageIndicators = indicators.resultData;
      return {
        ...state,
        manageIndicators,
      };
    },
    // (首页总数)
    getWorkFlowTaskCountSuccess(state, action) {
      const { payload: { queryNumbers } } = action;
      const process = queryNumbers.resultData;
      return {
        ...state,
        process,
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
        pageNo: Number(custListVO.curPageNum),
        total: custListVO.totalCount > LIST_MAX ? LIST_MAX : custListVO.totalCount,
      };
      return {
        ...state,
        custList: custListVO.custList,
        custPage,
      };
    },
    getCustIncomeSuccess(state, action) {
      const { payload: { custNumber, monthlyProfits } } = action;
      return {
        ...state,
        monthlyProfits: {
          ...state.monthlyProfits,
          [custNumber]: monthlyProfits,
        },
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
      const { custGroupDTOList, curPageNum, pageSize, totalRecordNum } = resultData;
      if (!resultData) {
        return {
          ...state,
          cusgroupList: [],
          cusgroupPage: {
            curPageNum,
            pageSize,
            totalRecordNum,
          },
        };
      }

      return {
        ...state,
        cusgroupList: custGroupDTOList,
        cusgroupPage: {
          curPageNum,
          pageSize,
          totalRecordNum,
        },
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
    // 添加到现有分组保存成功
    addCusToGroupSuccess(state, action) {
      const { payload: { groupId, result } } = action;
      return {
        ...state,
        resultgroupId: groupId,
        cusGroupSaveResult: result,
      };
    },
    // 自建任务提交
    createTaskSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        createTaskResult: payload,
      };
    },
    // 获取净创收数据成功
    getIncomeDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        incomeData: !_.isEmpty(payload) ? payload : [],
      };
    },
    // 获取联系方式成功
    getCustContactSuccess(state, action) {
      const { payload: { resultData, custId } } = action;
      return {
        ...state,
        custContactData: {
          [custId]: resultData,
        },
      };
    },
    // custEmail获取成功
    getCustEmailSuccess(state, action) {
      const { payload: { resultData, custId } } = action;
      return {
        ...state,
        custEmail: {
          [custId]: resultData,
        },
      };
    },
    // 获取服务记录成功
    getServiceRecordSuccess(state, action) {
      const { payload: { resultData, custId } } = action;
      return {
        ...state,
        serviceRecordData: {
          [custId]: resultData,
        },
      };
    },
    addServeRecordSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        addServeRecordSuccess: payload.resultData === 'success',
      };
    },
    // 关注成功
    getFollowCustSuccess(state, action) {
      const { payload: { value, message, fllowCustData } } = action;
      return {
        ...state,
        followLoading: value,
        message,
        fllowCustData,
      };
    },
    // 获取客户分组成功
    getCustomerGroupListSuccess(state, action) {
      const { payload } = action;
      const { custGroupDTOList = EMPTY_LIST, totalRecordNum } = payload;

      return {
        ...state,
        customerGroupList: {
          page: {
            // 后台返回的一直是null，所以不要了
            // curPageNum,
            // pageSize,
            totalRecordNum,
          },
          resultData: custGroupDTOList || EMPTY_LIST,
        },
      };
    },
    // 获取指定分组客户成功
    getGroupCustomerListSuccess(state, action) {
      const { payload } = action;
      const { totalRecordNum, groupCustDTOList = EMPTY_LIST } = payload;

      return {
        ...state,
        groupCustomerList: {
          page: {
            // 后台返回的一直是null，所以不要了
            // curPageNum,
            // pageSize,
            totalRecordNum,
          },
          resultData: groupCustDTOList || EMPTY_LIST,
        },
      };
    },
    // 分组客户下的历史搜索列表
    getCustomerHistoryWdsListSuccess(state, action) {
      const { payload: { history: { resultData: { historyWdsList } } } } = action;
      return {
        ...state,
        customerHistoryWordsList: historyWdsList,
      };
    },
    // 清除分组客户下历史搜索列表
    clearCustomerSearchHistoryListSuccess(state, action) {
      const { payload: { clearHistoryState: { clearState } } } = action;
      return {
        ...state,
        isClearCustomerHistorySuccess: clearState,
      };
    },
    // 分组客户下保存搜索内容
    saveCustomerSearchVal(state, action) {
      const { payload: { searchVal } } = action;
      return {
        ...state,
        customerSearchHistoryVal: searchVal,
      };
    },
    // 分组客户下联想的推荐热词列表
    getCustomerHotPossibleWdsSuccess(state, action) {
      const { payload } = action;
      const { custList } = payload;
      // 构造成联想列表识别的
      const finalPossibleHotCust = _.map(custList, item => ({
        id: item.cusId,
        labelNameVal: item.cusId,
        labelDesc: item.custName,
        ...item,
      }));

      return {
        ...state,
        customerHotPossibleWordsList: finalPossibleHotCust,
      };
    },
    // 新增、编辑分组成功
    operateGroupSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        // success
        operateGroupResult: payload,
        // 成功
        cusGroupSaveResult: payload,
      };
    },
    // 删除分组成功
    deleteGroupSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        // success
        deleteGroupResult: payload,
      };
    },
    // 删除分组下的客户成功
    deleteCustomerFromGroupSuccess(state, action) {
      const { payload: { resultData, custId, groupId } } = action;
      return {
        ...state,
        // success
        // 以groupId和custId来做主键
        deleteCustomerFromGroupResult: {
          [`${groupId}_${custId}`]: resultData,
        },
      };
    },
    // 360服务记录查询成功
    getServiceLogSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        serviceLogData: resultData,
      };
    },
    getSearchServerPersonListSuccess(state, action) {
      return {
        ...state,
        searchServerPersonList: action.payload,
      };
    },
    // 360服务记录查询更多服务成功
    getServiceLogMoreSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        serviceLogMoreData: resultData,
      };
    },
    // 获取客户细分列表成功
    priviewCustFileSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        priviewCustFileData: payload,
      };
    },
    // 存储任务流程数据
    saveTaskFlowData(state, action) {
      const { payload } = action;
      return {
        ...state,
        storedTaskFlowData: payload,
      };
    },
    // 清除任务流程数据
    clearTaskFlowData(state, action) {
      const { payload } = action;
      return {
        ...state,
        storedTaskFlowData: payload,
      };
    },
    getCustRangeByAuthoritySuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        serviceDepartment: resultData,
      };
    },
    // 标签圈人成功
    getCirclePeopleSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        circlePeopleData: resultData,
      };
    },
    // 标签圈人-id客户列表查询
    getPeopleOfLabelSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        peopleOfLabelData: resultData,
      };
    },
    // 保存当前选中tab
    saveCurrentTab(state, action) {
      const { payload } = action;
      return {
        ...state,
        currentTab: payload,
      };
    },
    // 提交任务流程成功
    submitTaskFlowSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        submitTaskFlowResult: payload,
      };
    },
    // 获取审批人列表成功
    getApprovalListSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        approvalList: payload,
      };
    },
  },
};
