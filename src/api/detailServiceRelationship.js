/*
 * @Author: wangyikai
 * @Date: 2018-11-05 17:55:20
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-12 15:42:36
 */
export default function detailServiceRelationship(api) {
  return {
    // 查询新版客户360详情下的服务关系中服务团队
    queryCustServiceTeam: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustServiceTeam', query),
    // 查询新版客户360详情下的服务关系中介绍信息
    queryCustDevInfo: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustDevInfo', query),
    // 查询新版客户360详情下的服务关系中服务历史
    queryCustServiceHistory: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustServiceHistory', query),
  };
}
