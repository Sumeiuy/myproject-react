/*
 * @Author: zhangjun
 * @Date: 2018-11-20 15:53:09
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-20 21:04:35
 * @Description: 客户360-投资能力分析相关api
 */
export default function detailInvestmentAbilityAnalysis(api) {
  return {
    // 获取客户盈利能力
    queryProfitAbility: query => api.post('/groovynoauth/fsp/cust/custdetail/investment/queryProfitAbility', query),
    // 获取投资账户特征
    queryInvestmentFeatureLabels: query => api.post('/groovynoauth/fsp/cust/custdetail/investment/queryInvestmentFeatureLabels', query),
  };
};
