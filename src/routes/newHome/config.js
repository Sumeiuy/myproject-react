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

export {
  DATE_FORMAT_STRING,
  MONTH_DATE_FORMAT,
  navArray,
};
