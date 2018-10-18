/* eslint-disable import/no-anonymous-default-export */
/**
 * @file models/global.js
 *  全局模型管理
 * @author zhufeiyang
 */

import _ from 'lodash';
import { BLOCK_JSP_TEST_ELEM } from '../routes/fspPage/config';

export default {
  namespace: 'global',
  state: {
    // jsp页面发生更改时，跳转前确认操作
    isBlocking: false,
  },
  effects: {
  },
  reducers: {
    switchBlockJspJump(state, action) {
      const { payload: { isBlocking } } = action;
      return {
        ...state,
        isBlocking,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (_.find(BLOCK_JSP_TEST_ELEM, item => item.pathname === pathname)) {
          dispatch({ type: 'switchBlockJspJump', payload: { isBlocking: true }});
        } else {
          dispatch({ type: 'switchBlockJspJump', payload: { isBlocking: false }});
        }
      });
    },
  },
};
