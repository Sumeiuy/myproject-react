/**
 *  @description 看板编辑页面的Model
 *  @author sunweibin
 */
import api from '../api';

export default {
  namespace: 'edit',
  state: {
    visibleRanges: [], // 可见范围
    boardInfo: {}, // 看板信息
    updateLoading: false, // 保存看板状态
    publishLoading: false, // 发布看板状态
    message: '', // 改变状态的信息
  },
  reducers: {
    getOneBoardInfoSuccess(state, action) {
      const { payload: { boardInfoResult } } = action;
      const boardInfo = boardInfoResult.resultData || {};
      return {
        ...state,
        boardInfo,
      };
    },
    // 获取可见范围筛选项
    getAllVisibleRangeSuccess(state, action) {
      const { payload: { allVisibleRange } } = action;
      const visibleRange = allVisibleRange.resultData;
      const first = {
        id: visibleRange.id,
        name: visibleRange.name,
        level: visibleRange.level,
      };
      const children = visibleRange.children.map(o => ({ id: o.id, name: o.name, level: o.level }));
      const visibleRangeAll = [first, ...children];
      return {
        ...state,
        visibleRanges: visibleRangeAll,
      };
    },

    // 各种操作
    operateBoardState(state, action) {
      const { payload: { name, value, message } } = action;
      return {
        ...state,
        [name]: value,
        message,
      };
    },
  },
  effects: {
    * getBoardInfo({ payload }, { call, put }) {
      // 获取某个看板信息，需要orgId和BoardId
      const boardInfoResult = yield call(api.getOneBoardInfo, payload);
      yield put({
        type: 'getOneBoardInfoSuccess',
        payload: { boardInfoResult },
      });
    },

    * getVisibleRange({ payload }, { call, put }) {
       // 查询可见范围
      const allVisibleRange = yield call(api.getVisibleRange, {
        orgId: payload.orgId,
      });
      yield put({
        type: 'getAllVisibleRangeSuccess',
        payload: { allVisibleRange },
      });
    },

    // 更新看板基本信息数据，如名称、可见范围
    * updateBoard({ payload }, { call, put }) {
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'updateLoading',
          value: true,
          message: '更新开始',
        },
      });
      const updateResult = yield call(api.updateBoard, payload);
      // 此处要判断是否保存成功
      console.log('updateBoardBasic>Result', updateResult);
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'updateLoading',
          value: false,
          message: '更新完成',
        },
      });
    },

    // 发布看板
    * publishBoard({ payload }, { call, put }) {
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'publishLoading',
          value: true,
          message: '发布开始',
        },
      });
      const publishResult = yield call(api.updateBoard, payload);
      console.log(publishResult);
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'publishLoading',
          value: false,
          message: '发布完成',
        },
      });
    },
  },
  subscriptions: {},
};
