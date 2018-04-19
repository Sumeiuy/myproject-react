/**
 * @Description: 用户中心模块相关接口
 * @Author: xiaZhiQiang
 * @Date: 2018-04-11 14:47:50
 */

export default function telephoneNumberManage(api) {
  return {
    // 服务经理列表
    queryEmpList: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/queryEmpList', query),
    // 获取部门
    getCustRange: query => api.post('/groovynoauth/fsp/biz/queryOrgInfo', query),
    // 投顾手机分配页面表格列表数据
    queryTgBindTableList: query => api.post('/groovynoauth/fsp/emp/phonebinding/queryTgBindList', query),
    // 获取新建页面投顾列表
    queryTgList: query => api.post('/groovynoauth/fsp/emp/phonebinding/queryTgList', query),
  };
}
