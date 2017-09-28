/**
 * @description Seibel通用接口
 * @author sunweibin
 */

export default function seibelCommon(api) {
  return {
    // Home左侧列表
    getSeibleList: query => api.post('/groovynoauth/fsp/biz/queryApplicationList', query),
    // 通过用户输入的关键字，获取已申请的客户列表
    getCustList: query => api.post('/groovynoauth/fsp/biz/empCustList', query),
    // 通过用户输入的关键字，获取可选的拟稿人列表
    getDrafterList: query => api.post('/groovynoauth/fsp/biz/queryDrafterList', query),
    // 获取部门
    getCustRange: query => api.post('/groovynoauth/fsp/biz/queryOrgInfo', query),
    // 通过用户输入的关键字，获取可申请的客户列表
    getCanApplyCustList: query => api.post('/groovynoauth/fsp/biz/custList', query),
  };
}
