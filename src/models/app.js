/**
 * @file models/app.js
 *  全局模型管理
 * @author maoquan(maoquan@htsc.com)
 */
import { report as api, customerPool as custApi } from '../api';
import { EVENT_PROFILE_ACTION } from '../config/log';

export default {
  namespace: 'app',
  state: {
    empInfo: {},
    // 字典数据
    dict: {},
    // 显示隐藏添加服务记录弹窗，默认隐藏
    ServiceRecordModalVisible: false,
    // 服务弹窗对应的客户的经纪客户号
    ServiceRecordModalVisibleOfId: '',
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'getDictionary' });
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
};
