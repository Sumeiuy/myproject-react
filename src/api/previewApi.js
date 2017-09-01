import apiCreator from '../utils/apiCreator';

const api = apiCreator();

const previewApi = {

  // 暴露api上的几个底层方法: get / post
  ...api,

  // 查询单个看板的信息
  getOneBoardInfo: query => api.post('/groovynoauth/jxzb/querySingleBoard', query),

};

export default previewApi;
