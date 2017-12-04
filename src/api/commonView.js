/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 15:04:18
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-04 15:04:51
 * 三个视图的公用接口
 */


export default function commonView(api) {
  return {
    // 视图的公共列表接口（创建者、执行者、管理者）
    queryTaskList: query => api.post('/groovynoauth/fsp/campaign/mot/queryMOTMissions', query),
  };
}
