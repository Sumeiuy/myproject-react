/**
 * @file config/tabMenu.js
 *  tab导航菜单配置
 * @author zhufeiyang
 */

// 前端可以完全控制主导航的菜单行为
const newOpenTabConfig = [
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
    name: '待办流程',
    id: 'FSP_TODO',
    path: '/customerPool/todo',
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
    name: 'MOT任务处理',
    id: 'FSP_MOT_TASKHANDLE',
    path: '/fsp/motTaskHandle',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '客户360',
    id: 'FSP_CUST_M_360',
    path: '/fsp/customerCenter/customer360',
    pid: 'FSP_CUST_M_CENTER_MANAGE',
  },
  {
    name: '投顾签约向导',
    id: 'FSP_CUST_M_CONTRACTWIZARD',
    path: '/fsp/contractWizard',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '佣金调整向导',
    id: 'FSP_CUST_M_SERVICEORDERINGWIZARD',
    path: '/fsp/serviceOrderingWizard',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '合约详情',
    id: 'FSP_CUST_M_ORDERDETAIL',
    path: '/fsp/customerCenter/360OrderDetail',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '合约历史记录',
    id: 'FSP_CUST_M_ORDERHISDETAIL',
    path: '/fsp/customerCenter/360orderHisDetail',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '佣金查询',
    id: 'FSP_CUST_M_TOCOMMISSION',
    path: '/fsp/customerCenter/toCommission',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '客户服务全纪录',
    id: 'FSP_MOT_TAB_SERVICELIST',
    path: '/fsp/taskCenter/serviceManage',
    pid: 'FSP_MOT_M_TASK',
  },
  {
    name: '工单投诉信息',
    id: 'FSP_COMPLAINT_INFO',
    path: '/fsp/serviceCenter/complaintInfo',
    pid: 'FSP_SERVICE_CENTER',
  },
  {
    name: '资产配置明细',
    id: 'FSP_IMPLEMENTATION_INITSEE',
    path: '/fsp/implementation/initsee',
    pid: 'FSP_SERVICE_CENTER',
  },
  {
    name: '资产配置向导',
    id: 'FSP_IMPLEMENTATION_WIZARD',
    path: '/fsp/implementation/wizard',
    pid: 'FSP_SERVICE_CENTER',
  },
  {
    name: '个股详情',
    id: 'FSP_STOCK_DETAIL',
    path: '/stock/detail',
    pid: 'FSP_STRATEGY_CENTER',
  },
  {
    name: '组合详情',
    id: 'FSP_COMBINATION_DETAIL',
    path: '/choicenessCombination/combinationDetail',
    pid: 'FSP_STRATEGY_CENTER',
  },
  {
    name: '历史报告',
    id: 'FSP_REPORT_DETAIL',
    path: '/choicenessCombination/reportDetail',
    pid: 'FSP_STRATEGY_CENTER',
  },
  {
    name: '晨报详情',
    id: 'FSP_BROADCAST_DETAIL',
    path: '/broadcastDetail',
    pid: 'FSP_STRATEGY_CENTER',
  },
  {
    name: '看板管理',
    id: 'FSP_BOARDMANAGE',
    path: '/boardManage',
    pid: 'FSP_STATISTICAL_QUERY',
  },
  {
    name: '看板编辑',
    id: 'FSP_BOARDEDIT',
    path: '/boardEdit',
    pid: 'FSP_STATISTICAL_QUERY',
  },
  {
    name: '看板预览',
    id: 'FSP_PREVIEW',
    path: '/preview',
    pid: 'FSP_STATISTICAL_QUERY',
  },
];

// 默认当前激活的主导航菜单项
const indexPaneKey = 'FSP_NEW_HOMEPAGE';

// 主导航里面的嵌套导航菜单
const defaultMenu = [
  {
    path: '/customerPool',
    name: '客户中心',
  },
  {
    path: '/taskCenter',
    name: '任务中心',
  },
  {
    path: '/productCenter',
    name: '产品中心',
  },
  {
    path: '/serviceCenter',
    name: '服务中心',
  },
  {
    path: '/strategyCenter',
    name: '策略中心',
  },
  {
    path: '/businessApplyment',
    name: '业务申请',
  },
  {
    path: '/statisticalQuery',
    name: '统计查询',
  },
  {
    path: '/sysOperate',
    name: '运维管理',
  },
];

export default {
  newOpenTabConfig,
  indexPaneKey,
  defaultMenu,
};

