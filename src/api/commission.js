/**
 * 批量佣金接口
 */

export default function commission(api) {
  return {
    // 批量佣金目标产品接口
    queryProduct: query => api.post('/groovynoauth/fsp/biz/chgcommission/queryProduct', query),
    // 批量佣金调整Home左侧列表
    getCommissionList: query => api.post('/groovynoauth/fsp/queryApplicationList', query),
    // 批量佣金调整Home右侧详情
    getCommissionDetail: query => api.post('/groovynoauth/fsp/biz/qrybatchdetailinfo/qryBatchDetailInfo', query),
    // 批量佣金调整Home右侧详情内容中的客户列表
    getCommissionDetailCustList: query => api.post('/groovynoauth/fsp/biz/qrybatchdetailinfo/qrySelectedCustList', query),
    // 查询批量佣金调整详情页面中查看单个用户的审批记录
    querySingleCustApprovalRecord: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryFlowHistory', query),
    // 通过用户输入的关键字，获取可选的客户列表
    getCustList: query => api.post('/groovynoauth/fsp/smkhsq/CustList', query),
    // 通过用户输入的关键字，获取可选的拟稿人列表
    getDrafterList: query => api.post('/groovynoauth/fsp/queryDrafterList', query),
    // 获取部门
    getEmpOrgTree: query => api.post('/groovynoauth/jxzb/empOrgTree', query),
  };
}
