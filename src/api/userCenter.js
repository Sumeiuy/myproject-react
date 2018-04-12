/**
 * @Description: 用户中心模块相关接口
 * @Author: xiaZhiQiang
 * @Date: 2018-04-11 14:47:50
 */

export default function taskFeedback(api) {
  return {
    // 获取用户基本信息
    queryUserBaseInfo: query => api.post('/groovynoauth/fsp/emp/labelAndDesc/queryUserBaseInfo', query),
    // 查询用户标签
    queryAllLabels: query => api.post('/groovynoauth/fsp/emp/labelAndDesc/queryAllLabels', query),
    // 查询审批人
    queryEmpLabelAndDescApprover: query => api.post('/groovynoauth/fsp/emp/labelAndDesc/queryEmpLabelAndDescApprover', query),
  };
}
