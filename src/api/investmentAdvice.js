/*
 * @Author: zhangjun
 * @Date: 2018-04-25 15:18:13
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-04 17:35:07
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
    queryTaskBindTemplateList: query => api.post('/groovynoauth/fsp/campaign/mot/queryTaskBindTemplateList', query),
  };
}
