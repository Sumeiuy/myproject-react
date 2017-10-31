/**
 * 通道类型协议的接口
 */

export default function channels(api) {
  return {
    // 获取详情信息
    getProtocolDetail: query => api.post('/groovynoauth/fsp/protocol/queryProtocolDetail', query),
    // 保存详情
    saveProtocolData: query => api.post('/groovynoauth/fsp/protocol/saveProtocol', query),
    // 不明
    getTemplate: query => api.post('/groovynoauth/fsp/protocol/getTemplate', query),
    // 不明
    queryTypeVaules: query => api.post('/groovynoauth/fsp/protocol/queryTypeVaules', query),
  };
}
