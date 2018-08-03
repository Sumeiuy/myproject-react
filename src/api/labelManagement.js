/*
 * @Author: WangJunJun
 * @Date: 2018-08-03 12:53:30
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-03 12:58:19
 */


export default function labelManagement(api) {
  return {
    // 获取标签列表
    queryLabelList: query => api.post('/groovynoauth/fsp/cust/custlabel/queryLabelList', query),
    // 单条标签删除
    deleteLabel: query => api.post('/groovynoauth/fsp/cust/custlabel/cancelCustLabel', query),
    // 新建或编辑标签
    operateLabel: query => api.post('/groovynoauth/fsp/cust/custlabel/operateCustLabels', query),
    // 给分组内客户打标签
    signLabelForGroupCust: query => api.post('/groovynoauth/fsp/cust/custlabel/signGroupCustLabel', query),
  };
}
