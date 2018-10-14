/*
 * @Author: sunweibin
 * @Date: 2018-10-09 16:55:35
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-10-12 16:29:18
 * @description 新版客户360详情下的账户信息Tab页的API
 */
export default function detailAccountInfo(api) {
  return {
    // 查询新版客户360详情下的账户信息Tab下的资产分布-雷达图数据
    queryAssetRadarData: query => api.post('/groovynoauth/fsp/cust/account/assetDistribution', query),
    // 查询新版客户360详情下的账户信息Tab下的资产分布-某个雷达指标的数据
    querySpecificIndexData: query => api.post('/groovynoauth/fsp/cust/account/queryAssetIndexData', query),
    // 查询新版客户360详情下的账户信息Tab下的资产分布-负债详情数据
    queryDebtDetail: query => api.post('/groovynoauth/fsp/cust/account/queryDebtDetail', query),
    // 查询新版客户360详情下的账户信息Tab下实时持仓-实时资产数据
    queryRealTimeAsset: query => api.post('/groovynoauth/fsp/cust/product/CustDistributionDetail',query),
    // 查询新版客户360详情下的账户信息Tab下实时持仓-证券实时持仓数据
    querySecuritiesHolding: query => api.post('/groovynoauth/fsp/cust/product/queryCustDetail',query),
    // 查询新版客户360详情下的账户信息Tab下实时持仓-产品实时持仓数据
    queryStorageOfProduct: query => api.post('/groovynoauth/fsp/cust/product/queryDetail',query),
  };
}
