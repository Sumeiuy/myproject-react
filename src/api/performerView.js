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
    // 执行者视图的目标客户的详情
    queryTargetCustDetail: query => api.post('/groovynoauth/fsp/campaign/mot/queryCustDetail', query),
    // 执行视图下添加服务记录
    addMotServeRecord: query => api.post('/groovynoauth/fsp/cust/service/addMotServeRecord', query),
    // 上传文件需要先上传uuid
    queryCustUuid: query => api.post('/groovynoauth/fsp/campaign/mot/queryCustUuid', query),
    // 删除文件
    ceFileDelete: query => api.post('/fspa/mcrm/api/file/ceFileDelete', query),
    // 获取任务简报
    getMissionBrief: query => api.post('/groovynoauth/fsp/campaign/mot/getMissionBrief', query),
    // 预览客户明细
    previewCustDetail: query => api.post('/groovynoauth/fsp/campaign/mot/previewCustDetail', query),
    // 管理者视图查询任务的详细信息
    queryMngrMissionDetailInfo: query => api.post('/groovynoauth/fsp/campaign/mot/queryMngrMissionDetailInfo', query),
    // 管理者视图客户反馈一二级
    countFlowFeedBack: query => api.post('/groovynoauth/fsp/campaign/mot/countFlowFeedBack', query),
  };
}
