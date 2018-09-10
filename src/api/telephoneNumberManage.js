/**
 * @Description: 手机分配和申请模块相关接口
 * @Author: hongguangqing
 * @Date: 2018-04-24 14:47:50
 */

export default function telephoneNumberManage(api) {
  return {
    // 服务经理列表
    queryEmpList: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/queryEmpList', query),
    // 获取部门
    getCustRange: query => api.post('/groovynoauth/fsp/emp/mobilebinding/queryEmpOrgTree', query),
    // 投顾手机分配页面表格列表数据
    queryAdvisorBindList: query => api.post('/groovynoauth/fsp/emp/mobilebinding/queryAdvisorBindList', query),
    // 右侧详情基本信息
    getDetailInfo: query => api.post('/groovynoauth/fsp/emp/mobilebinding/queryApplicationDetail', query),
    // 获取申请详情页面的服务经理表格数据
    queryEmpAppBinding: query => api.post('/groovynoauth/fsp/emp/mobilebinding/queryAppBinding', query),
    // 获取附件列表
    getAttachmentList: query => api.post('/file/ceFileList2', query),
    // 获取新建页面投顾列表
    queryAdvisorList: query => api.post('/groovynoauth/fsp/emp/mobilebinding/queryAdvisorList', query),
    // 更新接口（新建和修改）
    updateBindingFlow: query => api.post('/groovynoauth/fsp/emp/mobilebinding/updateBindingFlow', query),
    // 走流程接口
    doApprove: query => api.post('/groovynoauth/fsp/emp/mobilebinding/doApprove', query),
    // 下一步按钮和下一步审批人
    getButtonList: query => api.post('/groovynoauth/fsp/emp/mobilebinding/queryNextStepInfo', query),
    // 验证提交数据接口
    validateData: query => api.post('/file/mobilebinding/validate', query),
    // 获取拨号信息
    queryPhoneInfo: query => api.post('/groovynoauth/fsp/emp/mobilebinding/queryPhoneInfo', query),
    // 删除绑定的服务经理
    deleteBindingAdvisor: query => api.post('/groovynoauth/fsp/emp/mobilebinding/deleteBindingAdvisor', query),
  };
}
