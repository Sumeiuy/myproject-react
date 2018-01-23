/**
 * Created By K0170179 on 2018/1/17
 * 每日晨报
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */
import { message } from 'antd';
import { morningBoradcast as api } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
export default {
  namespace: 'morningBoradcast',
  state: {
    newsListQuery: {
      FROM_DATE: null, // 查询参数创建时间：开始时间的缓存
      TO_DATE: null, // 查询参数创建时间：结束的缓存
      TITLE: '',  // 查询参数：标题
      CREATE_BY: '',  // 查询参数：作者
    },
    boradcastList: EMPTY_LIST, // 晨报列表
    initBoradcastList: EMPTY_LIST,  // 初始化列表数据，为首页服务
    pagination: EMPTY_OBJECT,  // 分页信息
    boradcastDetail: EMPTY_OBJECT,  // 晨报详情
    saveboradcastInfo: EMPTY_OBJECT,  // 添加晨报结果信息
    delBoradcastInfo: EMPTY_OBJECT,  // 删除晨报结果信息
  },
  reducers: {
    // 搜索晨报列表成功
    getBoradcastListSuccess(state, action) {
      const { payload: { resultData: { newsList = [], pageVO } }, query } = action;
      const { pageNum = 1, totalCount = 0, pageSize = 10 } = pageVO;
      const pagination = {
        total: totalCount,
        defaultCurrent: pageNum,
        defaultPageSize: pageSize,
      };
      const newsListQuery = {
        FROM_DATE: query.createdFrom,
        TO_DATE: query.createdTo,
        TITLE: query.title || '',
        CREATE_BY: query.createdBy || '',
      };
      const nextState = {
        ...state,
        boradcastList: newsList,
        pagination,
        newsListQuery,
      };
      if (!state.initBoradcastList.length) {
        Object.assign(nextState, { initBoradcastList: newsList });
      }
      return nextState;
    },
    // 保存晨报结果
    saveBoradcastResult(state, action) {
      const { payload } = action;
      return {
        ...state,
        saveboradcastInfo: payload,
      };
    },
    getBoradcastDetailSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        boradcastDetail: Object.assign(state.boradcastDetail, {
          [payload.newsId]: payload,
        }),
      };
    },
    // 保存删除列表结果
    // 保存晨报结果
    delBoradcastResult(state, action) {
      const { response } = action;
      return {
        ...state,
        delBoradcastInfo: response,
      };
    },
  },
  effects: {
    // 获取晨报列表
    * getBoradcastList({ payload }, { call, put }) {
      const response = yield call(api.searchBoradcastList, payload);
      yield put({
        type: 'getBoradcastListSuccess',
        payload: response,
        query: payload,
      });
    },
    // 保存晨报
    * saveBoradcast({ payload }, { call, put }) {
      const response = yield call(api.saveBoradcast, payload);
      const query = {
        resultData: response.resultData,
        type: 'create',
      };
      if (response.code !== '0') {
        message.info('对不起，保存信息失败', 1);
      } else {
        yield put({
          type: 'saveBoradcastResult',
          payload: query,
        });
      }
    },
    // 获取晨报详情
    * getBoradcastDetail({ payload }, { call, put }) {
      const response = yield call(api.searchBoradcastDetail, payload);
      if (!response.resultData) {
        message.info('对不起，未查询到该条信息', 1);
      } else {
        yield put({
          type: 'getBoradcastDetailSuccess',
          payload: response.resultData,
        });
      }
    },
    // 删除晨报列表item
    * delBoradcastItem({ payload }, { call, put }) {
      const response = yield call(api.delBoradcastItem, payload);
      yield put({
        type: 'delBoradcastResult',
        response,
      });
    },
    // // 获取资源文件
    // * getSourceFile({ payload }, { call, put }) {
    //   const response = yield call(api.searchBoradcastDetail, payload);
    //   yield put({
    //     uuid: 111,
    //   });
    // },
  },
};
