/**
 * @description Seibel通用接口
 * @author sunweibin
 */

export default function seibelCommon(api) {
  return {
    // Home左侧列表
    getSeibleList: query => api.post('/groovynoauth/fsp/biz/queryApplicationList', query),
    // Home左侧列表
    getNewSeibleList: query => api.post('/groovynoauth/fsp/biz/queryApplicationList2', query),
    // 通过用户输入的关键字，获取已申请的客户列表
    getCustList: query => api.post('/groovynoauth/fsp/biz/empCustList', query),
    // 通过用户输入的关键字，获取已申请的客户列表,因为权限问题后端新增搜索客户列表接口
    getCustList2: query => api.post('/groovynoauth/fsp/biz/empCustList2', query),
    // 通过用户输入的关键字，获取可选的拟稿人列表
    getDrafterList: query => api.post('/groovynoauth/fsp/biz/queryDrafterList', query),
    // 获取部门
    getCustRange: query => api.post('/groovynoauth/fsp/biz/queryOrgInfo', query),
    // 新的获取部门
    getCustRange2: query => api.post('/groovynoauth/fsp/biz/queryOrgInfo2', query),
    // 通过用户输入的关键字，获取可申请的客户列表
    getCanApplyCustList: query => api.post('/groovynoauth/fsp/biz/custList', query),
    // 删除附件
    deleteAttachment: query => api.post('/file/ceFileDelete2', query),
    // 查询某客户的服务人员待选择列表
    getSearchServerPersonelList: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/queryEmpList', query),
    // 查询批量佣金调整详情页面中查看单个用户的审批记录
    getFlowHistory: query => api.post('/groovynoauth/fsp/flow/queryFlowHistory', query),
  };
}
