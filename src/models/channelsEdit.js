/*
 * @Author: LiuJianShu
 * @Date: 2017-11-10 09:27:03
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-11-13 20:40:29
 */

import { channelsTypeProtocol as api, seibel as seibelApi } from '../api';
import { getEmpId } from '../utils/helper';
// import { seibelConfig } from '../config';

// const {
//   pageType,  // 页面类型
// } = seibelConfig.channelsTypeProtocol;
const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'channelsEdit',
  state: {
    protocolDetail: EMPTY_OBJECT, // 协议详情
    attachmentList: EMPTY_LIST, // 附件信息
    flowHistory: EMPTY_LIST,  // 审批记录
    flowStepInfo: EMPTY_OBJECT,  // 审批人及按钮
    operationList: EMPTY_LIST, // 操作类型列表
    templateList: EMPTY_LIST, // 模板列表
    protocolClauseList: EMPTY_LIST, // 所选模板对应协议条款列表
    protocolProductList: EMPTY_LIST, // 协议产品列表
    underCustList: EMPTY_LIST,  // 客户列表
    saveProtocol: EMPTY_OBJECT,
  },
  reducers: {
    // 获取协议详情
    getProtocolDetailSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        attachmentList: EMPTY_LIST,
        protocolDetail: resultData,
      };
    },
    // 获取附件
    getAttachmentListSuccess(state, action) {
      const { payload = EMPTY_LIST } = action;
      return {
        ...state,
        attachmentList: payload,
      };
    },
    // 获取审批记录
    getFlowHistorySuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        flowHistory: resultData,
      };
    },
    // 查询模板列表
    queryTemplateListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        protocolProductList: [],
        protocolClauseList: [],
        templateList: resultData,
      };
    },
    // 根据所选模板id查询对应协议条款
    queryChannelProtocolItemSuccess(state, action) {
      const { payload: { resultData: { channelItem = EMPTY_LIST } } } = action;
      return {
        ...state,
        protocolClauseList: channelItem,
      };
    },
    // 查询协议产品列表
    queryChannelProtocolProductSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        protocolProductList: resultData,
      };
    },
    // 清除数据
    clearPropsDataSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        protocolProductList: resultData,
        protocolClauseList: resultData,
        underCustList: resultData,
      };
    },
    // 保存详情
    saveProtocolDataSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        saveProtocol: resultData,
      };
    },
    // 查询客户
    queryCustSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        protocolProductList: [],
        protocolClauseList: [],
        underCustList: [resultData],
      };
    },
    // 查询审批人
    getFlowStepInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        flowStepInfo: resultData,
      };
    },
  },
  effects: {
    // 获取协议详情
    * getProtocolDetail({ payload }, { call, put }) {
      const empId = getEmpId();
      const response = yield call(api.getProtocolDetail, payload);
      yield put({
        type: 'getProtocolDetailSuccess',
        payload: response,
      });
      const attachment = response.resultData.attachment;
      const attachmentArray = [];
      for (let i = 0; i < attachment.length; i++) {
        const item = attachment[i];
        const attachmentPayload = {
          attachment: item.uuid,
        };
        const attachmentResponse = yield call(api.getAttachmentList, attachmentPayload);
        const responsePayload = {
          attachmentList: attachmentResponse.resultData,
          title: item.attachmentType,
          uuid: item.uuid,
        };
        attachmentArray.push(responsePayload);
      }
      yield put({
        type: 'getAttachmentListSuccess',
        payload: attachmentArray,
      });
      // 获取审批记录的 payload
      const flowPayload = {
        flowCode: response.resultData.flowid || '',
        loginuser: empId,
      };
      const flowHistoryResponse = yield call(seibelApi.getFlowHistory, flowPayload);
      yield put({
        type: 'getFlowHistorySuccess',
        payload: flowHistoryResponse,
      });
      const flowStepPayload = {
        flowId: response.resultData.flowid || '',
      };
      const flowResponse = yield call(api.getFlowStepInfo, flowStepPayload);
      const { resultData: { flowButtons = [] } } = flowResponse;
      // 对按钮内的审批人进行处理
      const transferButtons = flowButtons.map((item) => {
        const newItem = item.flowAuditors.length &&
          item.flowAuditors.map(child => ({
            belowDept: child.occupation,
            empNo: child.login,
            key: child.login,
            groupName: item.nextGroupName,
            operate: item.operate,
          }));
        // 返回新的按钮数据
        return {
          ...item,
          flowAuditors: newItem,
        };
      });
      yield put({
        type: 'getFlowStepInfoSuccess',
        payload: {
          ...flowResponse,
          flowButtons: transferButtons,
        },
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
    // 删除附件
    * deleteAttachment({ payload }, { call }) {
      yield call(seibelApi.deleteAttachment, payload);
    },
    // 获取审批人列表
    * getFlowStepInfo({ payload }, { call, put }) {
      const response = yield call(api.getFlowStepInfo, payload);
      const { resultData: { flowButtons = [] } } = response;
      // 对按钮内的审批人进行处理
      const transferButtons = flowButtons.map((item) => {
        const newItem = item.flowAuditors.length &&
          item.flowAuditors.map(child => ({
            belowDept: child.occupation,
            empNo: child.login,
            key: child.login,
            groupName: item.nextGroupName,
            operate: item.operate,
          }));
        // 返回新的按钮数据
        return {
          ...item,
          flowAuditors: newItem,
        };
      });
      yield put({
        type: 'getAddFlowStepInfoSuccess',
        payload: {
          ...response,
          flowButtons: transferButtons,
        },
      });
    },
    // 保存详情
    * saveProtocolData({ payload }, { call, put }) {
      const response = yield call(api.saveProtocolData, payload);
      yield put({
        type: 'saveProtocolDataSuccess',
        payload: response,
      });
    },
    // 查询客户
    * queryCust({ payload }, { call, put }) {
      const response = yield call(api.queryCust, payload);
      yield put({
        type: 'queryCustSuccess',
        payload: response,
      });
    },
    // 查询协议模版
    * queryTypeVaules({ payload }, { call, put }) {
      const response = yield call(api.queryTypeVaules, payload);
      yield put({
        type: 'queryTemplateListSuccess',
        payload: response,
      });
    },
    // 根据所选模板id查询对应协议条款
    * queryChannelProtocolItem({ payload }, { call, put }) {
      const response = yield call(api.queryChannelProtocolItem, payload);
      yield put({
        type: 'queryChannelProtocolItemSuccess',
        payload: response,
      });
    },
    // 查询协议产品列表
    * queryChannelProtocolProduct({ payload }, { call, put }) {
      const response = yield call(api.queryChannelProtocolProduct, payload);
      yield put({
        type: 'queryChannelProtocolProductSuccess',
        payload: response,
      });
    },
    // 清除协议产品列表
    * clearPropsData({ payload }, { put }) {
      yield put({
        type: 'clearPropsDataSuccess',
        payload: {
          resultData: EMPTY_LIST,
        },
      });
    },
    // 提交审批流程
    * doApprove({ payload }, { call }) {
      yield call(api.postDoApprove, payload.formData);
    },
  },
  subscriptions: {},
};
