/**
 * @Description: 分公司客户分配
 * @Author: Liujianshu
 * @Date: 2018-05-23 09:37:16
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-25 14:03:31
 */
export default function custAllot(api) {
  return {
    // 获取详情信息
    queryDetailInfo: query => api.post('/groovynoauth/fsp/cust/manager/queryApplicationDetail', query),
    // 下一步按钮和下一步审批人
    queryButtonList: query => api.post('/groovynoauth/fsp/cust/manager/queryNextStepInfo', query),
    // 查询客户列表
    queryCustList: query => api.post('/groovynoauth/fsp/cust/manager/queryCustList', query),
    // 查询服务经理列表
    queryManageList: query => api.post('/groovynoauth/fsp/cust/manager/queryPriPostn', query),
    // 批量添加客户或者服务经理、删除、清空
    updateList: query => api.post('/groovynoauth/fsp/cust/manager/updateList', query),
    // 查询已经添加的客户，弹窗与详情中用到
    queryAddedCustList: query => api.post('/groovynoauth/fsp/cust/manager/queryCustomerAssignmentList', query),
    // 查询已经添加的客户
    queryAddedManageList: query => api.post('/groovynoauth/fsp/cust/manager/queryCustomerAssignmentEmpList', query),
    // 提交客户分配
    saveChange: query => api.post('/groovynoauth/fsp/cust/manager/submit', query),
    // 走流程接口
    doApprove: query => api.post('/groovynoauth/fsp/cust/manager/doApprove', query),
    // 批量划转的消息提醒数据
    queryNotifiesList: query => api.post('/groovynoauth/fsp/cust/manager/queryCustomerAssignValidateResult', query),
  };
}
