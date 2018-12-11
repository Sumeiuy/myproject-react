/*
 * @Author: zhangjun
 * @Date: 2018-11-20 15:53:09
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-12-11 10:16:39
 * @Description: 客户360-投资能力分析相关api
 */
export default function detailInvestAnalyze(api) {
  return {
    // 获取客户盈利能力
    queryProfitAbility: query => api.post('/groovynoauth/fsp/cust/accountAnalysis/queryProfitAbility', query),
    // 获取投资账户特征
    queryInvestmentFeatureLabels: query => api.post('/groovynoauth/fsp/cust/accountAnalysis/queryInvestmentFeatureLabels', query),
    // 获取账户资产变动
    queryAssetChangeState: query => api.post('/groovynoauth/fsp/cust/accountAnalysis/queryAssetChangeState', query),
    // 获取账户资产变动图表
    queryAssetChangeReport: query => api.post('/groovynoauth/fsp/cust/accountAnalysis/queryAssetChangeReport', query),
    // 获取账户收益走势图表数据
    queryProfitTrendReport: query => api.post('/groovynoauth/fsp/cust/accountAnalysis/queryProfitTrendReport', query),
    // 获取个股收益明细
    queryEachStockIncomeDetails: query => api.post('/groovynoauth/fsp/cust/accountAnalysis/queryEachStockIncomeDetails', query),
    // 获取brinson归因分析
    queryAttributionAnalysis: query => api.post('/groovynoauth/fsp/cust/accountAnalysis/queryAttributionAnalysis', query),
    // 获取期末资产配置数据
    queryEndTermAssetConfig: query => api.post('/groovynoauth/fsp/cust/accountAnalysis/queryEndTermAssetConfig', query),
    // 获取资产配置变动走势
    queryAssetConfigTrend: query => api.post('/groovynoauth/fsp/cust/accountAnalysis/queryAssetConfigTrendInfo', query),
  };
}
