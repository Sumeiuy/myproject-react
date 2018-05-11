/*
 * @Author: XuWenKang
 * @Description: 精选组合api
 * @Date: 2018-04-17 10:10:25
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-10 16:33:15
*/

export default function choicenessCombination(api) {
  return {
    // 获取调仓历史
    getAdjustWarehouseHistory: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryCombinationAdjust', query),
    // 组合证券构成列表/近一周表现前十的证券
    getCombinationSecurityList: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/querySecurityList', query),
    // 获取组合树
    getCombinationTree: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryPortfolioCategoryTree', query),
    // 组合排名列表
    getCombinationRankList: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryComposeList', query),
    // 收益率走势图
    getCombinationChart: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/statisticReturnGraph', query),
    // 历史报告列表
    getReportHistoryList: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/reportHistoryList', query),
    // 订购客户列表
    getOrderingCustList: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/orderingCustomerList', query),
    // 历史报告详情
    getHistoryDetail: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/historyDetail', query),
    // 详情-头部概览
    getOverview: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/combinationDetailOverview', query),
    // 详情-组合构成-饼图
    getCompositionPie: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/composingPie', query),
    // 详情-组合构成-表格
    getCompositionTable: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/composing', query),
  };
}
