/*
 * @Author: XuWenKang
 * @Description: 精选组合api
 * @Date: 2018-04-17 10:10:25
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-11 11:15:34
*/

export default function choicenessCombination(api) {
  return {
    // 获取调仓历史
    getAdjustWarehouseHistory: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryCombinationAdjust', query),
    // 组合证券构成列表/近一周表现前十的证券、组合构成-表格
    getCombinationSecurityList: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/querySecurityList', query),
    // 获取组合树
    getCombinationTree: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryPortfolioCategoryTree', query),
    // 组合排名列表
    getCombinationRankList: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryComposeList', query),
    // 收益率走势图
    getCombinationChart: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/statisticReturnGraph', query),
    // 历史报告列表
    getReportHistoryList: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryComposeHistoryReport', query),
    // 订购客户列表
    getOrderingCustList: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/querySubscribedCustList', query),
    // 历史报告详情
    getHistoryDetail: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryHistoryReportDetail', query),
    // 详情-头部概览
    getOverview: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryAdjustmentDetail', query),
    // 详情-组合构成-饼图
    getCompositionPie: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryStatsticSecurityList', query),
    // 订购客户列表
    queryHoldRepeatProportion: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryHoldRepeatProportion', query),
    // 查询投资顾问列表
    queryCombinationCreator: query => api.post('/groovynoauth/fsp/product/portfolioInfoProd/queryCombinationCreator', query),
  };
}
