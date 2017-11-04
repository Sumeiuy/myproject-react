/*
 * @Description: 通道类型协议 model
 * @Author: XuWenKang
 * @Date: 2017-10-30 15:13:30
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-11-04 17:20:42
 */
// import _ from 'lodash';

import { channelsTypeProtocol as api, seibel as seibelApi } from '../api';
import { constructSeibelPostBody, getEmpId } from '../utils/helper';
import { seibelConfig } from '../config';

const {
  pageType,  // 页面类型
} = seibelConfig.channelsTypeProtocol;
const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'channelsTypeProtocol',
  state: {
    protocolDetail: EMPTY_OBJECT, // 协议详情
    attachmentList: EMPTY_LIST, // 附件信息
    flowHistory: EMPTY_LIST,  // 审批记录
    operationList: EMPTY_LIST, // 操作类型列表
    subTypeList: EMPTY_LIST, // 子类型列表
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
      const { payload: { attachmentResponse = EMPTY_OBJECT, title = '' } } = action;
      return {
        ...state,
        attachmentList: [
          ...state.attachmentList,
          {
            title,
            attachmentList: attachmentResponse.resultData,
          },
        ],
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
    // 查询操作类型
    queryOperationListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        operationList: resultData,
      };
    },
    // 查询子类型
    querySubTypeListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        subTypeList: resultData,
      };
    },
    // 查询模板列表
    queryTemplateListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
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
        underCustList: [resultData],
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

      for (let i = 0; i < attachment.length; i++) {
        const item = attachment[i];
        const attachmentPayload = {
          attachment: item.uuid,
        };
        const attachmentResponse = yield call(api.getAttachmentList, attachmentPayload);
        const reponsePayload = {
          attachmentResponse,
          title: item.attachmentType,
        };
        yield put({
          type: 'getAttachmentListSuccess',
          payload: reponsePayload,
        });
      }
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
    // 查询操作类型/子类型
    * queryTypeVaules({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(api.queryTypeVaules, payload);
      /*eslint-disable */
      response.resultData.forEach((v)=>{
        v.show = true;
        v.label = v.val;
        v.value = v.name;
      })
      /*eslint-disable */
      switch(payload.typeCode){
        case 'operationType':
          yield put({
            type: 'queryOperationListSuccess',
            payload: response,
          });
          break;
        case 'subType':
          yield put({
            type: 'querySubTypeListSuccess',
            payload: response,
          });
          break;
      }
    },
    // 保存详情
    * saveProtocolData({ payload }, { call, put }) {
      const response = yield call(api.saveProtocolData, payload.formData);
      yield put({
        type: 'saveProtocolDataSuccess',
        payload: response,
      });
      // 保存成功之后重新请求左侧列表
      yield put({
        type: 'app/getSeibleList',
        payload: payload.params,
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
    // 查询操作类型/子类型
    * queryTypeVaules({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(api.queryTypeVaules, payload);
      if (payload.typeCode === 'operationType' || payload.typeCode === 'subType') {
        /*eslint-disable */
        response.resultData.forEach((v)=>{
          v.show = true;
          v.label = v.val;
          v.value = v.name;
        })
        /*eslint-disable */
      };
      switch(payload.typeCode){
        case 'operationType':
          yield put({
            type: 'queryOperationListSuccess',
            payload: response,
          });
          break;
        case 'subType':
          yield put({
            type: 'querySubTypeListSuccess',
            payload: response,
          });
          break;
        case 'templateId':
          yield put({
            type: 'queryTemplateListSuccess',
            payload: response,
          });
          break;
      }
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
    // 查询操作类型/子类型
    * queryTypeVaules({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(api.queryTypeVaules, payload);
      if (payload.typeCode === 'operationType' || payload.typeCode === 'subType') {
        /*eslint-disable */
        response.resultData.forEach((v)=>{
          v.show = true;
          v.label = v.val;
          v.value = v.name;
        })
        /*eslint-disable */
      };
      switch(payload.typeCode){
        case 'operationType':
          yield put({
            type: 'queryOperationListSuccess',
            payload: response,
          });
          break;
        case 'subType':
          yield put({
            type: 'querySubTypeListSuccess',
            payload: response,
          });
          break;
        case 'templateId':
          yield put({
            type: 'queryTemplateListSuccess',
            payload: response,
          });
          break;
      }
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
    * clearPropsData({ payload }, { call, put }) {
      yield put({
        type: 'clearPropsDataSuccess',
        payload: {
          resultData: EMPTY_LIST,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        console.log('query', query);
        // 查询子类型列表参数
        const subTypeListParam = {
          typeCode: 'subType',
        };
        // 查询左侧列表参数
        const { pageNum,pageSize  } = query;
        const seibleListParam = {
          ...constructSeibelPostBody(query, pageNum || 1, pageSize || 10),
          type: pageType,
        }
        if (pathname === '/channelsTypeProtocol') {
          // 进入页面查询子类型列表
          dispatch({type: 'queryTypeVaules', payload: subTypeListParam});
          // 进入页面是查询左侧列表
          // dispatch({type: 'app/getSeibleList', payload: seibleListParam});
        }
      });
    },
  },
};