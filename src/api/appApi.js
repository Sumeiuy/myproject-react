import apiCreator from '../utils/apiCreator';

const api = apiCreator();

const appApi = {

  // 暴露api上的几个底层方法: get / post
  ...api,

  // 员工职责与职位
  getEmpInfo: query => api.post('/groovynoauth/fsp/emp/info/queryEmpInfo', query),

};

export default appApi;
