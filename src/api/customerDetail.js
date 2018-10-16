/*
 * @Author: sunweibin
 * @Date: 2018-10-09 15:39:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 10:38:16
 * @description 新版客户360详情 API
 */
export default function customerDetail(api) {
  return {
    // 查询客户的概要信息
    queryCustSummaryInfo: query => api.post('/groovynoauth/fsp/cust/detail/queryCustDetail', query),
  };
}
