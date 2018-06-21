/*
 * @Author: XuWenKang
 * @Description: 最新观点api
 * @Date: 2018-04-17 10:10:25
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-20 13:23:50
*/

export default function latestView(api) {
  return {
    // 最新观点-首页首席观点
    queryChiefViewpoint: query => api.post('/groovynoauth/fsp/product/queryChiefViewpoint', query),

    // 最新观点-首席观点列表
    queryChiefViewpointList: query => api.post('/groovynoauth/fsp/product/queryChiefViewpointList', query),

    // 最新观点-首席观点详情
    queryChiefViewpointDetail: query => api.post('/groovynoauth/fsp/product/queryChiefViewpointDetail', query),

  };
}
