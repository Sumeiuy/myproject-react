/**
 * @Description: 账户限制管理 api
 * @Author: Liujianshu
 * @Date: 2018-07-31 14:50:58
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-08-01 16:02:11
 */
export default function accountLimit(api) {
  return {
    // 获取详情信息
    queryDetailInfo: query => api.post('/groovynoauth/fsp/biz/accountrestriction/queryCustAccountRestrictionDetail', query),
    // 下一步按钮和下一步审批人
    queryButtonList: query => api.post('/groovynoauth/fsp/biz/accountrestriction/queryNextStepInfo', query),
    // 根据关键字查询客户列表
    queryCustList: query => api.post('/groovynoauth/fsp/biz/accountrestriction/queryCustomerList', query),
    // 根据关键字查询限制类型列表
    queryLimtList: query => api.post('/groovynoauth/fsp/biz/accountrestriction/queryAccountRestrictionType', query),
    // 校验接口
    validateForm: query => api.post('/groovynoauth/fsp/biz/accountrestriction/validateAccountRestrict', query),
    // 提交客户分配
    saveChange: query => api.post('/groovynoauth/fsp/biz/accountrestriction/saveAccountRestriction', query),
    // 走流程接口
    doApprove: query => api.post('/groovynoauth/fsp/biz/accountrestriction/doApprove', query),
  };
}
