/**
 * @Descripter: 平台参数设置/运营中心
 * @Author: K0170179
 * @Date: 2018/4/28
 */

export default function operationCenter(api) {
  return {
    // 查询用户标签（来自瞄准镜和普通）
    queryCustLabels: query => api.post('/groovynoauth/fsp/cust/custlabel/queryCustLabels', query),
    // 更新首页标签
    updataCustLabels: query => api.post('/groovynoauth/fsp/cust/custlabel/updateCustLabels', query),
  };
}
