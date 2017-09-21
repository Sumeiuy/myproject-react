/**
 * 批量佣金接口
 */

export default function commission(api) {
  return {
    // 批量佣金目标产品接口
    queryProduct: query => api.post('/groovynoauth/fsp/biz/chgcommission/queryProduct', query),
    // 批量佣金调整Home左侧列表
    getCommissionList: query => api.post('/groovynoauth/smkh/queryApplicationList', query),
    // 批量佣金调整Home右侧详情
    getCommissionDetail: query => api.post('/groovynoauth/fsp/biz/qrybatchdetailinfo/qryBatchDetailInfo', query),
    // 批量佣金调整Home右侧详情内容中的客户列表
    getCommissionDetailCustList: query => api.post('/groovynoauth/fsp/biz/qrybatchdetailinfo/qrySelectedCustList', query),
  };
}
