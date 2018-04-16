/**
 * @Description: 用户中心模块相关接口
 * @Author: xiaZhiQiang
 * @Date: 2018-04-11 14:47:50
 */

export default function taskFeedback(api) {
  return {
    // 获取用户基本信息
    queryEmpInfo: query => api.post('/groovynoauth/fsp/emp/infomanagement/queryEmpInfo', query),
    // 查询用户标签
    queryAllLabels: query => api.post('/groovynoauth/fsp/emp/label/queryAllLabels', query),
    // 查询审批人
    queryApprovers: query => api.post('/groovynoauth/fsp/emp/infomanagement/queryApprovers', query),
    // 添加标签
    addLabel: query => api.post('/groovynoauth/fsp/emp/label/addLabel', query),
    // 修改标签
    updateLabel: query => api.post('/groovynoauth/fsp/emp/label/updateLabel', query),
    // 删除标签
    deleteLabel: query => api.post('/groovynoauth/fsp/emp/label/deleteLabel', query),
    // 提交审批
    updateEmpInfo: query => api.post('/groovynoauth/fsp/emp/infomanagement/updateEmpInfo', query),
    // 查询审批流程及员工信息
    queryApprovingEmpInfo: query => api.post('/groovynoauth/fsp/emp/infomanagement/queryApprovingEmpInfo', query),
    // 审批信息(通过or拒绝)
    approveEmpInfo: query => api.post('/groovynoauth/fsp/emp/infomanagement/approveEmpInfo', query),
  };
}
