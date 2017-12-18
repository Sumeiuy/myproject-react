/**
 * 汇报关系界面的接口
 */

export default function relation(api) {
  return {
    // 获取公司层级树信息
    getTreeInfo: query => api.post('/groovynoauth/fsp/relation/treeInfo', query),
    // 获取右侧详情
    getDetailInfo: query => api.post('/groovynoauth/fsp/relation/detail', query),
    // 请求更新详情的负责人
    updateManager: query => api.post('/groovynoauth/fsp/relation/updateManager', query),
    // 获取负责人信息
    getSearchList: query => api.post('/groovynoauth/fsp/relation/searchList', query),
    // 添加团队
    addTeam: query => api.post('/groovynoauth/fsp/relation/addTeam', query),
    // 删除团队
    deleteTeam: query => api.post('/groovynoauth/fsp/relation/deleteTeam', query),
    // 添加成员
    addMember: query => api.post('/groovynoauth/fsp/relation/addMember', query),
    // 删除成员
    deleteMember: query => api.post('/groovynoauth/fsp/relation/deleteMember', query),
  };
}
