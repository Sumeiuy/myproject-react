/*
 * @Description: 降级客户接口文件
 * @Author: LiuJianShu
 * @Date: 2017-12-11 13:25:29
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-12-22 10:34:21
 */

export default function channels(api) {
  return {
    // 客户列表
    getCustList: query => api.post('/groovynoauth/fsp/cust/manager/queryRetailAdjustList', query),
    // 操作降级
    updateCust: query => api.post('/groovynoauth/fsp/cust/manager/adjustCustomerRetail', query),
  };
}
