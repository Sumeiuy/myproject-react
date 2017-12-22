/*
 * @Description: 设置主职位的接口
 * @Author: LiuJianShu
 * @Date: 2017-12-21 15:08:01
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-12-21 17:08:48
 */

export default function mainPosition(api) {
  return {
    // 查询分公司范围内的员工
    searchEmployee: query => api.post('/groovynoauth/fsp/emp/info/queryEmps', query),
    // 根据员工 ID 查询员工职位
    searchPosition: query => api.post('/groovynoauth/fsp/emp/info/queryEmpPostnInfos', query),
    // 设置主职位
    updatePosition: query => api.post('/groovynoauth/fsp/emp/info/chgMainPostn', query),
  };
}
