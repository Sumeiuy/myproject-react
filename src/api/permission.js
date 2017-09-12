/**
 * 权限申请模块的接口
 */

export default function permission(api) {
  return {
    // 获取详情信息
    getMessage: query => api.post('/groovynoauth/permission/permissionMessage', query),
    // 获取权限申请列表
    getPermissionList: query => api.post('/groovynoauth/permission/queryPermissionList', query),
  };
}
