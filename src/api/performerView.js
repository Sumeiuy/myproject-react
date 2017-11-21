/**
* 执行者视图模块的接口
*/

export default function performerView(api) {
  return {
    // 获取组织机构树完整版
    getCustRangeAll: query => api.post('/groovynoauth/fsp/emp/org/queryEmpOrgTree', query),
  };
}
