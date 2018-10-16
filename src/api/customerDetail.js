/*
 * @Author: sunweibin
 * @Date: 2018-10-09 15:39:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 14:14:03
 * @description 新版客户360详情 API
 */
export default function customerDetail(api) {
  return {
    // 查询客户的概要信息
    queryCustSummaryInfo: query => api.post('/groovynoauth/fsp/cust/detail/queryCustDetail', query),
    // 查询客户概要信息中的更多重点标签
    queryAllKeyLabels: query => api.post('/groovynoauth/fsp/cust/detail/queryCustDetailLabel', query),
  };
}
