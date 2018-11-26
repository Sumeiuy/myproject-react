/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性相关api
 * @Date: 2018-11-07 10:00:46
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-22 13:36:14
 */
export default function detailCustProperty(api) {
  return {
    // 获取客户属性信息
    queryCustomerProperty: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustPropertyInfo', query),
    // 获取涨乐财富通U会员信息
    queryZLUmemberInfo: query => api.post('/groovynoauth/fsp/cust/custdetail/queryZLUMemberInfo', query),
    // 获取涨乐财富通U会员等级变更记录
    queryZLUmemberLevelChangeRecords: query => api.post('/groovynoauth/fsp/cust/custdetail/queryZLUMemberChangeList', query),
    // 获取紫金积分会员信息
    queryZjPointMemberInfo: query => api.post('/groovynoauth/fsp/cust/custdetail/queryZjPointMemberInfo', query),
    // 获取紫金积分会员积分兑换流水
    queryZjPointExchangeFlow: query => api.post('/groovynoauth/fsp/cust/custdetail/queryZjPointExchangeFlow', query),
    // 编辑个人客户、机构客户的基本信息
    updateCustBasicInfo: query => api.post('/groovynoauth/fsp/cust/custdetail/modifyBasicInfo', query),
    // 查询个人客户、机构客户的财务信息
    queryFinanceDetail: query => api.post('/groovynoauth/fsp/cust/custdetail/queryFinanceDetail', query),
    // 编辑个人客户的财务信息
    updatePerFinaceData: query => api.post('/groovynoauth/fsp/cust/custdetail/updatePerFinaceData', query),
    // 编辑机构客户的财务信息
    updateOrgFinaceData: query => api.post('/groovynoauth/fsp/cust/custdetail/updateOrgFinaceData', query),
  };
}
