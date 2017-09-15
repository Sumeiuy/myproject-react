/**
 * 用户反馈模块的接口
 */

export default function contract(api) {
  return {
    getContractDetail: query => api.post('/groovynoauth/fsp/contract/cooper/queryDetail', query),
  };
}
