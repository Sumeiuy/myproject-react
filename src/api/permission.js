/**
 * 权限申请模块的接口
 */

export default function permission(api) {
  return {
    // 员工职责与职位
    getEmpInfo: query => api.post('/groovynoauth/fsp/emp/info/queryEmpInfo', query),
  };
}
