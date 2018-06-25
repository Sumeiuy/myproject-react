/*
 * @Author: XuWenKang
 * @Description: 最新观点api
 * @Date: 2018-04-17 10:10:25
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-22 15:01:36
*/

export default function latestView(api) {
  return {
    // 最新观点-首页首席观点
    queryChiefViewpoint: query => api.post('/groovynoauth/fsp/info/newest/queryChiefViewTop', query),

    // 最新观点-首席观点列表
    queryChiefViewpointList: query => api.post('/groovynoauth/fsp/info/newest/queryChiefViewList', query),

    // 最新观点-首席观点详情
    queryChiefViewpointDetail: query => api.post('/groovynoauth/fsp/info/newest/queryChiefViewDetail', query),

    // 最新观点-首页紫金时钟最当前周期
    queryZiJinClockCycle: query => api.post('/groovynoauth/fsp/product/queryCycle', query),

    // 最新观点-首页紫金时钟列表
    queryZiJinViewpointList: query => api.post('/groovynoauth/fsp/product/queryZiJinViewpointList', query),
  };
}
