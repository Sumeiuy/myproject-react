const NEW_VERSION_TITLE = '新版“淘客”上线';
const NEW_VERSION_DESCRIBE = '支持更加丰富的自定义标签筛选客户，客户列表支持切换排序指标';
const TASK_TITLE = '批量处理客户名下所有任务';
const TASK_DESCRIBE = '任务执行视图可以查看客户名下的所有待办任务，添加服务记录支持同步到客户名下的所有任务';
const FEEDBACK_TITLE = '“我的反馈”全面放开';
const FEEDBACK_DESCRIBE = '您提交的反馈和问题都可以在“我的反馈”查看，包括理财服务平台工作人员对您的答复也可以翻阅。';

// 新功能推荐列表
export const RECOMMEND_LIST = [{
  key: 0,
  type: 'shangxian',
  title: NEW_VERSION_TITLE,
  describe: NEW_VERSION_DESCRIBE,
}, {
  key: 1,
  type: 'piliangfenxiang',
  title: TASK_TITLE,
  describe: TASK_DESCRIBE,
}, {
  key: 2,
  type: 'wodefankui1',
  title: FEEDBACK_TITLE,
  describe: FEEDBACK_DESCRIBE,
}];
// 点击了解更多跳转到的页面URL
export const FUNCTION_INTRODUCTION_PAGE = '/fspa/spy/functionIntroduction/html/functionIntroductionV3.1.180802.html';

// 存储在本地判断是否是首次进入,首次进入为空，非首次进入为NO
export const FIRST_ENTER_HOMEPAGE = 'FIRST_ENTER_HOMEPAGE';
