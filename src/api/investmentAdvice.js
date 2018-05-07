/*
 * @Author: zhangjun
 * @Date: 2018-04-25 15:18:13
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-04-25 15:45:09
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
  };
}
