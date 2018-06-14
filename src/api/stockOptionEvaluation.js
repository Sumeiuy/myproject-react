/*
 * @Author: zhangjun
 * @Date: 2018-06-05 16:24:22
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-14 13:55:21
 */
export default function stockOptionEvaluation(api) {
  return {
    // 右侧详情基本信息
    getDetailInfo: query => api.post('/groovynoauth/fsp/biz/stockOptionApplication/queryApplicationDetail', query),
    // 获取附件列表
    getAttachmentList: query => api.post('/file/ceFileList2', query),
    // 上传附件
    uploadAttachment: query => api.post('/file/ceFileUpload2', query),
    // 新建页面查询下一步审批人
    queryNextApproval: query => api.post('/groovynoauth/fsp/stockOptionApplication/queryNextApproval', query),
    // 下一步按钮和下一步审批人
    getButtonList: query => api.post('/groovynoauth/fsp/stockOptionApplication/queryNextStepInfo', query),
    // 下载附件
    downloadAttachment: query => api.post('/file/ceFileDownload2', query),
    // 删除附件
    deleteAttachment: query => api.post('/file/ceFileDelete2', query),
    // 更新接口（新建和修改）
    updateApplication: query => api.post('/groovynoauth/fsp/stockOptionApplication/update', query),
    // 走流程接口
    doApprove: query => api.post('/groovynoauth/fsp/stockOptionApplication/doApprove', query),
    // 验证提交数据接口
    validateData: query => api.post('/groovynoauth/fsp/stockOptionApplication/validate', query),
    // 选择客户获取用户信息
    getCustInfo: query => api.post('/groovynoauth/fsp/biz/stockOptionApplication/custInfo', query),
    // 查询本营业部客户
    getBusCustList: query => api.post('/groovynoauth/fsp/biz/queryBusCustList', query),
    // 基本信息的多个select数据
    getSelectMap: query => api.post('/groovynoauth/fsp/biz/stockOptionApplication/typeMap', query),
    // 受理营业部变更查询
    queryAcceptOrg: query => api.post('/groovynoauth/fsp/biz/stockOptionApplication/queryAcceptOrg', query),
  };
}
