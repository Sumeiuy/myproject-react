/**
 * @file models/app.js
 *  全局模型管理
 * @author maoquan(maoquan@htsc.com)
 */
import { report as api, seibel as seibelApi, customerPool as custApi } from '../api';
import { EVENT_PROFILE_ACTION } from '../config/log';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
export default {
  namespace: 'app',
  state: {
    // 字典数据
    dict: {},
    // 显示隐藏添加服务记录弹窗，默认隐藏
    ServiceRecordModalVisible: false,
    // 服务弹窗对应的客户的经纪客户号
    ServiceRecordModalVisibleOfId: '',
    empInfo: EMPTY_OBJECT,
    // 列表
    seibleList: EMPTY_OBJECT,
    // 部门组织机构树
    custRange: EMPTY_LIST,
    // 拟稿人
    drafterList: EMPTY_LIST,
    // 客户列表
    customerList: EMPTY_LIST,
    // 可申请客户列表
    canApplyCustList: EMPTY_LIST,
  },
  reducers: {
    // 获取员工职责与职位
    getEmpInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        empInfo: payload,
      };
    },
    // 获取已申请客户列表
    getCustomerListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { custList = EMPTY_LIST } = resultData;
      return {
        ...state,
        customerList: custList,
      };
    },
    // 获取可申请客户列表
    getCanApplyCustListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { custList = EMPTY_LIST } = resultData;
      return {
        ...state,
        canApplyCustList: custList,
      };
    },
    // 获取拟稿人
    getDrafterListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { empList = EMPTY_LIST } = resultData;
      return {
        ...state,
        drafterList: empList,
      };
    },
    // 获取列表
    getSeibleListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { page = EMPTY_OBJECT, applicationBaseInfoList = EMPTY_LIST } = resultData;
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
        custRange = [resultData];
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
        ServiceRecordModalVisible: payload.flag,
        ServiceRecordModalVisibleOfId: payload.custId,
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
  },
  effects: {
    // 获取员工职责与职位
    * getEmpInfo({ payload }, { call, put }) {
      const response = yield call(api.getEmpInfo);
      const data = response.resultData;
      if (data) {
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
      yield put({
        type: 'toggleServiceRecordModalSuccess',
        payload,
      });
    },
    // 获取字典
    * getDictionary({ payload }, { call, put }) {
      const response = yield call(custApi.getStatisticalPeriod);
      // console.log('dict', response);
      yield put({
        type: 'getDictionarySuccess',
        payload: { response },
      });
    },
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
      const response = yield call(seibelApi.getDrafterList, payload);
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
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'getDictionary' });
    },
  },
};
