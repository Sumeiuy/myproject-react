import labelImg from './img/label.png';
import onlineImg from './img/online.png';
import taskImg from './img/task.png';
import feedbackImg from './img/feedback.png';

// 客户列表支持自定义标签管理客户配置项
const CUSTOMER_LIST_LABEL = {
  imgPath: labelImg,
  title: '客户列表支持自定义标签管理客户',
  describe: '支持对特定客户设置自定义标签，以便对客户进行分类管理',
};

// 新版淘客配置项
const NEW_VERSION_TAOKE = {
  imgPath: onlineImg,
  title: '新版“淘客”上线',
  describe: '增加了更丰富灵活客户筛选功能，可以更精确地筛选出目标客户',
};

// 批量处理客户名下所有任务配置项
const BATCH_PROCESS_TASK = {
  imgPath: taskImg,
  title: '同步处理客户所有待办任务',
  describe: '任务执行视图可以查看客户名下的所有待办任务，添加服务记录支持同步到客户名下的所有任务',
};

// “我的反馈”全面放开配置项
const MY_FEEDBACK = {
  imgPath: feedbackImg,
  title: '“我的反馈”全面放开',
  describe: '您提交的反馈和问题都可以在“我的反馈”查看，包括理财服务平台工作人员对您的答复也可以翻阅。',
};

// 新功能推荐列表
export const RECOMMEND_LIST = [
  CUSTOMER_LIST_LABEL,
  NEW_VERSION_TAOKE,
  BATCH_PROCESS_TASK,
  MY_FEEDBACK,
];

// 点击了解更多跳转到的页面URL
export const FUNCTION_INTRODUCTION_PAGE = '/fspa/spy/functionIntroduction/html/functionIntroductionV3.1.180802.html';

// 存储在本地判断是否是首次进入,首次进入为空，非首次进入为NO
export const FIRST_ENTER_HOMEPAGE = 'FIRST_ENTER_HOMEPAGE';
