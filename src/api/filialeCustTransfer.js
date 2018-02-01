/*
 * @Author: XuWenKang
 * @Description 分公司客户划转相关接口
 * @Date: 2017-12-13 10:16:45
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-01-29 13:53:53
 */

export default function cust(api) {
  return {
    // 获取详情信息
    getDetailInfo: query => api.post('/groovynoauth/fsp/cust/manager/queryApplicationDetail', query),
    // 获取原客户经理
    getOldManager: query => api.post('/groovynoauth/fsp/cust/manager/queryCustServiceInfo', query),
    // 查询客户列表
    getCustList: query => api.post('/groovynoauth/fsp/cust/manager/queryCustListByPostn', query),
    // 获取新服务经理列表
    getNewManagerList: query => api.post('/groovynoauth/fsp/cust/manager/queryEmpPostns', query),
    // 保存接口
    saveChange: query => api.post('/groovynoauth/fsp/cust/manager/changeCustmentAssignment', query),
    // 获取批量划转的数据
    queryCustomerAssignImport: query => api.post('/groovynoauth/fsp/cust/manager/queryCustomerAssignImport', query),
  };
}
