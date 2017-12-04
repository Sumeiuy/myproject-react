/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 15:05:55
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-04 15:07:18
 * 管理者视图接口
 */

export default function managerView(api) {
  return {
    // 获取任务简报
    getMissionBrief: query => api.post('/groovynoauth/fsp/campaign/mot/getMissionBrief', query),
  };
}
