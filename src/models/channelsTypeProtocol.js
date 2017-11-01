/*
 * @Description: 通道类型协议 model
 * @Author: XuWenKang
 * @Date: 2017-10-30 15:13:30
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-10-30 15:13:30
 */
import { channelsTypeProtocol as api } from '../api';
import { getEmpId } from '../utils/helper';

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
  },
  reducers: {
    // 获取协议详情
    getProtocolDetailSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        protocolDetail: resultData,
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
      // 获取审批记录的 payload
      const flowPayload = {
        flowCode: response.resultData.flowid || '',
        loginuser: empId,
      };
      const flowHistoryResponse = yield call(api.getFlowHistory, flowPayload);
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
    * deleteAttachment({ payload }, { call, put }) {
      const response = yield call(api.deleteAttachment, payload);
      yield put({
        type: 'deleteAttachmentSuccess',
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

    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        console.log('query', query);
        // 查询子类型列表参数
        const subTypeListParam = {
          typeCode: 'subType',
        };
        if (pathname === '/channelsTypeProtocol') {
          // 进入页面查询客户列表
          // dispatch({ type: 'app/getCanApplyCustList' });
          // 进入页面查询子类型列表
          dispatch({type: 'queryTypeVaules', payload: subTypeListParam});

          dispatch({type: 'getProtocolDetail', payload: {id: 5120}})
        }
      });
    },
  },
};
