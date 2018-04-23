/**
 * @Description: 用户中心模块相关接口
 * @Author: xiaZhiQiang
 * @Date: 2018-04-11 14:47:50
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
    getAttachmentList: query => api.post('/file/ceFileList', query),
    // 获取新建页面投顾列表
    queryAdvisorList: query => api.post('/groovynoauth/fsp/emp/mobilebinding/queryAdvisorList', query),
    // 获取新建页面获取下一步审批人
    queryNextApproval: query => api.post('/groovynoauth/fsp/emp/mobilebinding/queryNextApproval', query),
  };
}
