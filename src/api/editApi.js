import apiCreator from '../utils/apiCreator';

const api = apiCreator();

const feedbackApi = {

  // 暴露api上的几个底层方法: get / post
  ...api,

  // 获取用户创建报表看板时候需要的可见范围
  getVisibleRange: query => api.post('/groovynoauth/jxzb/queryNextLevelOrg', query),

  // 查询指标库数据
  getIndicators: query => api.post('/groovynoauth/jxzb/queryCategoryAndIndicators', query),

  // 查询单个看板的信息
  getOneBoardInfo: query => api.post('/groovynoauth/jxzb/querySingleBoard', query),

  // 更新看板
  updateBoard: query => api.post('/groovynoauth/jxzb/updateBoard', query),

};

export default feedbackApi;
