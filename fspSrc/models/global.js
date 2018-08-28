/* eslint-disable import/no-anonymous-default-export */
/**
 * @file models/global.js
 *  全局模型管理
 * @author zhufeiyang
 */

import { common as api } from '../../src/api';

export default {
  namespace: 'global',
  state: {
    // 根据用户权限可以查看的菜单
    menus: {},
  },
  effects: {
    // 获取用户有权限查看的菜单
    * getMenus({ payload }, { call, put }) {
      const response = yield call(api.getMenus, payload);
      yield put({
        type: 'getMenusSuccess',
        payload: response,
      });
    },
  },
  reducers: {
    // 根据用户权限可以查看的菜单
    getMenusSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      const { primaryMenu = [], secondaryMenu = [] } = resultData;
      return {
        ...state,
        menus: {
          primaryMenu,
          secondaryMenu,
        },
      };
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      // 初始化查询到用户信息后，立即查询用户的菜单权限
      dispatch({ type: 'getMenus' });
    },
  },
};
