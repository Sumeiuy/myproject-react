/**
 * 批量佣金接口
 */

export default function commission(api) {
  return {
    // 批量佣金调整Home右侧详情
    getCommissionDetail: query => api.post('/groovynoauth/fsp/biz/qrybatchdetailinfo/qryBatchDetailInfo', query),
    // 批量佣金调整Home右侧详情内容中的客户列表
    getCommissionDetailCustList: query => api.post('/groovynoauth/fsp/biz/qrybatchdetailinfo/qrySelectedCustList', query),
    // 查询批量佣金调整详情页面中查看单个用户的审批记录
    querySingleCustApprovalRecord: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryFlowHistory', query),
    // 根据目标股基佣金率查询目标产品列表
    queryProductList: query => api.post('groovynoauth/fsp/biz/chgcommission/queryProduct', query),
    // 查询审批人员
    queryAprovalUserList: query => api.post('groovynoauth/fsp/biz/chgcommsion/queryAprovalUser', query),
    // 检验客户是否可以调整
    validateCustInfo: query => api.post('groovynoauth/fsp/biz/validcustinfo/validCustInfo', query),
  };
}
