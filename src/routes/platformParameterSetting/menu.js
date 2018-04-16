/**
 * @Descripter: 用户参数设置菜单配置
 * @Author: K0170179
 * @Date: 2018/4/15
 */

const menu = [
  {
    name: '用户中心',
    path: '/labelManager',
    children: '个人标签',
  },
  {
    name: '任务运维',
    path: '/taskOperation',
    children: [
      {
        name: '任务反馈',
        path: '/taskFeedback',
      },
      {
        name: '客户反馈',
        path: '/customerFeedback',
      },
    ],
  },
];

export default menu;
