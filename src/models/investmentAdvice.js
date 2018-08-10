/* eslint-disable import/no-anonymous-default-export */
/*
 * @Author: zhangjun
 * @Date: 2018-04-25 15:37:57
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-06 16:21:26
 */
import { investmentAdvice as api } from '../api';

export default {
  namespace: 'investmentAdvice',
  state: {
    // 投资模板列表
    investmentAdvices: {},
    // 删除是否成功
    deleteSuccessStatus: false,
    // 新建或编辑模版是否成功
    modifySuccessStatus: false,
    // 投资建议文本撞墙检测是否有股票代码
    testWallCollisionStatus: false,
    // 任务绑定投资建议模板列表
    taskBindTemplate: {},
    // 删除任务绑定投资建议模板状态
    delTaskBindTemplateStatus: '',
    // 可选投资模板列表
    templateList: [],
    // 绑定模板列表状态
    bindTemplateStatus: '',
  },
  reducers: {
    // 投资模板列表
    getInvestmentAdviceListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        investmentAdvices: resultData,
      };
    },
    // 删除是否成功
    deleteInvestAdviceSuccess(state, action) {
      const { payload = '' } = action;
      return {
        ...state,
        deleteSuccessStatus: payload === 'success',
      };
    },
    // 新建或编辑模版是否成功
    modifyInvestAdviceSuccess(state, action) {
      const { payload = '' } = action;
      return {
        ...state,
        modifySuccessStatus: payload === 'success',
      };
    },
    // 投资建议文本撞墙检测是否有股票代码
    testWallCollisionSuccess(state, action) {
      const { payload = '' } = action;
      return {
        ...state,
        testWallCollisionStatus: payload === 'failure',
      };
    },

    getTaskBindListSuccess(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        taskBindTemplate: payload,
      };
    },

    delTaskBindTemplateSuccess(state, action) {
      const { payload = 'failure' } = action;
      return {
        ...state,
        delTaskBindTemplateStatus: payload,
      };
    },

    getOptionalTemplateListSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        templateList: resultData.list || [],
      };
    },

    bindTemplateListSuccess(state, action) {
      const { payload: { resultData = 'failure' } } = action;
      return {
        ...state,
        bindTemplateStatus: resultData,
      };
    },
  },
  effects: {
    // 获取投资建议模版列表
    * getInvestmentAdviceList({ payload }, { call, put }) {
      const response = yield call(api.getInvestAdviceList, payload);
      yield put({
        type: 'getInvestmentAdviceListSuccess',
        payload: response,
      });
    },

    // 删除投资建议固定话术模板
    * deleteInvestAdvice({ payload }, { call, put }) {
      // 删除时把deleteSuccessStatus改成false
      yield put({
        type: 'deleteInvestAdviceSuccess',
        payload: '',
      });
      const { resultData } = yield call(api.deleteInvestAdvice, payload);
      yield put({
        type: 'deleteInvestAdviceSuccess',
        payload: resultData,
      });
    },

    // 新建或编辑模版
    * modifyInvestAdvice({ payload }, { call, put }) {
      yield put({
        type: 'modifyInvestAdviceSuccess',
        payload: '',
      });
      const { resultData } = yield call(api.modifyInvestAdvice, payload);
      yield put({
        type: 'modifyInvestAdviceSuccess',
        payload: resultData,
      });
    },

    // 投资建议文本撞墙检测
    * testWallCollision({ payload }, { call, put }) {
      // 检测时把testWallCollisionStatus改成false
      yield put({
        type: 'testWallCollisionSuccess',
        payload: '',
      });
      const { resultData } = yield call(api.testWallCollision, payload);
      yield put({
        type: 'testWallCollisionSuccess',
        payload: resultData,
      });
    },

    // 查询任务绑定投资建议模板列表
    * getTaskBindList({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryTaskBindTemplateList, payload);
      yield put({
        type: 'getTaskBindListSuccess',
        payload: resultData,
      });
    },

    // 删除任务绑定的投资建议模板
    * delTaskBindTemplate({ payload }, { call, put }) {
      yield put({
        type: 'delTaskBindTemplateSuccess',
        payload: 'failure',
      });
      const { resultData } = yield call(api.delTaskBindTemplate, payload);
      yield put({
        type: 'delTaskBindTemplateSuccess',
        payload: resultData,
      });
    },

    // 查询任务绑定模板中的可选模板列表
    * getOptionalTemplateList({ payload }, { call, put }) {
      const response = yield call(api.getInvestAdviceList, payload);
      yield put({
        type: 'getOptionalTemplateListSuccess',
        payload: response,
      });
    },

    // 给当前任务绑定投资建议模板
    * bindTemplateList({ payload }, { call, put }) {
      yield put({
        type: 'bindTemplateListSuccess',
        payload: { resultData: 'failure' },
      });
      const response = yield call(api.bindTemplateListForMission, payload);
      yield put({
        type: 'bindTemplateListSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
