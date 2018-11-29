/*
 * @Author: sunweibin
 * @Date: 2018-10-09 15:39:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-29 19:22:57
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
    // 客户360客户属性，字典接口
    queryCust360Dict: query => api.post('/groovynoauth/fsp/common/queryEcifDict', query),
    // 查询省市数据
    queryProvinceCity: query => api.post('/groovynoauth/fsp/common/queryNextAddrByCode', query),
  };
}
