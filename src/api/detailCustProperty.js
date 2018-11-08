/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性相关api
 * @Date: 2018-11-07 10:00:46
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-07 15:49:10
 */
export default function detailCustProperty(api) {
  return {
    // 获取客户属性信息
    queryCustomerProperty: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustPropertyInfo', query),
    // 获取涨乐财富通U会员信息
    queryZLUmemberInfo: query => api.post('/groovynoauth/fsp/cust/custdetail/queryZhangleUMemberInfo', query),
    // 获取涨乐财富通U会员等级变更记录
    queryZLUmemberLevelChangeRecords: query => api.post('/groovynoauth/fsp/cust/custdetail/queryZhangeLeUMemberChangeList', query),
  };
}
