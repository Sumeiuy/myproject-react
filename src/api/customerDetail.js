/*
 * @Author: sunweibin
 * @Date: 2018-10-09 15:39:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-09 16:13:59
 * @description 新版客户360详情 API
 */
export default function customerDetail(api) {
  return {
    // 获取客户基本信息的接口
    queryCustomerBasicInfo: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustBasicInfo', query),
  };
}
