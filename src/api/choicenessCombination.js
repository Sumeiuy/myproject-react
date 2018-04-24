/*
 * @Author: XuWenKang
 * @Description: 精选组合api
 * @Date: 2018-04-17 10:10:25
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-17 10:17:19
*/

export default function choicenessCombination(api) {
  return {
    // 获取调仓历史
    getAdjustWarehouseHistory: query => api.post('/groovynoauth/fsp/choicenessCombination/adjustWarehouseHistory', query),
    // 获取近一周表现前十的证券
    getWeeklySecurityTopTen: query => api.post('groovynoauth/fsp/choicenessCombination/weeklySecurityTopTen', query),
  };
}
