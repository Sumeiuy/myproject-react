/*
 * @Author: sunweibin
 * @Date: 2018-08-29 13:10:29
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-29 20:44:57
 * @description 临时委托他人处理任务的 API
 */

export default function tempDepute(api) {
  return {
    // 获取委托他人处理任务的申请列表
    queryApplyList: query => api.post('/groovynoauth/fsp/cust/manager/queryCustDistributionDetailx', query),
    // 获取委托任务申请详情
    getApplyDetail: query => api.post('/groovynoauth/fsp/cust/manager/queryCustDistributionDetailxY', query),
    // 校验是否可以提交委托申请
    checkApplyAbility: query => api.post('', query),
    // 提交申请
    saveApply: query => api.post('', query),
    // 撤销申请
    revertApply: query => api.post('', query),
    // 流程发起、流程审批
    doApprove: query => api.post('', query),
    // 查询下一步审批人信息
    queryNextStepInfo: query => api.post('', query),
    // 查询可以受托的部门和服务经理
    queryCanDeputeEmp: query => api.post('', query),
    // 临时委托任务查询字典
    queryDict: query => api.post('/groovynoauth/fsp/cust/manager/queryDict', query),
  };
}
