/**
 * @Author: sunweibin
 * @Date: 2018-05-08 10:17:26
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-17 17:10:40
 * @description 营业部非投顾签约客户分配的API
 */

export default function cust(api) {
  return {
    // 获取右侧签约客户分配详情
    getAppDetail: query => api.post('/groovynoauth/fsp/cust/manager/queryCustDistributionDetail', query),
    // 获取Excel上传批量导入客户列表数据的
    getCustListInExcel: query => api.post('/groovynoauth/fsp/cust/manager/getCustListInExcel', query),
    // 客户分配查询服务经理列表
    queryEmpList: query => api.post('/groovynoauth/fsp/cust/manager/queryDistributeEmpList', query),
    // 客户分配根据筛选条件获取客户列表
    filterCustList: query => api.post('/groovynoauth/fsp/cust/manager/filterCustList', query),
    // 根据关键字查询客户
    queryDistributeCust: query => api.post('/groovynoauth/fsp/cust/manager/queryDistributeCust', query),
    // 根据关键字查询服务经理
    queryDistributeEmp: query => api.post('/groovynoauth/fsp/cust/manager/queryDistributeEmp', query),
    // 根据关键字查询开发经理
    queryDistributeDevEmp: query => api.post('/groovynoauth/fsp/cust/manager/queryDistributeDevEmp', query),
    // 查询客户分配审批人列表
    getApprovals: query => api.post('/groovynoauth/fsp/biz/developRelationship/queryNextApproval', query),
    // 创建客户分配申请
    createDistributeApply: query => api.post('/groovynoauth/fsp/cust/manager/createDistributeApply', query),
  };
}
