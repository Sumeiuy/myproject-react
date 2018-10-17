/*
 * @Author: sunweibin
 * @Date: 2018-10-09 15:39:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 17:34:09
 * @description 新版客户360详情 API
 */
export default function customerDetail(api) {
  return {
    // 查询客户的概要信息
    queryCustSummaryInfo: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustTradeInfo', query),
    // 查询客户概要信息中的更多重点标签
    queryAllKeyLabels: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustImportLabels', query),
    // 获取客户基本信息的接口
    queryCustomerBasicInfo: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustBasicInfo', query),
  };
}
