/*
 * @Description: 合作合约 model
 * @Author: LiuJianShu
 * @Date: 2017-09-20 15:13:30
 * @Last Modified by:   XuWenKang
 * @Last Modified time: 2017-10-10 18:08:58
 */
import { contract as api, seibel as seibelApi } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'contract',
  state: {
    detailMessage: EMPTY_OBJECT,
    list: EMPTY_OBJECT,
    drafterList: EMPTY_LIST, // 拟稿人
    empOrgTreeList: EMPTY_OBJECT, // 部门
    attaches: EMPTY_LIST, // 附件信息
    custList: EMPTY_LIST, // 客户列表
    contractDetail: EMPTY_OBJECT, // 合约详情
    contractNumList: EMPTY_LIST, // 合作合约编号列表
    baseInfo: EMPTY_OBJECT,
    attachmentList: EMPTY_LIST, // 附件信息
    cooperDeparment: EMPTY_LIST, // 合作部门
    clauseNameList: EMPTY_LIST, // 条款名称列表
  },
  reducers: {
    // 获取详情
    getBaseInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        baseInfo: resultData,
      };
    },
    // 获取附件列表
    getAttachmentListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        attachmentList: resultData,
      };
    },
    // 删除附件
    deleteAttachmentSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { attaches = EMPTY_LIST } = resultData;
      return {
        ...state,
        attachmentList: attaches,
      };
    },
    getCutListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { custList = EMPTY_LIST } = resultData;
      return {
        ...state,
        custList,
      };
    },
    getContractDetailSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        contractDetail: resultData,
      };
    },
    saveContractDataSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      console.log(resultData);
      return {
        ...state,
      };
    },
    getContractNumListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        contractNumList: resultData,
      };
    },
    getClauseNameListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      console.log('resultData', resultData);
      // if(resultData.length) {
      //   resultData.forEach((v) => {
      //     v.label = v.termVal;
      //     v.value = v.termName;
      //     v.show = true;
      //     if (v.param.length) {
      //       v.param.forEach((sv) => {
      //         sv.label = v.val;
      //         sv.value = sv.name;
      //         sv.show = true;
      //       });
      //     }
      //   });
      // }
      return {
        ...state,
        clauseNameList: resultData,
      };
    },
    getCooperDeparmentListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        cooperDeparment: resultData,
      };
    },
  },
  effects: {
    // 获取详情
    * getBaseInfo({ payload }, { call, put }) {
      const response = yield call(api.getContractDetail, payload);
      yield put({
        type: 'getBaseInfoSuccess',
        payload: response,
      });
    },
    // 获取附件信息
    * getAttachmentList({ payload }, { call, put }) {
      const response = yield call(api.getAttachmentList, payload);
      yield put({
        type: 'getAttachmentListSuccess',
        payload: response,
      });
    },
    * deleteAttachment({ payload }, { call, put }) {
      const response = yield call(api.deleteAttachment, payload);
      yield put({
        type: 'deleteAttachmentSuccess',
        payload: response,
      });
    },
    * getCutList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getCanApplyCustList, payload);
      yield put({
        type: 'getCutListSuccess',
        payload: response,
      });
    },
    * getContractDetail({ payload }, { call, put }) {
      const response = yield call(api.getContractDetail, payload);
      console.log('detail', response);
      yield put({
        type: 'getContractDetailSuccess',
        payload: response,
      });
    },
    * saveContractData({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(api.saveContractData, payload);
      yield put({
        type: 'saveContractDataSuccess',
        payload: response,
      });
    },
    * getContractNumList({ payload }, { call, put }) {
      const response = yield call(api.getContractNumList, payload);
      yield put({
        type: 'getContractNumListSuccess',
        payload: response,
      });
    },
    * getClauseNameList({ payload }, { call, put }) {
      const response = yield call(api.getClauseNameList, payload);
      yield put({
        type: 'getClauseNameListSuccess',
        payload: response,
      });
    },
    * getCooperDeparmentList({ payload }, { call, put }) {
      const response = yield call(api.getCooperDeparmentList, payload);
      yield put({
        type: 'getCooperDeparmentListSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
