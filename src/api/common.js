/**
 * @Description: 公用的接口
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-08-02 11:06:15
 */
export default function common(api) {
  return {
    // 获取部门
    getCustRange: query => api.post('/groovynoauth/fsp/queryOrgInfo', query),
    // 员工职责与职位
    getEmpInfo: query => api.postFspData('/findEmpResInfo', query, { noEmpId: true }),
    // 获取用户有权限查看的菜单
    getMenus: query => api.postFspData('/newMenu', query, { noEmpId: true }),
    // 用户切换岗位
    // changePost: query => api.post('/groovynoauth/fsp/emp/info/changePost', query),
    changePost: query => api.postFspData('/chgPstn', query, { ignoreCatch: true }),
    // 添加服务记录中 服务类型
    getServiceType: query => api.post('/groovynoauth/fsp/campaign/mot/queryMissionList2', query),
    // 查询瞄准镜筛选条件
    getFiltersOfSightingTelescope: query => api.post('/groovynoauth/fsp/cust/custlist/queryFilters', query),
    // 增加通话记录接口，关联服务记录
    addCallRecord: query => api.post('/groovynoauth/fsp/emp/mobilebinding/addCallRecord', query),
    // 获取附件列表
    getAttachmentList: query => api.post('/file/ceFileList', query),
  };
}
