/*
 * @Author: sunweibin
 * @Date: 2018-10-09 16:55:35
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-06 19:54:35
 * @description 新版客户360详情下的账户信息Tab页的API
 */
export default function detailAccountInfo(api) {
  return {
    // 查询新版客户360详情下的账户信息Tab下的资产分布-雷达图数据
    queryAssetRadarData: query => api.post('/groovynoauth/fsp/cust/custdetail/assetDistribution', query),
    // 查询新版客户360详情下的账户信息Tab下的资产分布-某个雷达指标的数据
    querySpecificIndexData: query => api.post('/groovynoauth/fsp/cust/custdetail/queryAssetIndexData', query),
    // 查询新版客户360详情下的账户信息Tab下的资产分布-负债详情数据
    queryDebtDetail: query => api.post('/groovynoauth/fsp/cust/custdetail/queryDebtDetail', query),
    // 查询新版客户360详情下的账户信息Tab下实时持仓-实时资产数据
    queryRealTimeAsset: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustCurrentAssert', query),
    // 查询新版客户360详情下的账户信息Tab下实时持仓-证券实时持仓数据
    querySecuritiesHolding: query => api.post('/groovynoauth/fsp/cust/custdetail/queryStockCurrentPostion', query),
    // 查询新版客户360详情下的账户信息Tab下实时持仓-产品实时持仓数据
    queryStorageOfProduct: query => api.post('/groovynoauth/fsp/cust/custdetail/queryFundCurrentPostion', query),
    // 查询新版客户360详情下的账户信息Tab下对应的收益走势对比数据
    queryProfitRateInfo: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustPofitRateChart', query),
    // 查询新版客户360详情下的账户信息Tab下的账户概要信息
    queryAccountSummary: query => api.post('/groovynoauth/fsp/cust/custdetail/queryAccountSummaryInfo', query),
    // 查询新版客户360详情下的账户信息Tab下的普通账户、信用账户、期权账户
    queryAccountInfo: query => api.post('/groovynoauth/fsp/cust/custdetail/queryFundAndStockAccountInfo', query),
    // 获取是否有已实施的流程
    queryHasDoingFlow: query => api.post('/groovynoauth/fsp/cust/custdetail/checkCustAsset', query),
    // 查询证券历史持仓明细
    queryStockHistoryHolding: query => api.post('/groovynoauth/fsp/cust/custdetail/queryHistoryStockHoldingDetail', query),
    // 查询产品历史持仓明细
    queryProductHistoryHolding: query => api.post('/groovynoauth/fsp/cust/custdetail/queryProductHoldingDetail', query),
    // 查询期权历史持仓明细
    queryOptionHistoryHolding: query => api.post('/groovynoauth/fsp/cust/custdetail/queryOptionHoldingDetail', query),
    // 查询业务类别
    queryBusnTypeDict: query => api.post('/groovynoauth/fsp/cust/custdetail/queryBusnTypeDict', query),
    // 查询产品代码
    queryFinProductList: query => api.post('/groovynoauth/fsp/cust/custdetail/queryProductList', query),
    // 查询全产品目录
    queryProductCatalogTree: query => api.post('/groovynoauth/fsp/cust/custdetail/queryProductCatalogTree', query),
    // 查询普通账户交易流水
    queryStandardTradeFlow: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryStandardTradeFlow', query),
    // 查询信用账户交易流水
    queryCreditTradeFlow: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryCreditTradeFlow', query),
    // 查询期权账户交易流水
    queryOptionTradeFlow: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryOptionTradeFlow', query),
  };
}
