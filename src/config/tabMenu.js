/**
 * @file config/tabMenu.js
 *  tab导航菜单配置
 * @author zhufeiyang
 */

import _ from 'lodash';

// 前端可以完全控制主导航的菜单行为
const newOpenTabConfig = [
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
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: 'MOT任务',
    id: 'FSP_MOT_TASK',
    path: '/fsp/motTask',
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: 'MOT服务统计明细',
    id: 'FSP_MOT_STATISTICS_DETAIL',
    path: '/fsp/MOTStatisticsDetail',
    pid: 'FSP_MOT_M_SERVICE_STATISTICS_PRIMARY',
  },
  {
    name: 'MOT任务处理',
    id: 'FSP_MOT_TASKHANDLE',
    path: '/fsp/motTaskHandle',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: 'MOT任务处理',
    id: 'FSP_MOT_TASKHANDLE',
    path: '/fsp/motTaskHandle',
    pid: 'FSP_CUST_M_360',
  },
/*   {
    name: '客户360',
    id: 'FSP_CUST_M_360',
    path: '/fsp/customerCenter/customer360',
    pid: 'FSP_CUST_M_CENTER_MANAGE',
  }, */
  {
    name: '投顾签约向导',
    id: 'utb-stockcontract-wizard',
    path: '/fsp/contractWizard',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '新增签约向导',
    id: 'FSP_CONTRACTLIST_OPERATE_TAB',
    path: '/fsp/customerCenter/contractSelectOperate',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '投顾签约变更向导',
    id: 'FSP_360VIEW_OPERATE_TAB',
    path: '/fsp/customerCenter/360OperateType',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '投顾签约续签向导',
    id: 'utb-stockcontractrenew-wizard',
    path: '/fsp/customerCenter/stockContractRenew',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '投顾签约转签向导',
    id: 'utb-stockcontracttransfer-wizard',
    path: '/fsp/customerCenter/tgcontracttransfer',
    pid: 'FSP_MESSAGE_CENTER',
  },
  {
    name: '投顾签约计划变更向导',
    id: 'utb-stockcontractupd-wizard',
    path: '/fsp/customerCenter/360Wizard',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '投顾协议退订向导',
    id: 'utb-stockcontracttmnte-wizard',
    path: '/fsp/customerCenter/tgcontracttmnte',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '佣金调整向导',
    id: 'utb-serviceOrdering-wizard',
    path: '/fsp/serviceOrderingWizard',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '签约流程详细视图信息',
    id: 'FSP_CUST_M_ORDERDETAIL',
    path: '/fsp/customerCenter/360OrderDetail',
    pid: 'FSP_CUST_M_360',
  },
  {
    name: '投顾签约历史记录',
    id: 'FSP_360VIEW_AGREEHIS_TAB',
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
    name: '工单投诉信息',
    id: 'FSP_COMPLAINT_INFO',
    path: '/fsp/custcomplaint/complaintInfo',
    pid: 'FSP_SYS_OPERATE_PRIMARY',
  },
  {
    name: '新增投诉工单',
    id: 'FSP_ST_TAB_CUSTCOMP_ADD',
    path: '/fsp/custcomplaint/toAddPageInfo',
    pid: 'FSP_SYS_OPERATE_PRIMARY',
  },
  {
    name: '资产配置明细',
    id: 'FSP_IMPLEMENTATION_INITSEE',
    path: '/fsp/implementation/initsee',
    pid: 'asset_implementation_tab',
  },
  {
    name: '每日晨报',
    id: 'FSP_BROADCAST_LIST',
    path: '/strategyCenter/broadcastList',
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: '晨报详情',
    id: 'FSP_BROADCAST_LIST',
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
  {
    name: '用户中心',
    id: 'FSP_USERCENTER',
    path: '/userCenter',
    pid: 'SP_USERCENTER',
  },
  {
    name: '用户信息审批',
    id: 'FSP_USERINFO_APPROVAL',
    path: '/userCenter/userInfoApproval',
    pid: 'FSP_USERINFO_APPROVAL',
  },
  {
    name: '反馈管理',
    id: 'FSP_FEEDBACK_MANAGEMENT',
    path: '/feedback',
    pid: 'FSP_FEEDBACK_MANAGEMENT',
  },
  {
    name: '我的反馈',
    id: 'FSP_MYFEEDBACK',
    path: '/myFeedback',
    pid: 'FSP_MYFEEDBACK',
  },
  {
    name: '佣金调整',
    id: 'FSP_COMMISSION_ADJUSTMENT',
    path: '/commissionAdjustment',
    pid: 'FSP_COMMISSION_ADJUSTMENT',
  },
  {
    name: '客户分组',
    id: 'FSP_CUSTOMERGROUP',
    path: '/customerPool/customerGroup',
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: '我的客户分组',
    id: 'FSP_CUSTOMERGROUP_MANAGE',
    path: '/customerPool/customerGroupManage',
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: '创建任务',
    id: 'FSP_CREATETASK_FROMCUSTGROUP',
    path: '/customerPool/createTaskFromCustGroup',
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: '创建任务',
    id: 'FSP_CREATETASK_FROMPROGRESS',
    path: '/customerPool/createTaskFromProgress',
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: '创建任务',
    id: 'FSP_CREATETASK_FROMPIE',
    path: '/customerPool/createTaskFromPie',
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: '创建任务',
    id: 'FSP_CREATETASK_FROMREJECTION1',
    path: '/customerPool/createTaskFromTaskRejection1',
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: '创建任务',
    id: 'FSP_CREATETASK_FROMREJECTION2',
    path: '/customerPool/createTaskFromTaskRejection2',
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: '创建任务',
    id: 'FSP_CREATETASK_FROMCUSTSCOPE',
    path: '/customerPool/createTaskFromCustScope',
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: '创建任务',
    id: 'FSP_CREATETASK_FROMLABELMANAGEMENT',
    path: '/customerPool/createTaskFromLabelManagement',
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: '创建任务',
    id: 'FSP_CREATETASK',
    path: '/customerPool/createTask',
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: '服务纪录',
    id: 'FSP_SERVICELOG',
    path: '/customerPool/serviceLog',
    pid: 'FSP_NEW_HOMEPAGE_PRIMARY',
  },
  {
    name: '客户降级',
    id: 'FSP_DEMOTE',
    path: '/demote',
    pid: 'FSP_DEMOTE',
  },
  {
    name: '用户信息审核',
    id: 'FSP_USERINFO_REMIND',
    path: '/userInfoRemind',
    pid: 'FSP_USERINFO_REMIND',
  },
  {
    name: '消息中心',
    id: 'FSP_MESSAGE_CENTER',
    path: '/messageCenter',
    pid: 'FSP_MESSAGE_CENTER',
  },
  {
    name: '客户反馈',
    id: 'FSP_CUSTOMER_FEEDBACK',
    path: '/customerFeedback',
    pid: 'FSP_CUSTOMER_FEEDBACK',
  },
  {
    name: '任务反馈',
    id: 'FSP_TASK_FEEDBACK',
    path: '/taskFeedback',
    pid: 'FSP_TASK_FEEDBACK',
  },
  {
    name: '投顾竞赛',
    id: 'FSP_INVESTMENT_CONSULTANTRACE',
    path: '/investmentConsultantRace',
    pid: 'FSP_INVESTMENT_CONSULTANTRACE',
  },
  {
    name: '最新观点',
    id: 'FSP_LATEST_VIEW',
    path: '/latestView',
    pid: 'FSP_LATEST_VIEW',
  },
  {
    name: '超额快取信息',
    id: 'FSP_BIZAPPLY_EXCESSCACHE_EDIT',
    path: '/fsp/bizapply/excesscacheView',
    pid: '',
  },
  {
    name: '预约取款申请',
    id: 'appoint_queryAppointDraw_tab',
    path: '/fsp/bizapply/queryAppointDraw',
    pid: '',
  },
  {
    name: '新增股票期权评估申请',
    id: 'FSP_ST_TAB_APY_STOCKINVEST_ADD',
    path: '/fsp/stockinvest/toAddPageInfo',
    pid: '',
  },
  {
    name: '查看股票期权评估申请',
    id: 'FSP_BIZAPPLY_VIEWCUSTCOMPLAINTINFO',
    path: '/fsp/stockinvest/viewCustComplaintInfo',
    pid: '',
  },
  {
    name: '期权佣金申请明细',
    id: 'optionfund_applyInfo_tab',
    path: '/fsp/optionfund/showApplyInfoTab',
    pid: '',
  },
  {
    name: '查看双录文件审核',
    id: 'FSP_VFSH_SHOWMAININFOTAB',
    path: '/fsp/vfsh/showMainInfoTab',
    pid: '',
  },
  {
    name: '双录视频向导',
    id: 'utb-dbvfsh-wizard',
    path: '/fsp/dbvfsh/wizard',
    pid: '',
  },
  {
    name: '私募产品信息',
    id: 'FSP_PRIPROD_SHOWPRIPRODTASK',
    path: '/fsp/priProd/showPriProdTask',
    pid: '',
  },
  {
    name: '私募产品信息编辑',
    id: 'add_btn_priprod',
    path: '/fsp/priProd/showPriProdTaskManage',
    pid: '',
  },
  {
    name: 'PB业务申请详情',
    id: 'FSP_PBBIZ_DETAIL',
    path: '/fsp/pbbiz/detail',
    pid: '',
  },
  {
    name: 'PB业务申请编辑',
    id: 'FSP_PB_BIZ_MANAGE_EDIT',
    path: '/fsp/pbbiz/edit',
    pid: '',
  },
  {
    name: '产品适当性售前查询',
    id: 'FSP_PRE_SALEQUERY',
    path: '/preSaleQuery',
    pid: '',
  },
  {
    name: '公务手机号码编辑',
    id: 'FSP_PHONE_EDIT',
    path: '/sysOperate/telephoneNumberManageEdit',
    pid: '',
  },
  {
    name: '专项业务知识',
    id: 'FSP_KNOWLEDGE',
    path: '/fsp/knowledge',
    pid: '',
  },
  {
    name: '业务知识信息',
    id: 'FSP_KNOWLEDGE_DETAIL',
    path: '/fsp/showKnowledgeDetail',
    pid: '',
  },
  {
    name: '新建或编辑专项业务知识',
    id: 'edit_btn_showEditKnowledge',
    path: '/fsp/knowledgeEdit',
    pid: '',
  },
];

