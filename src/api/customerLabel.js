/**
 * @Descripter: 客户标签
 * @Author: K0170179
 * @Date: 2018/7/4
 */


export default function customerPool(api) {
  return {
    // 删除客户自定义标签
    deleteLabel: query => api.post('/groovynoauth/fsp/cust/custlabel/deleteLabel', query),
    // 新增自定义标签
    addLabel: query => api.post('/groovynoauth/fsp/cust/custlabel/addLabel', query),
    // 新建自定义标签类型
    addLabelType: query => api.post('/groovynoauth/fsp/cust/custlabel/addLabelType', query),
    // 查询客户标签
    queryLabelInfo: query => api.post('/groovynoauth/fsp/cust/custlabel/queryLabelInfo', query),
    // 查询标签类型
    queryLabelType: query => api.post('/groovynoauth/fsp/cust/custlabel/queryLabelType', query),
    // 标签名重名校验
    checkDuplicationName: query => api.post('/groovynoauth/fsp/cust/custlabel/checkDuplicationName', query),
    // 查询客户已标记标签
    queryCustSignedLabels: query => api.post('/groovynoauth/fsp/cust/custlabel/queryCustSignedLabels', query),
    // 给单客户打标签
    signCustLabels: query => api.post('/groovynoauth/fsp/cust/custlabel/signCustLabels', query),
    // 给多客户打标签
    signBatchCustLabels: query => api.post('/groovynoauth/fsp/cust/custlabel/signBatchCustLabels', query),
    // 模糊查询客户标签
    queryLikeLabelInfo: query => api.post('/groovynoauth/fsp/cust/custlabel/queryLabelList', query),
  };
}
