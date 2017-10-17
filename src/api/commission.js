/**
 * 批量佣金接口
 */

export default function commission(api) {
  return {
    // 批量佣金调整Home右侧详情
    getCommissionDetail: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryBatchCommChgOrderInfo', query),
    // 批量佣金调整Home右侧详情内容中的客户列表
    getCommissionDetailCustList: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryCommChgOrderCusts', query),
    // 查询批量佣金调整详情页面中查看单个用户的审批记录
    querySingleCustApprovalRecord: query => api.post('/groovynoauth/fsp/flow/queryFlowHistory', query),
    // 根据目标股基佣金率查询目标产品列表
    queryProductList: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryProduct', query),
    // 查询审批人员
    queryAprovalUserList: query => api.post('/groovynoauth/fsp/flow/queryAprovalUser', query),
    // 检验客户是否可以调整
    validateCustInfo: query => api.post('/groovynoauth/fsp/biz/chgcommsion/validateBatCommChgCust', query),
    // 提交批量佣金调整
    submitBatchCommission: query => api.post('/groovynoauth/fsp/biz/chgcommsion/saveBatchJustCommionInfo', query),
    // 查询咨询订阅详情接口
    queryConsultSubscribeDetail: query => api.post('/groovynoauth/fsp/biz/mailsubscription/saveMailSubscriptionInfo', query),
    // 获取附件信息
    getAttachment: query => api.post('/file/ceFileList', query),
  };
}
