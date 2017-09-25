/**
 * @description Seibel通用接口
 * @author sunweibin
 */

export default function seibelCommon(api) {
  return {
    // 批量佣金调整Home左侧列表
    getSeibleList: query => api.post('/groovynoauth/fsp/queryApplicationList', query),
    // 通过用户输入的关键字，获取可选的客户列表
    getCustList: query => api.post('/groovynoauth/fsp/empCustList', query),
    // 通过用户输入的关键字，获取可选的拟稿人列表
    getDrafterList: query => api.post('/groovynoauth/fsp/queryDrafterList', query),
    // 获取部门
    getEmpOrgTree: query => api.post('/groovynoauth/fsp/queryOrgInfo', query),
  };
}
