/**
 * 用户反馈模块的接口
 */

export default function contract(api) {
  return {
    // 获取详情信息
    getContractDetail: query => api.post('/groovynoauth/fsp/contract/cooper/queryDetail', query),
    // 获取附件信息
    getAttachList: query => api.post('/groovynoauth/fsp/contract/cooper/queryAttaches', query),
    // 获取附件列表
    getAttachmentList: query => api.post('/file/ceFileList', query),
    // 删除附件
    deleteAttachment: query => api.post('/file/ceFileDelete', query),
  };
}
