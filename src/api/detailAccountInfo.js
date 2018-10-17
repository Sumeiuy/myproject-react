/*
 * @Author: sunweibin
 * @Date: 2018-10-09 16:55:35
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-10-16 17:42:17
 * @description 新版客户360详情下的账户信息Tab页的API
 */
export default function detailAccountInfo(api) {
  return {
    // 查询新版客户360详情下的账户信息Tab下的资产分布-雷达图数据
    queryAssetRadarData: query => api.post('/groovynoauth/fsp/cust/custdetail/assetDistribution', query),
    // 查询新版客户360详情下的账户信息Tab下的资产分布-某个雷达指标的数据
    querySpecificIndexData: query => api.post('/groovynoauth/fsp/cust/custdetail/queryAssetIndexData', query),
    // 查询新版客户360详情下的账户信息Tab下的资产分布-负债详情数据
    queryDebtDetail: query => api.post('/groovynoauth/fsp/cust/account/queryDebtDetail', query),
    // 查询新版客户360详情下的账户信息Tab下实时持仓-实时资产数据
    queryRealTimeAsset: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustCurrentAssert',query),
    // 查询新版客户360详情下的账户信息Tab下实时持仓-证券实时持仓数据
    querySecuritiesHolding: query => api.post('/groovynoauth/fsp/cust/custdetail/queryStockCurrentPostion',query),
    // 查询新版客户360详情下的账户信息Tab下实时持仓-产品实时持仓数据
    queryStorageOfProduct: query => api.post('/groovynoauth/fsp/cust/custdetail/queryFundCurrentPostion',query),
    // 查询新版客户360详情下的账户信息Tab下对应的收益走势对比数据
    queryProfitRateInfo: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustPofitRateChart', query),
  };
}
