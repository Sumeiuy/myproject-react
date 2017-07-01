/**
 * @file models/manage.js
 * @author sunweibin
 */
import api from '../api';
import { BoardBasic } from '../config';

export default {
  namespace: 'manage',
  state: {
    custRange: [],
    visibleBoards: [], // 可见看板
    editableBoards: [], // 可编辑看板
    visibleRanges: [], // 可见范围
  },
  reducers: {
    getAllVisibleReportsSuccess(state, action) {
      const { payload: { allVisibleReports } } = action;
      const visibleBoards = allVisibleReports.resultData || [];
      return {
        ...state,
        visibleBoards: [
          ...BoardBasic.regular,
          ...visibleBoards,
        ],
      };
    },

    getAllEditableReportsSucess(state, action) {
      const { payload: { allEditableBoards } } = action;
      const editableBoards = allEditableBoards.resultData || [];
      return {
        ...state,
        editableBoards,
      };
    },

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

    getCustRangeSuccess(state, action) {
      const { response: { resultData } } = action;
      let custRange;
      if (resultData.level === '1') {
        custRange = [
          { id: resultData.id, name: resultData.name, level: resultData.level },
          ...resultData.children,
        ];
      } else {
        custRange = [resultData];
      }
      return {
        ...state,
        custRange,
      };
    },
  },
  effects: {
    // 看板管理页面初始化需要 visibleRange, visibleBoards, editableBoards,
    // 参数需要orgId,
    * getAllInfo({ payload }, { call, put, select }) {
      // 首先需要获取custRange树
      // manage页面是从report页面跳转过来，此时report应该已经存在custRange
      // 除非用户手动输入Url,
      const cust = yield select(state => state.manage.custRange);
      let firstCust;
      if (cust.length) {
        firstCust = cust[0];
      } else {
        const response = yield call(api.getCustRange, payload);
        yield put({
          type: 'getCustRangeSuccess',
          response,
        });
        firstCust = response.resultData;
      }

      // 查询当前用户所能够看到的看板报表
      // 用于页面左上角，切换报表使用
      const allVisibleReports = yield call(api.getAllVisibleReports, {
        orgId: firstCust.id,
      });
      yield put({
        type: 'getAllVisibleReportsSuccess',
        payload: { allVisibleReports },
      });

      // 查询用户可编辑的看板
      const allEditableBoards = yield call(api.getAllEditableReports, {
        orgId: firstCust.id,
      });
      yield put({
        type: 'getAllEditableReportsSucess',
        payload: { allEditableBoards },
      });

      // 查询用户在创建报表看板的时候选择的可见范围
      const allVisibleRange = yield call(api.getVisibleRange, {
        orgId: firstCust.id,
      });
      yield put({
        type: 'getAllVisibleRangeSuccess',
        payload: { allVisibleRange },
      });
    },

    // 创建看板
    // 此时看板还未发布
    * createBoard({ payload }, { call, put, select }) {
      const createBoardResult = yield call(api.createBoard, payload);
      const board = createBoardResult.resultData;
      // 如果创建成功
      // 则需要刷新，可编辑看板
      const boardId = board && board.id;
      if (boardId > -1) {
        // 则创建成功，刷新看板
        const cust = yield select(state => state.manage.custRange);
        const allEditableBoards = yield call(api.getAllEditableReports, {
          orgId: cust[0].id,
        });
        yield put({
          type: 'getAllEditableReportsSucess',
          payload: { allEditableBoards },
        });
      }
    },

    // 删除看板
    * deleteBoard({ payload }, { call, put, select }) {
      const deleteResult = yield call(api.deleteBoard, payload);
      const result = deleteResult.resultData;
      if (result) {
        const cust = yield select(state => state.manage.custRange);
        const allEditableBoards = yield call(api.getAllEditableReports, {
          orgId: cust[0].id,
        });
        yield put({
          type: 'getAllEditableReportsSucess',
          payload: { allEditableBoards },
        });
      }
    },

    // 更新看板
    * updateBoard({ payload }, { call }) {
      const updateResult = yield call(api.updateBoard, payload);
      // 更新是在Edit页面，所以暂时不需要刷新
      console.log('updateBoard', updateResult);
    },

    // 发布看板
    * publishBoard({ payload }, { call }) {
      const publishResult = yield call(api.updateBoard, payload);
      console.log(publishResult);
    },
  },
  subscriptions: {},
};
