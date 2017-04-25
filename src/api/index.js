import apiCreator from '../utils/apiCreator';

const api = apiCreator();

export default {

  // 暴露api上的几个底层方法: get / post
  ...api,

  // 获取xx列表
  getList: query => api.get('/test/list', query),

  // 获取xx详情
  getDetail: query => api.get('/test/detail', query),

  // 保存xx详情
  saveDetail: query => api.post('/test/saveDetail', query),

   // 获取绩效统计接口
  getPerformance: query => api.get('/invest/performance', query),

  // 获取指标图表数据
  getChartInfo: query => api.get('/invest/chartInfo', query),

  // 获取客户范围
  getCustRange: query => api.get('/invest/custRange', query),
};
