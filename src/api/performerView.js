/**
* 执行者视图模块的接口
*/

export default function performerView(api) {
  return {
    // 视图的公共列表接口（创建者、执行者、管理者）
    queryTaskList: query => api.post('/groovynoauth/fsp/campaign/mot/queryMOTMissions', query),
    // 执行者视图的详情基本信息
    queryTaskDetailBasicInfo: query => api.post('/groovynoauth/fsp/campaign/mot/queryMissionDetailedInfo', query),
    // 执行者视图的目标客户
    queryTargetCust: query => api.post('/groovynoauth/fsp/campaign/mot/queryCustListOfMission', query),
  };
}
