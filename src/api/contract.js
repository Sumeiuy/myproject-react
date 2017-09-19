/**
 * 用户反馈模块的接口
 */

export default function contract(api) {
  return {
    getContractDetail: query => api.post('/groovynoauth/fsp/contract/cooper/queryDetail', query),
    // 获取详情信息
    getMessage: query => api.post('/groovynoauth/contract/contractMessage', query),
    // 获取权限申请列表
    getContractList: query => api.post('/groovynoauth/contract/queryContractList', query),
  };
}
