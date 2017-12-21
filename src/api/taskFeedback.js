/**
 * 任务反馈模块的接口
 */

export default function taskFeedback(api) {
  return {
    // 获取问题列表
    queryQuestions: query => api.post('/groovynoauth/fsp/assess/common/queryQuesFromPoolByType', query),
  };
};
