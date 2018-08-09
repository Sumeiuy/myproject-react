/*
 * @Author: WangJunJun
 * @Date: 2018-08-03 12:53:30
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-09 11:15:48
 */


export default function labelManagement(api) {
  return {
    // 获取标签列表
    queryLabelList: query => api.post('/groovynoauth/fsp/cust/custlabel/queryLabelList', query),
    // 单条标签删除
    deleteLabel: query => api.post('/groovynoauth/fsp/cust/custlabel/cancelCustLabel', query),
    // 新建或编辑标签
    operateLabel: query => api.post('/groovynoauth/fsp/cust/custlabel/signBatchCustLabels', query),
    // 给分组内客户打标签
    signLabelForGroupCust: query => api.post('/groovynoauth/fsp/cust/custlabel/signGroupCustLabel', query),
    // 标签名重名校验
    checkDuplicationName: query => api.post('/groovynoauth/fsp/cust/custlabel/checkDuplicationName', query),
    // 查询分组列表
    queryCustGroupList: query => api.post('/groovynoauth/fsp/cust/custgroup/queryCustGroupList', query),
    // 查询分组下的客户
    queryGroupCustList: query => api.post('/groovynoauth/fsp/cust/custgroup/queryGroupCustList', query),
    // 分组转标签
    group2Label: query => api.post('/groovynoauth/fsp/cust/custlabel/signGroupCustLabel', query),
    // 查询标签下的客户
    queryLabelCust: query => api.post('/groovynoauth/fsp/cust/custlabel/queryEmpCustsByLabelId', query),
    // 删除标签下的客户
    deleteLabelCust: query => api.post('/groovynoauth/fsp/cust/custlabel/deleteCustSignedLabel', query),
    // 验证是否名下客户
    isSendCustsServedByEmp: query => api.post('/groovynoauth/fsp/cust/task/isSendCustsServedByEmp', query),
  };
}
