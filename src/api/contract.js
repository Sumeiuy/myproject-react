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
    // 保存合作合约
    saveContractData: query => api.post('/groovynoauth/fsp/contract/cooper/saveContract', query),
    // 查询合作合约编号
    getContractNumList: query => api.post('/groovynoauth/fsp/contract/cooper/queryContractId', query),
    // 查询合作部门
    getCooperDeparmentList: query => api.post('/groovynoauth/fsp/contract/cooper/queryDeparment', query),
    // 查询合约条款名称列表
    getClauseNameList: query => api.post('/groovynoauth/fsp/contract/cooper/termNameList', query),
  };
}
