/**
 * @file config/tabMenu.js
 *  tab导航菜单配置
 * @author zhufeiyang
 */

import _ from 'lodash';

const menus = [
  {
    name: '首页',
    id: 'FSP_NEW_HOMEPAGE',
    path: '/customerPool',
    pid: 'ROOT',
  },
  {
    name: '自建任务',
    id: 'FSP_CUSTOMER_LIST_CREATETASK',
    path: '/customerPool/createTask',
    pid: 'FSP_CUSTOMER_LIST',
  },
  {
    name: '自建任务',
    id: 'FSP_CUSTOMER_GROUPMANAGE_CREATETASK',
    path: '/customerCenter/customerGroupManage/createTask',
    pid: 'FSP_CUST_GROUP_MANAGE',
  },
  {
    name: '自建任务',
    id: 'FSP_CUSTOMER_TASKFLOW',
    path: '/customerPool/taskFlow',
    pid: 'FSP_MOT_SELFBUILT_TASK',
  },
  {
    name: '发起任务',
    id: 'FSP_SELFBUILDTASK_CREATETASK',
    path: '/taskCenter/selfbuildTask/createTask',
    pid: 'FSP_MOT_SELFBUILT_TASK',
  },
  {
    name: '客户列表',
    id: 'FSP_CUSTOMER_LIST',
    path: '/customerPool/list',
    pid: 'FSP_NEW_HOMEPAGE',
  },
  {
    name: '待办流程',
    id: 'FSP_TODO',
    path: '/customerPool/todo',
    pid: 'FSP_NEW_HOMEPAGE',
  },
  {
    name: '资讯列表',
    id: 'FSP_VIEWPOINT',
    path: '/customerPool/viewpoint',
    pid: 'FSP_NEW_HOMEPAGE',
  },
  {
    name: '消息提醒',
    id: 'FSP_MESSAGE',
    path: '/fsp/messageCenter',
    pid: 'FSP_NEW_HOMEPAGE',
  },
  {
    name: 'MOT任务',
    id: 'FSP_MOT_TASK',
    path: '/fsp/motTask',
    pid: 'FSP_NEW_HOMEPAGE',
  },
  {
    name: '客户中心',
    id: 'FSP_CUST_M_CENTER',
    path: '/customerCenter',
    pid: 'ROOT',
  },
  {
    name: '任务中心',
    id: 'FSP_MOT_M_TASK',
    path: '/taskCenter',
    pid: 'ROOT',
  },
  {
    name: '产品中心',
    id: 'FSP_PRD_REPOSITORY',
    path: '/productCenter',
    pid: 'ROOT',
  },
  {
    name: '服务中心',
    id: 'FSP_SERVICE_CENTER',
    path: '/serviceCenter',
    pid: 'ROOT',
  },
  {
    name: '策略中心',
    id: 'FSP_STRATEGY_CENTER',
    path: '/strategyCenter',
    pid: 'ROOT',
  },
];

export default menus;

export const indexPaneKey = 'FSP_NEW_HOMEPAGE';

export const getDefaultMenu = () => _.find(menus, item => !!item.default);

export const getDefaultMenus = () => _.filter(menus, item => !!item.default);
