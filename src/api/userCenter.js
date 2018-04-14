/**
 * @Description: 用户中心模块相关接口
 * @Author: xiaZhiQiang
 * @Date: 2018-04-11 14:47:50
 */

export default function taskFeedback(api) {
  return {
    // 获取用户基本信息
    queryUserBaseInfo: query => api.post('/groovynoauth/fsp/emp/labelAndDesc/queryUserBaseInfo', query),
    // 查询用户标签
    queryAllLabels: query => api.post('/groovynoauth/fsp/emp/labelAndDesc/queryAllLabels', query),
    // 查询审批人
    queryEmpLabelAndDescApprover: query => api.post('/groovynoauth/fsp/emp/labelAndDesc/queryEmpLabelAndDescApprover', query),
    // 添加标签
    addLabel: query => api.post('/groovynoauth/fsp/emp/labelAndDesc/addLabel', query),
    // 修改标签
    updateLabel: query => api.post('/groovynoauth/fsp/emp/labelAndDesc/updateLabel', query),
    // 删除标签
    deleteLabel: query => api.post('/groovynoauth/fsp/emp/labelAndDesc/deleteLabel', query),
    // 提交审批
    sentEmpInfoApproval: query => api.post('/groovynoauth/fsp/emp/labelAndDesc/sentEmpInfoApproval', query),
    // 查询审批流程及员工信息
    queryApprovalInfo: query => api.post('/groovynoauth/fsp/emp/labelAndDesc/queryApprovalInfo', query),
    // 审批信息
    approvalEmpInfo: query => api.post('/groovynoauth/fsp/emp/labelAndDesc/approvalEmpInfo', query),
  };
}
