/**
 * @Author: sunweibin
 * @Date: 2018-05-08 10:17:26
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-12 18:14:01
 * @description 营业部非投顾签约客户分配的API
 */

export default function cust(api) {
  return {
    // 获取右侧签约客户分配详情
    getAppDetail: query => api.post('/groovynoauth/fsp/biz/closeaccountonline/queryApplicationDetail', query),
    // 根据客户名称或者经纪客户号查询客户列表
    queryCustList: query => api.post('/groovynoauth/fsp/cust/closeaccountonline/queryCustList', query),
    // 线上销户新建的下拉框字典
    queryDict: query => api.post('/groovynoauth/fsp/biz/closeaccountonline/closeAccountOnlineTypeMap', query),
    // 获取附件列表
    getAttachmentList: query => api.post('/file/ceFileList2', query),
    // 下一步按钮和下一步审批人
    getButtonList: query => api.post('/groovynoauth/fsp/biz/custrelationships/queryNextStepInfo', query),
    // 验证提交数据接口
    validateData: query => api.post('/groovynoauth/fsp/biz/custrelationships/validate', query),
    // “是否办理股票质押回购业务“选“是”时，更新接口（新建和修改提交）
    saveApplication: query => api.post('/groovynoauth/fsp/biz/custrelationships/saveApplication', query),
    // “是否办理股票质押回购业务“选“否”时，提交后不需走审批流程，直接调这个接口
    chgCustRelaiton: query => api.post('/groovynoauth/fsp/biz/custrelationships/chgCustRelation', query),
    // 走流程接口
    doApprove: query => api.post('/groovynoauth/fsp/biz/custrelationships/doApprove', query),
    // 获取该客户的详情信息
    getCustDetail: query => api.post('/groovynoauth/fsp/biz/custrelationships/queryCustBasicInfo', query),
    // 根据用户选择的客户类型获取关联关系Select树
    getRelationshipTree: query => api.post('/groovynoauth/fsp/biz/custrelationships/relationshipsTree', query),
  };
}