// 默认当前激活的主导航菜单项
const indexPaneKey = 'FSP_NEW_HOMEPAGE_PRIMARY';

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

// 暂时不需要共用的面包屑的路由
const tabNotUseGlobalBreadcrumb = [
  '/customerPool/list/detail',
  '/customerPool/createTaskFromTaskRejection2',
  '/taskCenter/taskList',
  '/statisticalQuery/report',
  '/sysOperate/platformParameterSetting',
  '/sysOperate/telephoneNumberManage',
  '/statisticalQuery/taskTable/taskAnalysisReport',
];

// 不在菜单中需要使用面包屑的路由
const locationNeedBreadcrumb = [
 {
    name: '资讯列表',
    path: '/strategyCenter/latestView/viewpointList',
    parent: {
      name: '最新观点',
      path: '/strategyCenter/latestView',
      type: 'link',
    }
  },
  {
    name: '资讯详情',
    path: '/strategyCenter/latestView/viewpointDetail',
    parent: {
      name: '资讯列表',
      path: '/strategyCenter/latestView/viewpointList',
      type: 'link',
      parent: {
        name: '最新观点',
        path: '/strategyCenter/latestView',
        type: 'link',
      }
    }
  },
  {
    name: '大类资产配置分析列表',
    path: '/strategyCenter/latestView/majorAssetsList',
    parent: {
      name: '最新观点',
      path: '/strategyCenter/latestView',
      type: 'link',
    }
  },
  {
    name: '行业主题调整信息列表',
    path: '/strategyCenter/latestView/industryThemeList',
    parent: {
      name: '最新观点',
      path: '/strategyCenter/latestView',
      type: 'link',
    }
  },
  {
    name: '个股详情',
    path: '/strategyCenter/stock/detail',
    parent: {
      name: '个股资讯',
      path: '/strategyCenter/stock',
      type: 'link',
    }
  },
  {
    name: '组合详情',
    path: '/strategyCenter/choicenessCombination/combinationDetail',
    parent: {
      name: '精选组合',
      path: '/strategyCenter/choicenessCombination',
      type: 'link',
    }
  },
  {
    name: '历史报告',
    path: '/strategyCenter/choicenessCombination/reportDetail',
    parent: {
      name: '精选组合',
      path: '/strategyCenter/choicenessCombination',
      type: 'link',
    }
  },
  {
    name: '客户360',
    path: '/fsp/customerPool/list/customerDetail',
    parent: {
      name: '客户列表',
      path: '/customerPool/list',
      type: 'link',
    }
  },
];

