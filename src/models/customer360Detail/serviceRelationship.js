/*
 * @Author: wangyikai
 * @Date: 2018-11-05 18:50:57
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-08 17:29:22
 */
import { detailServiceRelationship as api } from '../../api';
export default {
  namespace: 'detailServiceRelationship',
  state: {
    //账户关系下服务团队的数据
    serviceTeam: [],
    //账户关系下介绍信息的数据
    introduce: [],
    //账户关系下服务历史的数据
    serviceHistory: [],
  },
  reducers: {
    //账户关系下服务团队的数据
    getCustServiceTeamSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        serviceTeam: payload || {},
      };
    },
    //账户关系下介绍信息的数据
    getCustDevInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        introduce: payload || {},
      };
    },
    //账户关系下服务历史的数据
    getCustServiceHistorySuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        serviceHistory: payload || {},
      };
    },
      // 清除redux数据
      clearReduxDataSuccess(state, action) {
        const { payload = {} } = action;
        return {
          ...state,
          ...payload,
        };
      },
  },
  effects: {
    //查询账户关系下的服务团队信息
    * getCustServiceTeam({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryCustServiceTeam, payload);
      yield put({
        type: 'getCustServiceTeamSuccess',
        payload: resultData,
      });
    },
     //查询账户关系下的介绍信息
     * getCustDevInfo({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryCustDevInfo, payload);
      yield put({
        type: 'getCustDevInfoSuccess',
        payload: resultData,
      });
    },
     //查询账户关系下的服务历史信息
     * getCustServiceHistory({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryCustServiceHistory, payload);
      yield put({
        type: 'getCustServiceHistorySuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {},
};


