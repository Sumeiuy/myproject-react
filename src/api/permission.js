/**
 * 权限申请模块的接口
 */

export default function permission(api) {
  return {
    // 获取详情信息
    getMessage: query => api.post('/groovynoauth/fsp/smkhsq/queryApplicationDetail', query),
    // 获取服务人员列表
    getServerPersonelList: query => api.post('/groovynoauth/fsp/smkhsq/queryApplicationEmpList', query),
    // // 获取子类型
    // getChildTypeList: query => api.post('/groovynoauth/fsp/smkhsq/queryAvalibleEmpList', query),
    // 新建状态下 获取已经有得服务人员列表
    getHasServerPersonList: query => api.post('/groovynoauth/fsp/smkhsq/queryCustEmpList', query),
    // 查询某客户的服务人员待选择列表
    getSearchServerPersonelList: query => api.post('/groovynoauth/fsp/smkhsq/queryEmpList', query),
  };
}
