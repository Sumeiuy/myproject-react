/**
 * @file models/app.js
 *  全局模型管理
 * @author maoquan(maoquan@htsc.com)
 */

export default {
  namespace: 'app',
  state: {
    siderFold: localStorage.getItem('htSiderFold') === 'true',
    darkTheme: localStorage.getItem('htDarkTheme') !== 'false',
    // 屏幕宽度很小的时候，不显示边栏
    siderAvailable: document.body.clientWidth < 769,
    navOpenKeys: [],
  },
  subscriptions: {
    setup({ dispatch }) {
      window.addEventListener(
        'resize',
        () => {
          dispatch({ type: 'changeNavbar' });
        },
      );
    },
  },
  effects: {
    * switchSider({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchSider',
      });
    },
    * changeTheme({
      payload,
    }, { put }) {
      yield put({
        type: 'handleChangeTheme',
      });
    },
    * changeNavbar({
      payload,
    }, { put }) {
      if (document.body.clientWidth < 769) {
        yield put({ type: 'showSidebar' });
      } else {
        yield put({ type: 'hideNavbar' });
      }
    },
  },
  reducers: {
    handleSwitchSider(state) {
      localStorage.setItem('htSiderFold', !state.siderFold);
      return {
        ...state,
        siderFold: !state.siderFold,
      };
    },
    handleChangeTheme(state) {
      localStorage.setItem('htDarkTheme', !state.darkTheme);
      return {
        ...state,
        darkTheme: !state.darkTheme,
      };
    },
    showSidebar(state) {
      return {
        ...state,
        siderAvailable: true,
      };
    },
    hideNavbar(state) {
      return {
        ...state,
        siderAvailable: false,
      };
    },
    changeOpenKeys(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
