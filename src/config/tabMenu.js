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
