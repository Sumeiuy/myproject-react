/*
 * @Author: XuWenKang
 * @Description: 最新观点api
 * @Date: 2018-04-17 10:10:25
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-06-25 10:08:54
*/

export default function latestView(api) {
  return {
    // 最新观点-首页首席观点
    queryChiefViewpoint: query => api.post('/groovynoauth/fsp/product/queryChiefViewpoint', query),

    // 最新观点-首席观点列表
    queryChiefViewpointList: query => api.post('/groovynoauth/fsp/product/queryChiefViewpointList', query),

    // 最新观点-首席观点详情
    queryChiefViewpointDetail: query => api.post('/groovynoauth/fsp/product/queryChiefViewpointDetail', query),

    // 大类资产配置分析-首页列表
    queryMajorAssetsIndexList: query => api.post('/groovynoauth/fsp/info/newest/queryAssetAllocationAnalysis', query),
    // 大类资产配置分析-更多列表
    queryMajorAssetsList: query => api.post('/groovynoauth/fsp/info/newest/queryAssetAllocationAnalysisList', query),
    // 大类资产配置分析-详情
    queryMajorAssetsDetail: query => api.post('/groovynoauth/fsp/info/newest/queryAssetAllocationAnalysisDetail', query),
  };
}
