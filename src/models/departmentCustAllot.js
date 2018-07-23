/**
 * @Description: 分公司客户分配 model
 * @Author: Liujianshu
 * @Date: 2018-05-23 14:30:12
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-07-23 14:25:03
 */
import { custAllot as api } from '../api';

const EMPTY_OBJECT = {};

export default {
  namespace: 'departmentCustAllot',
  state: {
    detailInfo: EMPTY_OBJECT, // 详情
    buttonData: EMPTY_OBJECT, // 获取按钮列表和下一步审批人
    custData: EMPTY_OBJECT, // 客户列表列表
    manageData: EMPTY_OBJECT,  // 服务经理列表
    updateData: EMPTY_OBJECT,  // 更新客户
    detailAddedCustData: EMPTY_OBJECT,  // 详情页已添加客户
    addedCustData: EMPTY_OBJECT,  // 已添加客户
    addedManageData: EMPTY_OBJECT,  // 已添加服务经理
    saveChangeData: EMPTY_OBJECT,  // 提交保存后的数据
    notifiesData: EMPTY_OBJECT,  // 消息提醒页面数据
  },
  reducers: {
    // 详情
    queryDetailInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },
    // 下一步按钮和审批人
    queryButtonListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        buttonData: resultData,
      };
    },
    // 查询客户
    queryCustListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        custData: resultData,
      };
    },
    // 查询服务经理
    queryManageListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        manageData: resultData,
      };
    },
    // 添加、删除、清空客户
    updateListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        updateData: resultData,
      };
    },
    queryDetailAddedCustListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailAddedCustData: resultData,
      };
    },
    // 已添加的客户列表
    queryAddedCustListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        addedCustData: resultData,
      };
    },
    // 已添加的服务经理列表
    queryAddedManageListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        addedManageData: resultData,
      };
    },
    saveChangeSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        saveChangeData: resultData,
      };
    },
    // 消息提醒页面数据
    queryNotifiesListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        notifiesData: resultData,
      };
    },
    // 清除数据
    clearDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 右侧详情
    * queryDetailInfo({ payload }, { call, put }) {
      const response = yield call(api.queryDetailInfo, payload);
      yield put({
        type: 'queryDetailInfoSuccess',
        payload: response,
      });
    },
    // 查询下一把按钮和审批人
    * queryButtonList({ payload }, { call, put }) {
      const response = yield call(api.queryButtonList, payload);
      yield put({
        type: 'queryButtonListSuccess',
        payload: response,
      });
    },
    // 查询客户列表
    * queryCustList({ payload }, { call, put }) {
      const response = yield call(api.queryCustList, payload);
      yield put({
        type: 'queryCustListSuccess',
        payload: response,
      });
    },
    // 查询服务经理
    * queryManageList({ payload }, { call, put }) {
      const response = yield call(api.queryManageList, payload);
      yield put({
        type: 'queryManageListSuccess',
        payload: response,
      });
    },
    // 批量添加、删除、清空客户
    * updateList({ payload }, { call, put }) {
      const response = yield call(api.updateList, payload);
      yield put({
        type: 'updateListSuccess',
        payload: response,
      });
    },
    // 查询已添加的客户列表
    * queryAddedCustList({ payload }, { call, put }) {
      const response = yield call(api.queryAddedCustList, payload);
      let type = 'queryAddedCustListSuccess';
      if (payload.isDetail) {
        type = 'queryDetailAddedCustListSuccess';
      }
      yield put({
        type,
        payload: response,
      });
    },
    // 查询已添加的服务经理列表
    * queryAddedManageList({ payload }, { call, put }) {
      const response = yield call(api.queryAddedManageList, payload);
      yield put({
        type: 'queryAddedManageListSuccess',
        payload: response,
      });
    },
    // 提交
    * saveChange({ payload }, { call, put }) {
      const response = yield call(api.saveChange, payload);
      yield put({
        type: 'saveChangeSuccess',
        payload: response,
      });
    },
    // 提交保存
    * doApprove({ payload }, { call }) {
      yield call(api.doApprove, payload);
    },
    // 消息提醒页面数据
    * queryNotifiesList({ payload }, { call, put }) {
      const response = yield call(api.queryNotifiesList, payload);
      yield put({
        type: 'queryNotifiesListSuccess',
        payload: response,
      });
    },
    // 清空搜索数据
    * clearData({ payload }, { put }) {
      let response = {};
      // 根据不同类型，清空不同数据
      switch (payload) {
        case 'clearAllData':
          response = {
            custData: {}, // 客户列表列表
            manageData: {},  // 服务经理列表
            addedCustData: {},  // 已添加客户
            addedManageData: {},  // 已添加服务经理
            updateData: {},  // 批量添加、删除、清空客户
          };
          break;
        case 'clearSearchData':
          response = {
            custData: {}, // 客户列表列表
            manageData: {},  // 服务经理列表
          };
          break;
        case 'clearAddedCustData':
          response = {
            addedCustData: {},
          };
          break;
        default:
          response = {};
          break;
      }
      yield put({
        type: 'clearDataSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
