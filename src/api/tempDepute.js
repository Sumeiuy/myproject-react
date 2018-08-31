/*
 * @Author: sunweibin
 * @Date: 2018-08-29 13:10:29
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-30 11:15:22
 * @description 临时委托他人处理任务的 API
 */

export default function tempDepute(api) {
  return {
    // 获取委托他人处理任务的申请列表
    queryApplyList: query => api.post('/groovynoauth/fsp/campaign/tempAssignment/queryDeputeApplicationList', query),
    // 获取委托任务申请详情
    getApplyDetail: query => api.post('/groovynoauth/fsp/campaign/tempAssignment/queryDeputeApplicationDetail', query),
    // 校验是否可以提交委托申请
    checkApplyAbility: query => api.post('/groovynoauth/fsp/campaign/tempAssignment/checkIsDeputed', query),
    // 提交申请
    saveApply: query => api.post('/groovynoauth/fsp/campaign/tempAssignment/addDeputeApplication', query),
    // 撤销申请
    revertApply: query => api.post('', query),
    // 流程发起、流程审批
    doApprove: query => api.post('', query),
    // 查询下一步审批人信息
    queryNextStepInfo: query => api.post('', query),
    // 查询可以受托的部门和服务经理
    queryCanDeputeOrg: query => api.post('/groovynoauth/fsp/cust/manager/queryDrafterOrgList', query),
    // 根据受托部门以及关键字查询受托的服务经理
    queryCanDeputeEmp: query => api.post('/groovynoauth/fsp/cust/manager/queryEmpList', query),
  };
}
