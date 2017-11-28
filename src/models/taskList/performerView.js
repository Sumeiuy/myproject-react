/**
 * @Description: 执行者视图 model
 * @file models/taskList/performerView.js
 * @author hongguangqing
 */

import { performerView as api } from '../../api';

const EMPTY_OBJ = {};
const EMPTY_LIST = [];

const PAGE_SIZE = 8;
const PAGE_NO = 1;

export default {
  namespace: 'performerView',
  state: {
    // 记录详情中的参数
    parameter: {},
    // 执行者视图、管理者视图、创建者视图公共列表
    taskList: EMPTY_OBJ,
    // 任务详情中基本信息
    taskDetailBasicInfo: EMPTY_OBJ,
    // 任务详情中目标客户列表信息
    targetCustList: {
      list: EMPTY_LIST,
      page: {
        pageNo: PAGE_NO,
        pageSize: PAGE_SIZE,
        totalCount: 0,
      },
    },
    // 任务详情中目标客户列表当前选中的详情信息
    targetCustDetail: EMPTY_OBJ,
    // 客户uuid
    custUuid: '',
  },
  reducers: {
    changeParameterSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        parameter: payload,
      };
    },
    getTaskListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJ } } = action;
      const { page = EMPTY_OBJ, viewBaseInfoList = EMPTY_LIST } = resultData;
      return {
        ...state,
        taskList: {
          page,
          resultData: viewBaseInfoList,
        },
      };
    },
    getTaskDetailBasicInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        taskDetailBasicInfo: payload,
      };
    },
    queryTargetCustSuccess(state, action) {
      const { page, list } = action.payload;
      return {
        ...state,
        targetCustList: {
          list,
          page,
        },
      };
    },
    queryTargetCustDetailSuccess(state, action) {
      return {
        ...state,
        targetCustDetail: action.payload,
      };
    },
    queryCustUuidSuccess(state, action) {
      return {
        ...state,
        custUuid: action.payload,
      };
    },
  },
  effects: {
    * changeParameter({ payload }, { select, put }) {
      const prevParameter = yield select(state => state.performerView.parameter);
      yield put({
        type: 'changeParameterSuccess',
        payload: {
          ...prevParameter,
          ...payload,
        },
      });
    },

    // 执行者视图、管理者视图、创建者视图公共列表
    * getTaskList({ payload }, { call, put }) {
      const listResponse = yield call(api.queryTaskList, payload);
      yield put({
        type: 'getTaskListSuccess',
        payload: listResponse,
      });
    },

    // 执行者视图的详情基本信息
    * getTaskDetailBasicInfo({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryTaskDetailBasicInfo, payload);
      if (resultData) {
        yield put({
          type: 'getTaskDetailBasicInfoSuccess',
          payload: resultData,
        });
      }
    },

    // 执行者视图的详情目标客户
    * queryTargetCust({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryTargetCust, payload);
      if (resultData) {
        yield put({
          type: 'queryTargetCustSuccess',
          payload: resultData,
        });
      }
    },
    // 根据目标客户列表的当前选中项的custId查询详情
    // 此处接口依赖列表接口返回的数据，列表接口中有数据时才能去查详情，
    // 列表接口中的没有数据时，先查询列表接口
    * queryTargetCustDetail({ payload }, { call, put }) {
      const { custId } = payload;
      const { resultData } = yield call(api.queryTargetCustDetail, { custId });
      if (resultData) {
        yield put({
          type: 'queryTargetCustDetailSuccess',
          payload: resultData,
        });
      }
    },
    // 添加服务记录
    * addMotServeRecord({ payload }, { call }) {
      yield call(api.addMotServeRecord, payload);
    },
    // 上传文件之前，先查询uuid
    * queryCustUuid({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryCustUuid, payload);
      yield put({
        type: 'queryCustUuidSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
  },
};
