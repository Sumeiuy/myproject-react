/*
 * @Author: zhangjun
 * @Date: 2018-04-25 15:18:13
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-06 15:44:04
 * @Descripter:投资建议模板相关接口
 */
export default function investmentAdvice(api) {
  return {
    // 获取投资建议模版列表
    getInvestAdviceList: query => api.post('/groovynoauth/fsp/investAdvice/list', query),
    // 删除投资建议固定话术模板
    deleteInvestAdvice: query => api.post('/groovynoauth/fsp/investAdvice/delete', query),
    // 新建或编辑模版
    modifyInvestAdvice: query => api.post('/groovynoauth/fsp/investAdvice/modify', query),
    // 投顾自由文本投资建议-增加撞墙检测
    testWallCollision: query => api.post('/groovynoauth/fsp/cust/service/checkFreeServeContent', query),
    // 查询任务绑定投资建议模板的任务列表
    queryTaskBindTemplateList: query => api.post('/groovynoauth/fsp/campaign/investAdvice/queryTaskBindTemplateList', query),
    // 删除任务绑定的投资建议模板
    delTaskBindTemplate: query => api.post('/groovynoauth/fsp/campaign/investAdvice/delTaskBindTemplate', query),
    // 为当前任务绑定投资建议模板
    bindTemplateListForMission: query => api.post('/groovynoauth/fsp/campaign/investAdvice/bindTemplateListForMission', query),
  };
}
