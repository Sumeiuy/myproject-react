/*
 * @Description: 公用的接口
 * @Author: LiuJianShu
 * @Date: 2017-09-27 14:24:57
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-09-27 15:11:33
 */
export default function common(api) {
  return {
    // 获取部门
    getCustRange: query => api.post('/groovynoauth/fsp/queryOrgInfo', query),
    // 员工职责与职位
    getEmpInfo: query => api.post('/groovynoauth/fsp/emp/info/queryEmpInfo', query),
  };
}
