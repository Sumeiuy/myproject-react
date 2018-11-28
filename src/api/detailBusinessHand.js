/*
 * @Author: wangyikai
 * @Date: 2018-11-19 14:29:10
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-27 15:48:06
 */
export default function detailBusinessHand(api) {
  return {
    // 查询新版客户360详情下的业务办理中已开通业务
    queryOpenBusiness: query => api.post('/groovynoauth/fsp/cust/custdetail/queryOpenBusiness', query),
    // 查询新版客户360详情下的业务办理中未开通业务
    queryNotOpenBusiness: query => api.post('/groovynoauth/fsp/cust/custdetail/queryNotOpenBusiness', query),
    // 查询新版客户360详情下的业务办理中未开通业务的操作方法
    queryDetailOperation: query => api.post('/groovynoauth/fsp/cust/custdetail//queryDetailOperation', query),
  };
}
