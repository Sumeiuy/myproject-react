/**
 * @Description: 公用的接口
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-15 15:14:45
 */
export default function common(api) {
  return {
    // 获取部门
    getCustRange: query => api.post('/groovynoauth/fsp/queryOrgInfo', query),
    // 员工职责与职位
    getEmpInfo: query => api.post('/groovynoauth/fsp/emp/info/queryEmpInfo', query),
    // 获取用户有权限查看的菜单
    getMenus: query => api.post('/groovynoauth/fsp/emp/menu/queryMenus4Emp', query),
    // 用户切换岗位
    changePost: query => api.post('/groovynoauth/fsp/emp/info/changePost', query),
    // 添加服务记录中 服务类型
    getServiceType: query => api.post('/groovynoauth/fsp/campaign/mot/queryMissionList2', query),
    // 查询瞄准镜筛选条件
    getFiltersOfSightingTelescope: query => api.post('/groovynoauth/fsp/cust/custlist/queryFilters', query),
    // 增加通话记录接口，关联服务记录
    addCallRecord: query => api.post('/groovynoauth/fsp/emp/mobilebinding/addCallRecord', query),
  };
}
