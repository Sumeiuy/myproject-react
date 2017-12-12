/**
 * 分公司客户划转相关接口
 */

export default function cust(api) {
  return {
    // 获取原客户经理
    getOldManager: query => api.post('/groovynoauth/fsp/cust/manager/queryCustServiceInfo', query),
    // 查询客户列表
    getCustList: query => api.post('/groovynoauth/fsp/cust/manager/queryCustListByPostn', query),
    // 获取新服务经理列表
    getNewManagerList: query => api.post('/groovynoauth/fsp/cust/manager/queryEmpPostns', query),
    // 保存接口
    saveChange: query => api.post('/groovynoauth/fsp/cust/manager/changeCustmentAssignment', query),
  };
}
