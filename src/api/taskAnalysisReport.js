/*
 * @Author: zhangjun
 * @Description: SMART任务相关运营报表接口
 * @Date: 2018-10-09 16:45:21
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-10-26 10:45:01
 */

import _ from 'lodash';

// 在eventData字段下每条数据增加一个index
function fixEventAnalysis(data) {
  const { resultData, resultData: { eventData, eventReportList } } = data;
  return {
    ...data,
    resultData: {
      ...resultData,
      eventData: _.map(eventData, (item, index) => ({ ...item, eventReportList: eventReportList[index] })),
    }
  };
}

export default function taskAnalysisReport(api) {
  return {
    // 获取任务-客户分析报表数据
    queryTaskCustomerReport: query => api.post('/groovynoauth/fsp/campaign/smart/queryTaskCustomerReport', query),
    // 获取完成服务客户统计数据
    queryCompleteServiceCustReport: query => api.post('/groovynoauth/fsp/campaign/smart/queryCompleteServiceCustReport', query),
    // 获取达标服务客户统计数据
    queryComplianceServiceCustReport: query => api.post('/groovynoauth/fsp/campaign/smart/queryComplianceServiceCustReport', query),
    // 获取服务渠道统计数据
    queryServiceChannelReport: query => api.post('/groovynoauth/fsp/campaign/smart/queryServiceChannelReport', query),
    // 获取事件分析表数据
    queryEventAnalysisReport: query => api.post('/groovynoauth/fsp/campaign/smart/queryEventAnalysisReport', query).then(fixEventAnalysis),
    // 事件查询
    queryEventSearch: query => api.post('/groovynoauth/fsp/campaign/smart/queryEventSearch', query),
  };
}
