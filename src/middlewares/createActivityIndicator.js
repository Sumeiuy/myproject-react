/**
 * @file middlewares/createActivityIndicator.js
 *  山寨了一个dva-loading,只用于activetyIndicator显示
 * @author maoquan(maoquan@htsc.com)
 */

const SHOW = '@@HT_LOADING/SHOW_ACTIVITY_INDICATOR';
const HIDE = '@@HT_LOADING/HIDE_ACTIVITY_INDICATOR';
const NAMESPACE = 'activity';

export default function createActivityIndicator(opts = {}) {
  const namespace = opts.namespace || NAMESPACE;
  const initialState = {
    global: 0,
  };

  const extraReducers = {
    [namespace](state = initialState, { type, forceFull }) {
      let glebalStateNumber = state.global;
      let ret;
      switch (type) {
        case SHOW:
          ret = {
            ...state,
            global: ++glebalStateNumber,
            forceFull,
          };
          break;
        case HIDE:
          ret = {
            ...state,
            global: --glebalStateNumber,
            forceFull,
          };
          break;
        default:
          ret = state;
          break;
      }
      return ret;
    },
  };

  function onEffect(effect, { put }) {
    return function* effectWrapper(...args) {
      const { loading, forceFull } = args[0];
      if (loading !== false) {
        yield put({ type: SHOW, forceFull });
      }
      yield effect(...args);
      if (loading !== false) {
        yield put({ type: HIDE, forceFull });
      }
    };
  }

  return {
    extraReducers,
    onEffect,
  };
}
