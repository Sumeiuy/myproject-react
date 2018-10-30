/**
 * @Description: 丰富首页内容的配置文件
 * @Author: Liujianshu
 * @Date: 2018-09-12 16:05:00
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-09-20 17:37:13
 */
const DATE_FORMAT_STRING = 'YYYY-MM-DD';
const MONTH_DATE_FORMAT = 'M月D日';
const navArray = [
  {
    key: 'todayToDoNumbers',
    name: '待处理任务',
    url: '/taskCenter/taskList',
    id: 'FSP_MOT_SELFBUILT_TASK',
    title: '任务管理',
  },
  {
    key: 'businessNumbers',
    name: '潜在目标客户',
    url: '/customerPool/list',
    id: 'RCT_FSP_CUSTOMER_LIST',
    title: '客户列表',
  },
  {
    key: 'workFlowNumbers',
    name: '待办流程',
    url: '/customerPool/todo',
    id: 'FSP_TODOLIST',
    title: '待办流程列表',
  },
  {
    key: 'notificationNumbers',
    name: '消息提醒',
    url: '/messageCenter',
    id: 'MESSAGE_CENTER',
    title: '消息中心',
  },
];

// 首页执行者视图首次引导提示第一步的dom的id名称(搜索栏)
const NEW_HOME_INTRO_FIRST_SEEP_IDNAME = 'homePageIntroFirstStep';

// 首页执行者视图首次引导提示第二步的dom的id名称(主导航) tabMenu 元素自带ID

// 首页执行者视图首次引导提示第三步的dom的id名称(重点关注)
const NEW_HOME_INTRO_THIRD_SEEP_IDNAME = 'homePageIntroThirdStep';

// 首页执行者视图首次引导提示第四步的dom的id名称(猜你感兴趣)
const NEW_HOME_INTRO_FOURTH_SEEP_IDNAME = 'homePageIntroFourthStep';

// 首页执行者视图首次引导提示第五步的dom的id名称(客户分析)
const NEW_HOME_INTRO_FIFTH_SEEP_IDNAME = 'homePageIntroFifthStep';

// 首页执行者视图首次引导提示第六步的dom的id名称(产品日历)
const NEW_HOME_INTRO_SIXTH_SEEP_IDNAME = 'homePageIntroSixthStep';

// 首页执行者视图首次引导提示第七步的dom的id名称(组合推荐)
const NEW_HOME_INTRO_SEVENTH_SEEP_IDNAME = 'homePageIntroSeventhStep';

// 首页执行者视图首次引导提示第八步的dom的id名称(活动栏目)
const NEW_HOME_INTRO_EIGHTH_SEEP_IDNAME = 'homePageIntroEighthStep';

// 首页执行者视图首次引导提示第九步的dom的id名称(每日晨报)
const NEW_HOME_INTRO_NINTH_SEEP_IDNAME = 'homePageIntroNinthStep';

// 首页执行者视图首次引导提示第十步的dom的id名称(我要提问)
const NEW_HOME_INTRO_TENTH_SEEP_IDNAME = 'homePageIntroTenthStep';

// 首页执行者视图首次引导提示第十一步的dom的id名称(常用工具)
const NEW_HOME_INTRO_ELEVENTH_SEEP_IDNAME = 'homePageIntroEleventhStep';

// intro引导要判断
const stepIds = {
  homePageIntroFirstStep: { id: '第一个', name: '搜索栏',step:0},
  tabMenu: { id: '第四个', name: '主导航',step:3},
  homePageIntroThirdStep: { id: '第五个', name:'重点关注客户',step:4},
  homePageIntroFourthStep: { id: '第六个', name:'猜你感兴趣' ,step:5},
  homePageIntroFifthStep: { id: '第八个', name:'客户分析' ,step:7},
  homePageIntroSixthStep: { id: '第九个', name: '产品日历',step:8},
  homePageIntroSeventhStep: { id: '第十个', name: '组合推荐',step:9},
  homePageIntroEighthStep: { id: '第七个', name: '活动栏目',step:6},
  homePageIntroNinthStep: { id: '第十一个', name: '每日晨报',step:10},
  homePageIntroTenthStep: { id: '第二个', name: '我要提问',step:1},
  homePageIntroEleventhStep: { id: '第三个', name: '常用工具',step:2},
};

export {
  DATE_FORMAT_STRING,
  MONTH_DATE_FORMAT,
  navArray,
  NEW_HOME_INTRO_FIRST_SEEP_IDNAME,
  NEW_HOME_INTRO_THIRD_SEEP_IDNAME,
  NEW_HOME_INTRO_FOURTH_SEEP_IDNAME,
  NEW_HOME_INTRO_FIFTH_SEEP_IDNAME,
  NEW_HOME_INTRO_SIXTH_SEEP_IDNAME,
  NEW_HOME_INTRO_SEVENTH_SEEP_IDNAME,
  NEW_HOME_INTRO_EIGHTH_SEEP_IDNAME,
  NEW_HOME_INTRO_NINTH_SEEP_IDNAME,
  NEW_HOME_INTRO_TENTH_SEEP_IDNAME,
  NEW_HOME_INTRO_ELEVENTH_SEEP_IDNAME,
  stepIds,
};
