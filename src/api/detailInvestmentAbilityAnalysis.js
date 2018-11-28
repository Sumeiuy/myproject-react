/*
 * @Author: zhangjun
 * @Date: 2018-11-20 15:53:09
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-28 10:55:53
 * @Description: 客户360-投资能力分析相关api
 */
export default function detailInvestmentAbilityAnalysis(api) {
  return {
    // 获取客户盈利能力
    queryProfitAbility: query => api.post('/groovynoauth/fsp/cust/custdetail/investment/queryProfitAbility', query),
    // 获取投资账户特征
    queryInvestmentFeatureLabels: query => api.post('/groovynoauth/fsp/cust/custdetail/investment/queryInvestmentFeatureLabels', query),
    // 获取账户资产变动
    queryAssetChangeState: query => api.post('/groovynoauth/fsp/cust/custdetail/investment/queryAssetChangeState', query),
    // 获取账户资产变动图表
    queryAssetChangeReport: query => api.post('/groovynoauth/fsp/cust/custdetail/investment/queryAssetChangeReport', query),
    // 获取账户收益走势图表数据
    queryProfitTrendReport: query => api.post('/groovynoauth/fsp/cust/custdetail/investment/queryProfitTrendReport', query),
    // 获取brinson归因分析
    queryAttributionAnalysis: query => api.post('/groovynoauth/fsp/cust/custdetail/investment/queryAttributionAnalysis', query),
  };
};
