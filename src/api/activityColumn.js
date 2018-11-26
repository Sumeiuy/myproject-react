/*
 * @Author: zhangjun
 * @Descripter: 平台参数设置-首页内容-活动栏目
 * @Date: 2018-11-05 17:12:18
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-06 14:13:49
 */

export default function activityColumn(api) {
  return {
    // 活动栏目提交
    submitContent: query => api.post('/groovynoauth/fsp/activityColumn/saveContent', query),
  };
}
