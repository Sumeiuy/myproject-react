/**
 * @Author: ouchangzhi
 * @Date: 2018-01-17 09:33:41
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-25 09:15:48
 * @description 售前适当性查询接口
 */

export default function preSaleQuery(api) {
  return {
    // 查询客户列表
    getCustList: query => api.post('/groovynoauth/fsp/cust/custlist/queryVisibleCustList', query),
    // 查询产品列表
    getProductList: query => api.post('/groovynoauth/fsp/product/finprod/queryFinProdList', query),
    // 查询适当性匹配结果
    getMatchResult: query => api.post('/groovynoauth/fsp/product/finprod/queryMatchResult', query),
  };
}