function findParentBreadcrumb(breadcrumbs, path) {
  if(_.isArray(breadcrumbs)) {
    return _.some(breadcrumbs, item => {
      if(item.parent) {
        return findParentBreadcrumb(item.parent, path);
      }
      return false;
    });
  }
  if(_.isObject(breadcrumbs)) {
    if(breadcrumbs.path === path) {
      return true;
    } else {
      return findParentBreadcrumb(breadcrumbs.parent, path);
    }
  }
  return false;
}

function getAllBreadcrumbItem(breadcrumbItem, breadcrumbRoutes = []) {
  let newBreadcrumbRoutes = breadcrumbRoutes;
  if (breadcrumbItem) {
    newBreadcrumbRoutes = [
      breadcrumbItem,
       ...breadcrumbRoutes,
    ];
    if (breadcrumbItem.parent) {
      return getAllBreadcrumbItem(breadcrumbItem.parent, newBreadcrumbRoutes);
    }
  }
  return newBreadcrumbRoutes;
}

const exported = {
  newOpenTabConfig,
  indexPaneKey,
  defaultMenu,
  tabNotUseGlobalBreadcrumb,
  locationNeedBreadcrumb,
  findParentBreadcrumb,
  getAllBreadcrumbItem,
};

export default exported;
export {
  locationNeedBreadcrumb,
  newOpenTabConfig,
  indexPaneKey,
  defaultMenu,
  tabNotUseGlobalBreadcrumb,
  findParentBreadcrumb,
  getAllBreadcrumbItem,
};
