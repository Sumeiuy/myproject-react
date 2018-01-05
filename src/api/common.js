/**
 * @Description: 公用的接口
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-01-04 17:31:38
 */
export default function common(api) {
  return {
    // 获取部门
    getCustRange: query => api.post('/groovynoauth/fsp/queryOrgInfo', query),
    // 员工职责与职位
    getEmpInfo: query => api.post('/groovynoauth/fsp/emp/info/queryEmpInfo', query),
    // 获取用户有权限查看的菜单
    getMenus: query => api.post('/groovynoauth/fsp/emp/menu/queryMenus4Emp', query),
  };
}
