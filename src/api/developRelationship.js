/**
 * 开发关系认定模块的接口
 */

export default function developRelationship(api) {
  return {
    // 获取详情信息
    getDetailInfo: query => api.post('/groovynoauth/fsp/biz/developrelationship/queryApplicationDetail', query),
    // 新建开发关系认定
    createDevelopRelationship: query => api.post('/groovynoauth/fsp/biz/developrelationship/createApplication', query),
    // 查询可申请开发关系认定的客户是否可用
    isValidCust: query => api.post('/groovynoauth/fsp/biz/developrelationship/isValidCust', query),
    // 查询新建时原开发团队
    getOldDevelopTeamList: query => api.post('/groovynoauth/fsp/biz/developrelationship/queryOriginRelation', query),
    // 查询可添加新开发团队服务经理的接口
    getAddEmpList: query => api.post('/groovynoauth/fsp/biz/developrelationship/empList', query),
    // 获取按钮列表和下一步审批人
    getButtonList: query => api.post('/groovynoauth/fsp/biz/developrelationship/queryButtonList', query),
  };
}
