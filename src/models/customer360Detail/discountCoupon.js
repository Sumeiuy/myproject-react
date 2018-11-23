/**
 * @Author: XuWenKang
 * @Description: 客户360-理财优惠券
 * @Date: 2018-11-06 14:59:53
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-21 15:18:22
 */
import { detailDiscountCoupon as api } from '../../api';

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

export default {
  namespace: 'detailDiscountCoupon',
  state: {
    // 优惠券详情
    couponDetail: EMPTY_OBJECT,
    // 优惠券列表数据
    couponListData: EMPTY_OBJECT,
    // 使用状态列表数据
    couponStatusList: EMPTY_ARRAY,
  },
  reducers: {
    queryDiscountCouponDetailSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        couponDetail: payload || EMPTY_OBJECT,
      };
    },
    queryDiscountCouponListSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        couponListData: payload || EMPTY_OBJECT,
      };
    },
    queryCouponStatusListSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        couponStatusList: payload || EMPTY_ARRAY,
      };
    },
  },
  effects: {
    // 获取理财优惠券详情
    * queryDiscountCouponDetail({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryDiscountCouponDetail, payload);
      yield put({
        type: 'queryDiscountCouponDetailSuccess',
        payload: resultData,
      });
    },
    // 获取理财优惠券列表
    * queryDiscountCouponList({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryDiscountCouponList, payload);
      yield put({
        type: 'queryDiscountCouponListSuccess',
        payload: resultData,
      });
    },
    // 获取理财优惠券使用状态列表
    * queryCouponStatusList({ payload }, { put, call }) {
      const { resultData } = yield call(api.queryCouponStatusList, payload);
      yield put({
        type: 'queryCouponStatusListSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {

  },
};
