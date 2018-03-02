/**
 * @Description: 个股相关接口
 * @Author: Liujianshu
 * @Date: 2018-03-01 14:35:50
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-03-01 14:38:22
 */

export default function stock(api) {
  return {
    // 个股列表
    getStockList: query => api.post('/groovynoauth/fsp/stock/list', query),
    // 详情
    getStockDetail: query => api.post('/groovynoauth/fsp/stock/detail', query),
  };
}
