/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系信息申请接口api
 * @Date: 2018-06-08 13:09:53
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-06-08 13:16:01
 */


export default function telephoneNumberManage(api) {
  return {
    // 右侧详情基本信息
    getDetailInfo: query => api.post('/groovynoauth/fsp/cust/custrelationships/queryApplicationDetail', query),
    // 获取附件列表
    getAttachmentList: query => api.post('/file/ceFileList2', query),
    // 下一步按钮和下一步审批人
    getButtonList: query => api.post('/groovynoauth/fsp/cust/custrelationships/queryNextStepInfo', query),
    // 验证提交数据接口
    validateData: query => api.post('/groovynoauth/fsp/cust/custrelationships/validate', query),
    // 更新接口（新建和修改提交）
    updateBindingFlow: query => api.post('/groovynoauth/fsp/cust/custrelationships/saveApplication', query),
    // 走流程接口
    doApprove: query => api.post('/groovynoauth/fsp/cust/custrelationships/doApprove', query),
  };
}
