/**
 * 分公司客户划转相关接口
 */

export default function cust(api) {
  return {
    // 获取原客户经理
    getOldManager: query => api.post('/groovynoauth/fsp/cust/custServiceInfo', query),
    // 查询客户列表
    getCustList: query => api.post('/groovynoauth/fsp/cust/custList', query),
    // 获取新客户经理列表
    getNewManagerList: query => api.post('/groovynoauth/fsp/cust/managerList', query),
    // 保存接口
    saveChange: query => api.post('/groovynoauth/fsp/cust/saveChange', query),
  };
}
