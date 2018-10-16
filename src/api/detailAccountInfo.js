/*
 * @Author: sunweibin
 * @Date: 2018-10-09 16:55:35
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-12 18:21:04
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
    // 查询新版客户360详情下的账户信息Tab下对应的收益走势对比数据
    queryProfitRateInfo: query => api.post('/groovynoauth/fsp/cust/custdetail/queryCustPofitRateChart', query),
  };
}
