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
    // 查询操作类型/子类型
    queryTypeVaules: query => api.post('/groovynoauth/fsp/protocol/queryTypeVaules', query),
    // 根据所选模板id查询协议条款
    queryChannelProtocolItem: query => api.post('/groovynoauth/fsp/channel/queryChannelProtocolItem', query),
    // 查询协议产品列表
    queryChannelProtocolProduct: query => api.post('/groovynoauth/fsp/channel/queryChannelProtocolProduct', query),
    // 查询客户
    queryCust: query => api.post('/groovynoauth/fsp/channel/queryCust', query),
    // 获取附件列表
    getAttachmentList: query => api.post('/file/ceFileList', query),
  };
}
