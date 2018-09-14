/**
 * @Description: 丰富首页内容 接口文件
 * @Author: Liujianshu
 * @Date: 2018-09-12 15:38:06
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-09-13 17:14:51
 */
export default function newHome(api) {
  return {
    // 重点关注
    queryKeyAttention: query => api.post('/groovynoauth/fsp/index/queryKeyAttention', query),
    // 猜你感兴趣
    queryGuessYourInterests: query => api.post('/groovynoauth/fsp/index/queryGuessYourInterests', query),
    // 产品日历
    queryProductCalendar: query => api.post('/groovynoauth/fsp/index/queryProdCalendar', query),
    // 获取组合推荐
    queryIntroCombination: query => api.post('/groovynoauth/fsp/index/queryIntroCombination', query),
    // 首席观点
    queryChiefView: query => api.post('/groovynoauth/fsp/info/infoCenter/queryInfo', query),
  };
}
