/*
 * @Author: yuanhaojie
 * @Date: 2018-11-20 16:24:14
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-29 10:19:41
 * @Description: 客户360-产品订单相关api
 */

export default function detailProductOrder(api) {
  return {
    // 根据关键字搜索服务产品
    queryServiceProduct: query => api.post('/groovynoauth/fsp/cust/prodorder/queryServiceProduct', query),
    // 获取服务订单流水列表
    queryServiceOrderFlow: query => api.post('/groovynoauth/fsp/cust/prodorder/queryServiceOrderFlow', query),
    // 获取服务订单详情、其他佣金
    queryServiceOrderDetail: query => api.post('/groovynoauth/fsp/cust/prodorder/queryServiceOrderDetail', query),
    // 获取服务订单详情 - 服务产品
    queryServiceProductList: query => api.post('/groovynoauth/fsp/cust/prodorder/queryServiceProductList', query),
    // 获取服务订单详情 - 审批
    queryOrderApproval: query => api.post('/groovynoauth/fsp/cust/prodorder/queryOrderApproval', query),
    // 获取交易订单流水
    queryTradeOrderFlow: query => api.post('/groovynoauth/fsp/cust/custdetail/queryTradeOrderList', query),
    // 获取附件列表
    getAttachmentList: query => api.post('/file/ceFileList2', query),
    // 获取服务订购订单列表
    queryServiceOrderData: query => api.post('/groovynoauth/fsp/cust/serviceorder/queryServiceOrderingList', query),
    // 查询是否可跳转佣金调整的信息
    queryCustCanChangeCommission: query => api.post('/groovynoauth/fsp/cust/serviceorder/queryCustHasActiveArg', query),
  };
};
