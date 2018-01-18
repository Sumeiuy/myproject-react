/**
 * Created By K0170179 on 2018/1/17
 * 每日晨报相关接口
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */

export default function morningBoradcast(api) {
  return {
    // 查询播放列表相关接口
    searchBoradcastList: query => api.post('/morningBoradcast/boradcastList', query),
    searchBoradcastDetail: query => api.post('/morningBoradcast/boradcastDetail', query),
  };
}
