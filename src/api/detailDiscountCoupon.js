/**
 * @Author: XuWenKang
 * @Description: 客户360-理财优惠券相关api
 * @Date: 2018-11-07 10:00:46
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-21 15:11:24
 */
export default function detailDiscountCoupon(api) {
  return {
    // 获取理财优惠券详情
    queryDiscountCouponDetail: query => api.post('/groovynoauth/fsp/cust/custdetail/queryDiscountCouponDetail', query),
    // 获取理财优惠券列表
    queryDiscountCouponList: query => api.post('/groovynoauth/fsp/cust/custdetail/queryDiscountCouponList', query),
    // 获取理财优惠券使用状态列表
    queryCouponStatusList: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCouponStatusList', query),
  };
}
