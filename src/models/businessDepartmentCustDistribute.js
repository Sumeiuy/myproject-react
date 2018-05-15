/**
 * @Author: sunweibin
 * @Date: 2018-05-08 13:27:31
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-15 16:49:59
 * @description 营业部非投顾签约客户分配
 */

import { businessDepartmentCustDistribute as api } from '../api';

export default {
  namespace: 'custDistribute',
  state: {
    // 签约客户分配右侧详情
    detailInfo: {},
    // 新建客户分配时候的服务经理列表
    empList: [],
    // 新建页面中Excel表格中的客户列表数据
    custListInExcel: [],
  },

  reducers: {
    getApplyDetailSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        detailInfo: payload,
      };
    },

    getEmpListSuccess(state, action) {
      const { payload: { empList = [] } } = action;
      return {
        ...state,
        empList,
      };
    },

    getCustListInExcelSuccess(state, action) {
      const { payload: { custList = [] } } = action;
      return {
        ...state,
        custListInExcel: custList,
      };
    },
  },

  effects: {
    // 获取营业部非投顾签约客户分配申请单详情
    * getApplyDetail({ payload }, { call, put }) {
      const { resultData = {} } = yield call(api.getAppDetail, payload);
      yield put({
        type: 'getApplyDetailSuccess',
        payload: resultData,
      });
    },

    // 获取营业部非投顾签约客户分配新建中的服务经理列表
    * getEmpList({ payload }, { call, put }) {
      const { resultData = {} } = yield call(api.queryEmpList, payload);
      yield put({
        type: 'getEmpListSuccess',
        payload: resultData,
      });
    },

    // 获取 Excel 表格中的客户数据
    * getCustListInExcel({ payload }, { call, put }) {
      const { resultData = {} } = yield call(api.getCustListInExcel, payload);
      yield put({
        type: 'getCustListInExcelSuccess',
        payload: resultData,
      });
    },
  },

  subscriptions: {},
};
