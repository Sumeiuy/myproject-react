/* eslint-disable import/no-anonymous-default-export */
/**
 * @Author: sunweibin
 * @Date: 2018-05-08 13:27:31
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-01 18:53:24
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
    // 新建页面中筛选条件后的客户列表数据
    custListByFilter: {},
    // 根据关键字获取的客户列表
    custListByQuery: [],
    // 根据关键字获取的服务经理列表
    empListByQuery: [],
    // 根据关键字获取的开发经理列表
    devEmpListByQuery: [],
    // 客户分配审批人列表
    approvalList: [],
    // 创建客户分配审批结果
    createResult: false,
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

    filterCustListSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        custListByFilter: payload,
      };
    },

    queryDistributeCustSuccess(state, action) {
      const { payload: { custList = [] } } = action;
      return {
        ...state,
        custListByQuery: custList,
      };
    },

    queryDistributeEmpSuccess(state, action) {
      const { payload: { empList = [] } } = action;
      return {
        ...state,
        empListByQuery: empList,
      };
    },

    queryDistributeDevEmpSuccess(state, action) {
      const { payload: { empList = [] } } = action;
      return {
        ...state,
        devEmpListByQuery: empList,
      };
    },

    getApprovalsSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        approvalList: payload,
      };
    },

    createDistributeApplySuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        createResult: payload === 'Success',
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

    // 根据筛选条件获取客户列表
    * filterCustList({ payload }, { call, put }) {
      const { resultData = {} } = yield call(api.filterCustList, payload);
      yield put({
        type: 'filterCustListSuccess',
        payload: resultData,
      });
    },

    // 根据关键字查询客户
    * queryDistributeCust({ payload }, { call, put }) {
      const { resultData = {} } = yield call(api.queryDistributeCust, payload);
      yield put({
        type: 'queryDistributeCustSuccess',
        payload: resultData,
      });
    },
    // 根据关键字查询服务经理
    * queryDistributeEmp({ payload }, { call, put }) {
      const { resultData = {} } = yield call(api.queryDistributeEmp, payload);
      yield put({
        type: 'queryDistributeEmpSuccess',
        payload: resultData,
      });
    },
    // 根据关键字查询开发经理
    * queryDistributeDevEmp({ payload }, { call, put }) {
      const { resultData = {} } = yield call(api.queryDistributeDevEmp, payload);
      yield put({
        type: 'queryDistributeDevEmpSuccess',
        payload: resultData,
      });
    },

    // 获取审批人列表
    * getApprovals({ payload }, { call, put }) {
      const { resultData = [] } = yield call(api.getApprovals, payload);
      yield put({
        type: 'getApprovalsSuccess',
        payload: resultData,
      });
    },

    // 创建客户分配审批
    * createDistributeApply({ payload }, { call, put }) {
      const { resultData } = yield call(api.createDistributeApply, payload);
      yield put({
        type: 'createDistributeApplySuccess',
        payload: resultData,
      });
    },
  },

  subscriptions: {},
};
