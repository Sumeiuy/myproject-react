/**
 * 权限申请模块的接口
 */

export default function permission(api) {
  return {
    // 获取详情信息
    getMessage: query => api.post('/groovynoauth/smkh/queryApplicationDetail', query),
    // 获取服务人员列表
    getServerPersonelList: query => api.post('/groovynoauth/smkh/queryApplicationEmpList', query),
    // 获取子类型
    getChildTypeList: query => api.post('/groovynoauth/smkh/queryAvalibleEmpList', query),
    // 获取客户列表
    getCustomerList: query => api.post('/groovynoauth/smkh/queryCustList', query),
    // 获取权限申请列表
    getPermissionList: query => api.post('/groovynoauth/smkh/queryApplicationList', query),
    // 获取拟稿人
    getDrafterList: query => api.post('/groovynoauth/smkh/queryEmpList', query),
    // 获取部门
    getEmpOrgTree: query => api.post('/groovynoauth/jxzb/empOrgTree', query),
  };
}
