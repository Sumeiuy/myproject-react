/*
 * @Author: yuanhaojie
 * @Date: 2018-11-20 16:24:14
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-23 20:19:35
 * @Description: 客户360-产品订单相关api
 */

export default function detailProductOrder(api) {
  return {
    // 根据关键字搜索服务产品
    queryServiceProductByKeyword: query => api.post('/queryServiceProductByKeyword', query),
    // 获取服务订单流水列表
    queryServiceOrderFlow: query => api.post('/groovynoauth/fsp/cust/prodorder/queryServiceOrderFlow', query),
    // 获取服务订单详情
    queryServiceOrderDetail: query => api.post('/groovynoauth/fsp/cust/prodorder/queryServiceOrderDetail', query),
    // 获取服务订单详情 - 服务产品
    queryServiceProductList: query => api.post('/groovynoauth/fsp/cust/prodorder/queryServiceProductList', query),
    // 获取服务订单详情 - 审批
    queryOrderApproval: query => api.post('/groovynoauth/fsp/cust/prodorder/queryOrderApproval', query),
    // 获取服务订单详情 - 其他佣金
    queryOtherCommissions: query => api.post('/groovynoauth/fsp/cust/prodorder/queryOtherCommissions', query),
    // 获取交易订单流水
    queryTradeOrderFlow: query => api.post('/groovynoauth/fsp/cust/custDetail/queryTradeOrderFlow', query),
  };
};
