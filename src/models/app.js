/**
 * @file models/app.js
 *  全局模型管理
 * @author maoquan(maoquan@htsc.com)
 */

import _ from 'lodash';
import { common as api, seibel as seibelApi, customerPool as custApi } from '../api';
import { EVENT_PROFILE_ACTION } from '../config/log';
import { emp, permission } from '../helper';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
export default {
  namespace: 'app',
  state: {
    // 字典数据
    dict: {},
    empInfo: EMPTY_OBJECT,
    // 列表
    seibleList: EMPTY_OBJECT,
    // 部门组织机构树
    custRange: EMPTY_LIST,
    // 拟稿人
    drafterList: EMPTY_LIST,
    // 已申请的客户列表
    customerList: EMPTY_LIST,
    // 可申请客户列表
    canApplyCustList: EMPTY_LIST,
    // 删除后的附件列表
    deleteAttachmentList: EMPTY_LIST,
    reformDeleteAttachmentList: EMPTY_LIST,
    // 审批人列表（服务经理接口）
    approvePersonList: EMPTY_LIST,
    // 已申请服务经理列表（服务经理接口）
    ptyMngList: EMPTY_LIST,
    // 创建者,姓名（工号）
    creator: '',
    // mot自建任务的服务类型和反馈类型
    motSelfBuiltFeedbackList: [],
    serviceRecordInfo: {
      // 显示隐藏添加服务记录弹窗
      modalVisible: false,
      // 服务弹窗对应的客户的经纪客户号，mot任务中为任务的流水id
      id: '',
      // 服务弹窗对应的客户的名称
      name: '',
      // 服务弹窗的调用方
      caller: '',
      // 打电话时自动生成的服务记录的信息
      autoGenerateRecordInfo: {},
    },
  },
  reducers: {
    // 获取员工职责与职位
    getEmpInfoSuccess(state, action) {
      const { payload } = action;
      const { empInfo = {} } = payload || EMPTY_OBJECT;
      let creator = '';
      if (!_.isEmpty(empInfo)) {
        creator = `${empInfo.empName}(${empInfo.login})`;
      }

      return {
        ...state,
        empInfo: payload,
        creator,
      };
    },
    // 获取已申请客户列表
    getCustomerListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { custList = EMPTY_LIST } = resultData || EMPTY_OBJECT;
      return {
        ...state,
        customerList: custList,
      };
    },
    // 获取可申请客户列表
    getCanApplyCustListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { custList = EMPTY_LIST } = resultData || EMPTY_OBJECT;
      return {
        ...state,
        canApplyCustList: custList,
      };
    },
    // 获取拟稿人
    getDrafterListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { servicePeopleList = EMPTY_LIST } = resultData || EMPTY_OBJECT;
      return {
        ...state,
        drafterList: servicePeopleList,
      };
    },
    // 获取列表
    getSeibleListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const {
        page = EMPTY_OBJECT,
        applicationBaseInfoList = EMPTY_LIST,
      } = resultData || EMPTY_OBJECT;
      return {
        ...state,
        seibleList: {
          page,
          resultData: applicationBaseInfoList,
        },
      };
    },
    // 获取组织机构树
    getCustRangeSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      let custRange;
      if (resultData.level === '1') {
        custRange = [
          { id: resultData.id, name: resultData.name, level: resultData.level },
          ...resultData.children,
        ];
      } else {
        custRange = resultData;
      }
      return {
        ...state,
        custRange,
      };
    },
    // 显示与隐藏创建服务记录弹框
    toggleServiceRecordModalSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        serviceRecordInfo: {
          modalVisible: payload.flag,
          id: payload.id || payload.custId,
          name: payload.name || payload.custName,
          caller: payload.caller,
          autoGenerateRecordInfo: payload.autoGenerateRecordInfo,
        },
      };
    },
    getDictionarySuccess(state, action) {
      const { payload: { response } } = action;
      const dict = response.resultData;
      return {
        ...state,
        dict,
      };
    },
    // 删除附件
    deleteAttachmentSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { attaches = EMPTY_LIST } = resultData || EMPTY_OBJECT;
      return {
        ...state,
        deleteAttachmentList: attaches,
      };
    },
    // api-getway 改造 删除附件
    reformDeleteAttachmentSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { attaches = EMPTY_LIST } = resultData || EMPTY_OBJECT;
      return {
        ...state,
        reformDeleteAttachmentList: attaches || [],
      };
    },
    // 审批人列表（服务经理接口）
    getApprovePersonListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      // 当 resultData 为null时，不会启用 resultData 的默认值的。此处要在用使用时写成 resultData || EMPTY_LIST
      const { servicePeopleList = EMPTY_LIST } = resultData || EMPTY_LIST;
      return {
        ...state,
        approvePersonList: servicePeopleList,
      };
    },
    // 针对服务经理接口获取已申请的服务经理列表（服务经理接口）
    getPtyMngListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { servicePeopleList = EMPTY_LIST } = resultData || EMPTY_OBJECT;
      return {
        ...state,
        ptyMngList: servicePeopleList,
      };
    },
    getMotCustfeedBackDictSuccess(state, action) {
      const { payload: { missionList = [] } } = action;
      return {
        ...state,
        motSelfBuiltFeedbackList: missionList,
      };
    },
    resetServiceRecordInfo(state) {
      return {
        ...state,
        serviceRecordInfo: {
          modalVisible: false,
          id: '',
          name: '',
          caller: '',
          autoGenerateRecordInfo: {},
        },
      };
    },
  },
  effects: {
    // 获取员工职责与职位
    * getEmpInfo({ payload }, { call, put }) {
      const response = yield call(api.getEmpInfo);
      const data = response.resultData;
      if (data) {
        // 设置保存用户信息,TODO 此处针对接口还未开发完成做的容错处理
        emp.setEmpInfo(data.loginInfo || data.empInfo);
        // 初始化权方法
        permission.init(data.empRespList);
        yield put({
          type: 'getEmpInfoSuccess',
          payload: data,
        });
        yield put({
          type: EVENT_PROFILE_ACTION,
          payload: data.empInfo,
        });
      }
    },
    // 显示与隐藏创建服务记录弹框
    * toggleServiceRecordModal({ payload }, { put }) {
      // 获取自建任务平台的服务类型、任务反馈字典
      yield put({
        type: 'getMotCustfeedBackDict',
        payload: { pageNum: 1, pageSize: 10000, type: 2 },
      });
      // 唤起创建服务记录的弹窗时请求Uuid
      yield put({ type: 'performerView/queryCustUuid' });
      yield put({
        type: 'toggleServiceRecordModalSuccess',
        payload,
      });
    },
    // 获取字典
    * getDictionary({ payload }, { call, put }) {
      const response = yield call(custApi.getStatisticalPeriod);
      yield put({
        type: 'getDictionarySuccess',
        payload: { response },
      });
    },
    // 获取已申请的客户列表
    * getCustomerList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getCustList, payload);
      yield put({
        type: 'getCustomerListSuccess',
        payload: response,
      });
    },
    * getCanApplyCustList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getCanApplyCustList, payload);
      yield put({
        type: 'getCanApplyCustListSuccess',
        payload: response,
      });
    },
    // 获取拟稿人
    * getDrafterList({ payload }, { call, put }) {
      // const response = yield call(seibelApi.getDrafterList, payload);
      const response = yield call(seibelApi.getSearchServerPersonelList, payload);
      yield put({
        type: 'getDrafterListSuccess',
        payload: response,
      });
    },
    // 获取公用列表
    * getSeibleList({ payload }, { call, put }) {
      const listResponse = yield call(seibelApi.getSeibleList, payload);
      yield put({
        type: 'getSeibleListSuccess',
        payload: listResponse,
      });
    },
    // 获取组织机构数
    * getCustRange({ payload }, { call, put }) {
      const response = yield call(seibelApi.getCustRange, payload);
      yield put({
        type: 'getCustRangeSuccess',
        payload: response,
      });
    },
    // 删除附件
    * deleteAttachment({ payload }, { call, put }) {
      const response = yield call(seibelApi.deleteAttachment, payload);
      yield put({
        type: 'deleteAttachmentSuccess',
        payload: response,
      });
    },
    // 删除附件
    * reformDeleteAttachment({ payload }, { call, put }) {
      const response = yield call(seibelApi.reformDeleteAttachment, payload);
      yield put({
        type: 'reformDeleteAttachmentSuccess',
        payload: response,
      });
    },
    // 审批人列表（服务经理接口）
    * getApprovePersonList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getSearchServerPersonelList, payload);
      yield put({
        type: 'getApprovePersonListSuccess',
        payload: response,
      });
    },
    // 针对服务经理项目获取已申请服务经理列表（服务经理接口）
    * getPtyMngList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getSearchServerPersonelList, payload);
      yield put({
        type: 'getPtyMngListSuccess',
        payload: response,
      });
    },
    // mot自建任务的服务类型和反馈类型
    * getMotCustfeedBackDict({ payload }, { call, put, select }) {
      const motSelfBuiltFeedbackList = yield select(state => state.app.motSelfBuiltFeedbackList);
      if (_.isEmpty(motSelfBuiltFeedbackList)) {
        const response = yield call(api.getServiceType, payload);
        if (response.code === '0') {
          yield put({
            type: 'getMotCustfeedBackDictSuccess',
            payload: response.resultData,
          });
        }
      }
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      // 加载员工职责与职位
      dispatch({ type: 'getEmpInfo' });
      // 获取字典
      dispatch({ type: 'getDictionary' });
    },
  },
};
