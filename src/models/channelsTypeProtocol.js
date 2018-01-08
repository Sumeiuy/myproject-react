/*
 * @Description: 通道类型协议 model
 * @Author: XuWenKang
 * @Date: 2017-10-30 15:13:30
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-01-07 15:34:40
 */
// import _ from 'lodash';
import { message } from 'antd';
import { parse } from 'query-string';

import { channelsTypeProtocol as api, seibel as seibelApi } from '../api';
import { emp } from '../helper';
import duty from '../helper/config/duty';

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
    itemId: '', // 保存成功后返回itemId,提交审批流程所需
    flowStepInfo: EMPTY_OBJECT, // 审批人
    protocolList: EMPTY_LIST, // 协议 ID 列表
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
    // 查询操作类型
    queryOperationListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        protocolProductList: [],
        protocolClauseList: [],
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
    // 清除详情及相关数据
    clearDetailDataSuccess(state) {
      return {
        ...state,
        protocolDetail: {},
        protocolList: [],
      };
    },
    // 保存详情
    saveProtocolDataSuccess(state, action) {
      const { payload: { resultData = '' } } = action;
      return {
        ...state,
        itemId: resultData,
      };
    },
    // 查询客户
    queryCustSuccess(state, action) {
      const { payload: { resultData } } = action;
      if (!resultData) {
        message.error('未找到该客户。');
      }
      return {
        ...state,
        underCustList: resultData ? [resultData] : [],
      };
    },
    // 查询审批人
    getAddFlowStepInfoSuccess(state, action) {
      const { payload = EMPTY_OBJECT } = action;
      return {
        ...state,
        flowStepInfo: payload,
      };
    },
    queryProtocolListSuccess(state, action) {
      const { paylaod: { resultData = [] } } = action;
      return {
        ...state,
        protocolList: resultData,
      };
    },
  },
  effects: {
    // 获取协议详情
    * getProtocolDetail({ payload }, { call, put }) {
      const param = {
        ...payload.data,
        subType: duty.zjkcd_id,
      };
      const empId = emp.getId();
      const response = yield call(api.getProtocolDetail, param);
      yield put({
        type: 'getProtocolDetailSuccess',
        payload: response,
      });
      if (payload.needAttachment) {
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
      }
      // 获取审批记录的 payload
      if (payload.needFlowHistory) {
        const flowPayload = {
          flowCode: response.resultData.flowid || '',
          loginuser: empId,
        };
        const flowHistoryResponse = yield call(seibelApi.getFlowHistory, flowPayload);
        yield put({
          type: 'getFlowHistorySuccess',
          payload: flowHistoryResponse,
        });
      }
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
    // 查询操作类型/子类型
    * queryTypeVaules({ payload }, { call, put }) {
      const response = yield call(api.queryTypeVaules, payload);
      if (payload.typeCode === 'operationType' || payload.typeCode === 'subType') {
        /*eslint-disable */
        response.resultData.forEach((v) => {
          v.show = true;
          v.label = v.val;
          v.value = v.name;
        })
        /*eslint-disable */
      };
      switch (payload.typeCode) {
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
    // 清除协议产品列表
    * clearDetailData({ payload }, { call, put }) {
      yield put({
        type: 'clearDetailDataSuccess',
        payload: {
          resultData: {},
        },
      });
    },
    // 客户验证
    * getCustValidate({ payload }, { call, put }) {
      const response = yield call(api.getCustValidate, payload);
    },
    // 新建时的获取审批人列表
    * getFlowStepInfo({ payload }, { call, put }) {
      const response = yield call(api.getFlowStepInfo, payload);
      const { resultData: { flowButtons = [] } } = response;
      // 对按钮内的审批人进行处理
      const transferButtons = flowButtons.map((item) => {
        const newItem = item.flowAuditors.length &&
          item.flowAuditors.map(child => ({
            belowDept: child.occupation,
            empNo: child.login,
            empName: child.empName,
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
          ...response.resultData,
          flowButtons: transferButtons,
        },
      });
    },
    // 提交审批流程
    * doApprove({ payload }, { call, put }) {
      yield call(api.postDoApprove, payload.formData);

      // 提交成功之后重新请求左侧列表
      // yield put({
      //   type: 'app/getSeibleList',
      //   payload: payload.params,
      // });
    },
    // 根据操作类型返回可用的协议列表
    * queryProtocolList({ payload }, { call, put }) {
      const response = yield call(api.queryProtocolList, payload);
      yield put({
        type: 'queryProtocolListSuccess',
        paylaod: response,
      })
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = parse(search);
        // 查询子类型列表参数
        const subTypeListParam = {
          typeCode: 'subType',
        };
        if (pathname === '/channelsTypeProtocol') {
          // 进入页面查询子类型列表
          dispatch({ type: 'queryTypeVaules', payload: subTypeListParam });
        }
      });
    },
  },
};