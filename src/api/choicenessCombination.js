/*
 * @Author: XuWenKang
 * @Description: 精选组合api
 * @Date: 2018-04-17 10:10:25
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-24 16:05:44
*/

export default function choicenessCombination(api) {
  return {
    // 获取调仓历史
    getAdjustWarehouseHistory: query => api.post('/groovynoauth/fsp/choicenessCombination/queryCombinationAdjust', query),
    // 组合证券构成列表/近一周表现前十的证券
    getCombinationSecurityList: query => api.post('/groovynoauth/fsp/choicenessCombination/querySecurityList', query),
    // 获取组合树
    getCombinationTree: query => api.post('/groovynoauth/fsp/choicenessCombination/queryPortfolioCategoryTree', query),
    // 组合排名列表
    getCombinationRankList: query => api.post('/groovynoauth/fsp/choicenessCombination/queryComposeList', query),
    // 收益率走势图
    getCombinationChart: query => api.post('/groovynoauth/fsp/choicenessCombination/statisticReturnGraph', query),
    // 历史报告列表
    getReportHistoryList: query => api.post('/groovynoauth/fsp/choicenessCombination/reportHistoryList', query),
  };
}
