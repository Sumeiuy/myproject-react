/**
 * 权限申请模块的接口
 */

export default function permission(api) {
  return {
    // 获取详情信息
    getMessage: query => api.post('/groovynoauth/smkh/permissionMessage', query),
    // 获取权限申请列表
    getPermissionList: query => api.post('/groovynoauth/smkh/queryPermissionList', query),
    // 获取拟稿人
    getEmpList: query => api.post('/groovynoauth/smkh/queryEmpList', query),
  };
}
