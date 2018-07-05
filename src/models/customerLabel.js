/**
 * @Descripter: 自定义客户标签
 * @Author: K0170179
 * @Date: 2018/7/4
 */
import { customerLabel as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'customerLabel',
  state: {
    labelTypeList: EMPTY_LIST,
    labelInfo: EMPTY_OBJECT,
  },
  reducers: {
    queryLabelTypeSuccess(state, action) {
      return {
        ...state,
        labelTypeList: action.payload,
      };
    },
    queryLabelInfoSuccess(state, action) {
      return {
        ...state,
        labelInfo: action.payload,
      };
    },
  },
  effects: {
    // 查询客户标签类型
    * queryLabelType({ payload }, { call, put }) {
      const { resultData: { labelTypeList = [] } } = yield call(api.queryLabelType, payload);
      if (labelTypeList) {
        yield put({
          type: 'queryLabelTypeSuccess',
          payload: labelTypeList,
        });
      }
    },
    // 查询客户标签
    * queryLabelInfo({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryLabelInfo, payload);
      if (resultData) {
        yield put({
          type: 'queryLabelInfoSuccess',
          payload: resultData,
        });
      }
    },
    // 新建标签类型
    * addLabelType({ payload }, { call }) {
      const { resultData } = yield call(api.addLabelType, payload);
      return resultData;
    },
    // 新增自定义标签
    * addLabel({ payload }, { call }) {
      const { resultData } = yield call(api.addLabel, payload);
      return !resultData;
    },
    // 删除自定义标签
    * deleteLabel({ payload }, { call }) {
      const { resultData } = yield call(api.deleteLabel, payload);
      return resultData;
    },
    // 标签名重名校验
    checkDuplicationName: [
      function* getHotPossibleWds({ payload }, { call }) {
        const { resultData } = yield call(api.checkDuplicationName, payload);
        return !resultData;
      },
      { type: 'takeLatest' }],
  },
  subscriptions: {
  },
};
