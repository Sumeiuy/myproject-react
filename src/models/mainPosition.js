/*
 * @Description: 设置主职位的 model 层
 * @Author: LiuJianShu
 * @Date: 2017-12-21 16:13:50
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-12-21 17:09:06
 */

import { mainPosition as api } from '../api';

export default {
  namespace: 'mainPosition',
  state: {
    // 员工列表
    employeeList: [],
    // 职位列表
    positionList: [],
  },
  reducers: {
    // 搜索员工信息
    searchEmployeeSuccess(state, action) {
      const { payload: { resultData = [] } } = action;
      return {
        ...state,
        employeeList: resultData,
      };
    },
    searchPositionSuccess(state, action) {
      const { payload: { resultData = [] } } = action;
      return {
        ...state,
        positionList: resultData,
      };
    },
    clearPropsSuccess(state) {
      return {
        ...state,
        employeeList: [],
        positionList: [],
      };
    },
  },
  effects: {
    // 搜索员工信息
    * searchEmployee({ payload }, { call, put }) {
      const response = yield call(api.searchEmployee, payload);
      yield put({
        type: 'searchEmployeeSuccess',
        payload: response,
      });
    },
    // 根据员工 ID 查询员工职位
    * searchPosition({ payload }, { call, put }) {
      const response = yield call(api.searchPosition, payload);
      yield put({
        type: 'searchPositionSuccess',
        payload: response,
      });
    },
    // 设置主职位
    * updatePosition({ payload }, { call }) {
      yield call(api.updatePosition, payload);
      // yield put({
      //   type: 'updatePositionSuccess',
      //   payload: response,
      // });
    },
    // 清除员工列表、员工职位列表
    * clearProps({ payload }, { put }) {
      yield put({
        type: 'clearPropsSuccess',
        payload: [],
      });
    },
  },
  subscriptions: {},
};
