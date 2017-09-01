import apiCreator from '../utils/apiCreator';

const api = apiCreator();

const manageApi = {

  // 暴露api上的几个底层方法: get / post
  ...api,

    // 获取客户范围
  getCustRange: query => api.post('/groovynoauth/jxzb/empOrgTree', query),

  // 获取用户有权限查看(无编辑权限)的看板基本信息
  getAllVisibleReports: query => api.post('/groovynoauth/jxzb/queryVisibleBoard', query),

  // 查询当前用户可以编辑的报表看板
  getAllEditableReports: query => api.post('/groovynoauth/jxzb/queryMultiBoard', query),

  // 获取用户创建报表看板时候需要的可见范围
  getVisibleRange: query => api.post('/groovynoauth/jxzb/queryNextLevelOrg', query),

  // 保存用户创建的看板
  createBoard: query => api.post('/groovynoauth/jxzb/saveBoard', query),

  // 删除看板
  deleteBoard: query => api.post('/groovynoauth/jxzb/deleteBoard', query),

  // 更新看板
  updateBoard: query => api.post('/groovynoauth/jxzb/updateBoard', query),

};

export default manageApi;
