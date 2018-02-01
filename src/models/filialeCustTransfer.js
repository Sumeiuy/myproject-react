/*
 * @Author: XuWenKang
 * @Description: 分公司客户划转modal
 * @Date: 2017-12-13 10:31:34
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-02 10:31:07
 */

import { filialeCustTransfer as api } from '../api';
import { emp } from '../../src/helper';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
// 空值对象，用于字段占位
const PLACEHOLDER_OBJECT = {
  brokerNumber: '', // 经济客户号
  custName: '', // 客户名称
  orgName: '', // 原服务营业部
  empName: '', // 原服务经理
  postnName: '', // 原职位
  newOrgName: '', // 新服务营业部
  newEmpName: '', // 新服务经理
  newPostnName: '', // 新职位
};

export default {
  namespace: 'filialeCustTransfer',
  state: {
    detailInfo: EMPTY_OBJECT, // 详情
    custList: EMPTY_LIST, // 客户列表列表
    managerData: EMPTY_LIST, // 服务经理数据
    newManagerList: EMPTY_LIST, // 新服务经理列表
    customerAssignImport: EMPTY_OBJECT,  // 批量划转的客户
  },
  reducers: {
    getDetailInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },
    getCustListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        custList: resultData,
      };
    },
    compareData(state, action) {
      const { payload } = action;
      const prevManagerData = state.managerData[0];
      const managerData = {
        ...PLACEHOLDER_OBJECT,
        ...prevManagerData,
        ...payload,
      };
      return {
        ...state,
        managerData: [managerData],
      };
    },
    getNewManagerListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      // 字段转化，用于将新服务经理和原服务经理区分开
      const newResultData = resultData.map(v => (
        {
          newEmpName: v.empName,
          newIntegrationId: v.integrationId,
          newLogin: v.login,
          newOrgName: v.orgName,
          newPostnId: v.postnId,
          newPostnName: v.postnName,
          showSelectName: `${v.empName} ${v.postnName} ${v.login}`,
        }
      ));
      return {
        ...state,
        newManagerList: newResultData,
      };
    },
    emptyQueryDataSuccess(state) {
      return {
        ...state,
        custList: EMPTY_LIST,
        managerData: EMPTY_LIST,
        newManagerList: EMPTY_LIST,
      };
    },
    queryCustomerAssignImportSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        customerAssignImport: {
          list: resultData.list,
          page: resultData.page,
        },
      };
    },
  },
  effects: {
    // 右侧详情
    * getDetailInfo({ payload }, { call, put }) {
      const response = yield call(api.getDetailInfo, payload);
      yield put({
        type: 'getDetailInfoSuccess',
        payload: response,
      });
    },
    // 查询客户列表
    * getCustList({ payload }, { call, put }) {
      const newPayload = {
        ...payload,
        integrationId: emp.getOrgId(),
      };
      const response = yield call(api.getCustList, newPayload);
      yield put({
        type: 'getCustListSuccess',
        payload: response,
      });
    },
    // 获取原客户经理
    * getOldManager({ payload }, { call, put }) {
      const response = yield call(api.getOldManager, payload);
      const { resultData = EMPTY_OBJECT } = response;
      // 获取到原客户经理之后调用compareData，将原客户经理数据和新服务经理数据合并传入commonTable
      yield put({
        type: 'compareData',
        payload: resultData,
      });
    },
    // 选择新客户经理
    * selectNewManager({ payload }, { put }) {
      // 获取到原客户经理之后调用compareData，将原客户经理数据和新服务经理数据合并传入commonTable
      yield put({
        type: 'compareData',
        payload,
      });
    },
    // 获取新客户经理列表
    * getNewManagerList({ payload }, { call, put }) {
      const newPayload = {
        ...payload,
        integrationId: emp.getOrgId(),
      };
      const response = yield call(api.getNewManagerList, newPayload);
      yield put({
        type: 'getNewManagerListSuccess',
        payload: response,
      });
    },
    // 提交保存
    * saveChange({ payload }, { call }) {
      yield call(api.saveChange, payload);
    },
    // 提交成功后清除上一次的数据
    * emptyQueryData({ payload }, { put }) {
      yield put({
        type: 'emptyQueryDataSuccess',
      });
    },
    // 获取导入的批量划转的数据
    * queryCustomerAssignImport({ payload }, { call, put }) {
      const response = yield call(api.queryCustomerAssignImport, payload);
      yield put({
        type: 'queryCustomerAssignImportSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname }) => {
    //     // 第一次进入页面查询客户列表
    //     if (pathname === '/filialeCustTransfer') {
    //       // 进入页面查询子类型列表
    //       dispatch({ type: 'getCustList', payload: {keyword: ''} });
    //       // 进入页面查询新服务经理列表
    //       dispatch({ type: 'getNewManagerList', payload: {login: ''} });
    //     }
    //   });
    // },
  },
};
