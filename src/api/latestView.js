/*
 * @Author: XuWenKang
 * @Description: 最新观点api
 * @Date: 2018-04-17 10:10:25
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-21 13:45:40
*/

export default function latestView(api) {
  return {
    // 最新观点-首页首席观点
    queryChiefViewpoint: query => api.post('/groovynoauth/fsp/info/newest/queryChiefViewTop', query),

    // 最新观点-首席观点列表
    queryChiefViewpointList: query => api.post('/groovynoauth/fsp/info/newest/queryChiefViewList', query),

    // 最新观点-首席观点详情
    queryChiefViewpointDetail: query => api.post('/groovynoauth/fsp/info/newest/queryChiefViewDetail', query),

  };
}
