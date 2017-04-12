/**
 * @file models/app.js
 *  全局模型管理
 * @author maoquan(maoquan@htsc.com)
 */

export default {
  namespace: 'app',
  state: {
    menuPopoverVisible: false,
    siderFold: localStorage.getItem('htSiderFold') === 'true',
    darkTheme: localStorage.getItem('htDarkTheme') !== 'false',
    useMenuPopover: document.body.clientWidth < 769,
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
        yield put({ type: 'showNavbar' });
      } else {
        yield put({ type: 'hideNavbar' });
      }
    },
    * switchMenuPopver({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchMenuPopover',
      });
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
    showNavbar(state) {
      return {
        ...state,
        useMenuPopover: true,
      };
    },
    hideNavbar(state) {
      return {
        ...state,
        useMenuPopover: false,
      };
    },
    handleSwitchMenuPopover(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
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
