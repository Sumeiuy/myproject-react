/**
 * @Descripter: 用户参数设置菜单配置
 * @Author: K0170179
 * @Date: 2018/4/15
 */

const menu = [
  {
    name: '任务管理',
    path: '/taskOperation',
    children: [
      {
        name: '客户反馈选项',
        path: '/customerFeedback',
      },
      {
        name: '任务问卷调查',
        path: '/taskFeedback',
      },
      {
        name: '投资建议模板',
        path: '/investmentAdvice',
      },
    ],
  },
  {
    name: '用户中心',
    path: '/labelManager',
    children: '个人标签',
  },
];

export default menu;
