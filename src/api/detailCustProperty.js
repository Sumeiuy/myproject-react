/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性相关api
 * @Date: 2018-11-07 10:00:46
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-28 20:09:16
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
    // 查询个人客户联系方式数据
    queryPersonalContactWay: query => api.post('/groovynoauth/fsp/cust/custdetail/queryContactWayForPerson', query),
    // 查询机构客户联系方式数据
    queryOrgContactWay: query => api.post('/groovynoauth/fsp/cust/custdetail/queryContactWayForOrg', query),
    // 修改个人客户的联系方式中的请勿发短信，请勿打电话
    changePhoneInfo: query => api.post('/groovynoauth/fsp/cust/custdetail/changePersonalContactWayPhone', query),
    // 新增，修改个人客户联系方式电话信息
    updatePerPhone: query => api.post('/groovynoauth/fsp/cust/custdetail/operateContactWayForPhone', query),
    // 新增，修改个人客户联系方式地址信息
    updatePerAddress: query => api.post('/groovynoauth/fsp/cust/custdetail/operateContactWayForAddress', query),
    // 新增，修改个人客户联系方式其他信息
    updatePerOther: query => api.post('/groovynoauth/fsp/cust/custdetail/operateContactWayForOther', query),
    // 新增，修改机构客户联系方式电话信息
    updateOrgPhone: query => api.post('/groovynoauth/fsp/cust/custdetail/operateOrgContactWayForPhone', query),
    // 新增，修改机构客户联系方式地址信息
    updateOrgAddress: query => api.post('/groovynoauth/fsp/cust/custdetail/operateOrgContactWayForAddress', query),
    // 删除个人客户、机构客户的联系方式
    delContact: query => api.post('/groovynoauth/fsp/cust/custdetail/deleteContact', query),
    // 查询个人客户、机构客户的财务信息
    queryFinanceDetail: query => api.post('/groovynoauth/fsp/cust/custdetail/queryFinanceDetail', query),
    // 编辑个人客户的财务信息
    updatePerFinaceData: query => api.post('/groovynoauth/fsp/cust/custdetail/updatePerFinaceData', query),
    // 编辑机构客户的财务信息
    updateOrgFinaceData: query => api.post('/groovynoauth/fsp/cust/custdetail/updateOrgFinaceData', query),
  };
}
