/**
 * @file config/tabMenu.js
 *  tab导航菜单配置
 * @author zhufeiyang
 */

// 主导航菜单页面以及其跳转页面对应的tab配置项
// 主导航菜单项不会新打开tab，所以主导航相关的页面全部在这里配置
// 前端可以完全控制主导航的菜单行为
const primaryMenu = [
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
    name: '客户中心',
    id: 'FSP_CUST_M_CENTER',
    path: '/customerCenter',
    pid: 'ROOT',
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
    name: '任务中心',
    id: 'FSP_MOT_M_TASK',
    path: '/taskList',
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
    name: '策略中心',
    id: 'FSP_STRATEGY_CENTER',
    path: '/strategyCenter',
    pid: 'ROOT',
  },
  {
    name: '晨报详情',
    id: 'FSP_BROADCAST_DETAIL',
    path: '/broadcastDetail',
    pid: 'FSP_STRATEGY_CENTER',
  },
  {
    name: '业务申请',
    id: 'FSP_BUSINESS_APPLICATION',
    path: '/application',
    pid: 'Root',
  },
  {
    name: '统计查询',
    id: 'FSP_STATISTICAL_QUERY',
    path: '/statisticalQuery',
    pid: 'ROOT',
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
  // 对于二级和三级菜单，合理的逻辑是根据路由的层次判断并展示其属于的主菜单
  // 在路由未完全修改完毕的时候，可以采用配置临时指定高亮的菜单，用以过渡
  {
    name: '服务订阅-temp',
    id: 'FSP_BUSINESS_APPLICATION',
    path: '/commission',
    pid: 'FSP_BUSINESS_APPLICATION',
  },
  {
    name: '个股资讯-temp',
    id: 'FSP_STRATEGY_CENTER',
    path: '/stock',
    pid: 'FSP_STRATEGY_CENTER',
  },
  {
    name: '精选组合-temp',
    id: 'FSP_STRATEGY_CENTER',
    path: '/choicenessCombination',
    pid: 'FSP_STRATEGY_CENTER',
  },
];

// 次级导航页面内部跳转新建的tab配置项
// 由于次级导航菜单涉及到的打开tab太多，而且不会随着项目变化而改变
// 所以不在这里进行配置，而是直接复用后端的数据，在调用方法时，直接传入数据
// 前端无法控制次级导航菜单的tab配置，这点需要留意。
const secondaryMenu = [
];

const menus = [
  ...primaryMenu,
  ...secondaryMenu,
];

export default menus;

// 默认当前激活的主导航菜单项
export const indexPaneKey = 'FSP_NEW_HOMEPAGE';

// 主导航默认的几个菜单项
export const defaultMenu = [
  'FSP_NEW_HOMEPAGE',
  'FSP_CUST_M_CENTER',
  'FSP_MOT_M_TASK',
  'FSP_PRD_REPOSITORY',
  'FSP_SERVICE_CENTER',
  'FSP_STRATEGY_CENTER',
  'FSP_BUSINESS_APPLICATION',
  'FSP_STATISTICAL_QUERY',
  'FSP_OM_MANAGEMENT',
];

