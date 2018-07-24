/**
 * @file config/tabMenu.js
 *  tab导航菜单配置
 * @author zhufeiyang
 */

// 前端可以完全控制主导航的菜单行为
const newOpenTabConfig = [
  {
    name: '资讯列表',
    id: 'FSP_VIEWPOINT_LIST',
    path: '/latestView/viewpointList',
    pid: 'FSP_CUST_M_CENTER',
  },
  {
    name: '资讯详情',
    id: 'FSP_VIEWPOINT_DETAIL',
    path: '/latestView/viewpointDetail',
    pid: 'FSP_NEW_HOMEPAGE',
  },
  {
    name: '客户中心',
    id: 'FSP_CUST_M_CENTER',
    path: '',
    pid: 'ROOT',
  },
  {
    name: '客户列表',
    id: 'FSP_CUST_M_CENTER_LIST',
    path: '/customerPool/list',
    pid: 'FSP_CUST_M_CENTER',
  },
  {
    name: '分组管理',
    id: 'FSP_CUST_M_MANAGER_GROUP',
    path: '/customerPool/customerGroupManager',
    pid: 'FSP_CUST_M_CENTER',
  },
  {
    name: '任务中心',
    id: 'FSP_MOT_M_TASK',
    path: '',
    pid: 'ROOT',
  },
  {
    name: 'SMART任务管理',
    id: 'FSP_MOT_SELFBUILT_TASK',
    path: '/taskList',
    pid: 'FSP_MOT_M_TASK',
  },
  {
    name: '服务记录管理',
    id: 'FSP_MOT_M_SERVICELIST',
    path: '/fsp/taskCenter/serviceManage',
    pid: 'FSP_MOT_M_TASK',
  },
  {
    name: '产品中心',
    id: 'FSP_PRD_REPOSITORY',
    path: '',
    pid: 'ROOT',
  },
  {
    name: '公募基金',
    id: 'FSP_PUBLIC_FUND',
    path: '/fsp/productCenter/publicFund',
    pid: 'FSP_PRD_REPOSITORY',
  },
  {
    name: '收益凭证',
    id: 'FSP_PRD_INCOME',
    path: '/fsp/productCenter/receipt',
    pid: 'FSP_PRD_REPOSITORY',
  },
  {
    name: '紫金产品',
    id: 'FSP_PRD_PURPLE_GOLD',
    path: '/fsp/productCenter/finance',
    pid: 'FSP_PRD_REPOSITORY',
  },
  {
    name: '私募产品',
    id: 'FSP_PRIVATE_PRD',
    path: '/fsp/productCenter/privateFund',
    pid: 'FSP_PRD_REPOSITORY',
  },
  {
    name: '金融产品库',
    id: 'FSP_PRD_FINANCE',
    path: '/fsp/productCenter/financeProducts',
    pid: 'FSP_PRD_REPOSITORY',
  },
  {
    name: '产品日历',
    id: 'FSP_PRD_CALENDAR',
    path: '/fsp/productCenter/salesCalendar',
    pid: 'FSP_PRD_REPOSITORY',
  },
  {
    name: '推荐资产池',
    id: 'FSP_PRD_POOL',
    path: '/fsp/productCenter/productPool',
    pid: 'FSP_PRD_REPOSITORY',
  },
  {
    name: '服务中心',
    id: 'FSP_SERVICE_CENTER',
    path: '',
    pid: 'ROOT',
  },
  {
    name: '资产配置',
    id: 'FSP_ASSET_ALLOCATION',
    path: '',
    pid: 'FSP_SERVICE_CENTER',
  },
  {
    name: '实施',
    id: 'FSP_ASSET_ALLOCATION_IMPLEMENTATION',
    path: '/fsp/serviceCenter/asset/implementation',
    pid: 'FSP_ASSET_ALLOCATION',
  },
  {
    name: '模板',
    id: 'FSP_ASSET_ALLOCATION_BASIS',
    path: '/fsp/serviceCenter/asset/basis',
    pid: 'FSP_ASSET_ALLOCATION',
  },
  {
    name: '投顾签约',
    id: 'FSP_TGINVEST_LIST',
    path: '/fsp/serviceCenter/investContract',
    pid: 'FSP_SERVICE_CENTER',
  },
  {
    name: '策略中心',
    id: 'FSP_STRATEGY_CENTER',
    path: '',
    pid: 'ROOT',
  },
  {
    name: '资讯中心',
    id: 'FSP_INFORMATION_M_CENTER',
    path: '/fsp/strategyCenter/informationCenter',
    pid: 'FSP_STRATEGY_CENTER',
  },
  {
    name: '个股资讯',
    id: 'FSP_STOCK_INFORMATION',
    path: '/strategyCenter/stock',
    pid: 'FSP_STRATEGY_CENTER',
  },
  {
    name: '精选组合',
    id: 'FSP_CHOICENESS_COMBINATION',
    path: '/strategyCenter/choicenessCombination',
    pid: 'FSP_STRATEGY_CENTER',
  },
  {
    name: '每日晨报',
    id: 'FSP_DAILY_PAPER',
    path: '/strategyCenter/broadcastList',
    pid: 'FSP_PRD_REPOSITORY',
  },
  {
    name: '业务申请',
    id: 'FSP_BUSINESS_APPLYMENT',
    path: '',
    pid: 'ROOT',
  },
  {
    name: '服务订阅',
    id: 'FSP_COMMISSION_ADJUSTMENT',
    path: '/application/commission',
    pid: 'FSP_BUSINESS_APPLYMENT',
  },
  {
    name: '合约管理',
    id: 'FSP_CONTRACT_MANAGEMENT',
    path: '/contract',
    pid: 'FSP_BUSINESS_APPLYMENT',
  },
  {
    name: '协议管理',
    id: 'FSP_PROTOCOL_MANAGEMENT',
    path: '/channelsTypeProtocol',
    pid: 'FSP_BUSINESS_APPLYMENT',
  },
  {
    name: '权限管理',
    id: 'FSP_INVEST_CONTRACT',
    path: '/permission',
    pid: 'FSP_BUSINESS_APPLYMENT',
  },
  {
    name: '资金业务',
    id: 'FSP_BUSINESS_APPLYMENT_FINANCE',
    path: '',
    pid: 'FSP_BUSINESS_APPLYMENT',
  },
  {
    name: '超额快取',
    id: 'FSP_BIZAPPLY_EXCESSCACHE',
    path: '/fsp/businessApplyment/bizapply/excesscache',
    pid: 'FSP_BUSINESS_APPLYMENT_FINANCE',
  },
  {
    name: '预约取款申请业务',
    id: 'FSP_BUSINESS_APPLYMENT_AP',
    path: '/fsp/businessApplyment/bizapply/applyment',
    pid: 'FSP_BUSINESS_APPLYMENT_FINANCE',
  },
  {
    name: '客户预约取现查询',
    id: 'FSP_BUSINESS_APPLYMENT_B',
    path: '/fsp/businessApplyment/bizapply/appointBook',
    pid: 'FSP_BUSINESS_APPLYMENT_FINANCE',
  },
  {
    name: '银行账户报备申请',
    id: 'FSP_BUSINESS_BANKACCOUNT_APPLY',
    path: '/fsp/businessApplyment/bizapply/bankAccountApply',
    pid: 'FSP_BUSINESS_APPLYMENT_FINANCE',
  },
  {
    name: '银行账户申请',
    id: 'FSP_BUSINESS_BANKACCOUNT_QUERY',
    path: '/fsp/businessApplyment/bizapply/bankAccountQuery',
    pid: 'FSP_BUSINESS_APPLYMENT_FINANCE',
  },
  {
    name: '信用业务',
    id: 'FSP_BUSINESS_APPLYMENT_CREDIT',
    path: '',
    pid: 'FSP_BUSINESS_APPLYMENT',
  },
  {
    name: '专项头寸申请',
    id: 'FSP_BUSINESS_TC_APPLYMANAGE',
    path: '/fsp/businessApplyment/credit/tcApplymanage',
    pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
  },
  {
    name: '授信申请',
    id: 'FSP_BUSINESS_CREDIT_APPLYMANAGE',
    path: '/fsp/businessApplyment/credit/creditApplymanage',
    pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
  },
  {
    name: '利率调整申请',
    id: 'FSP_BUSINESS_RATEADJUST_INTERESCT',
    path: '/fsp/businessApplyment/credit/rateAdjustInteresct',
    pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
  },
  {
    name: '意向申报评估',
    id: 'FSP_BUSINESS_ESTIMATE_INTERESCT',
    path: '/fsp/businessApplyment/credit/estimateInteresct',
    pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
  },
  {
    name: '项目尽职调查',
    id: 'FSP_BUSINESS_DUE_PROJECT',
    path: '/fsp/businessApplyment/credit/dueProject',
    pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
  },
  {
    name: '项目评审',
    id: 'FSP_BUSINESS_REALL_PROJECT',
    path: '/fsp/businessApplyment/credit/reallProject',
    pid: 'FSP_BUSINESS_APPLYMENT_CREDIT', 
  },
  {
    name: '贷后管理-跟踪调查管理',
    id: 'FSP_BUSINESS_TRAKING_MANAGE',
    path: '/fsp/businessApplyment/credit/trakingManage',
    pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
  },
  {
    name: '风险持续跟踪与提示',
    id: 'FSP_BUSINESS_TRAKING_PROMP',
    path: '/fsp/businessApplyment/credit/trakingPromp',
    pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
  },
  {
    name: '初始化交易申请',
    id: 'FSP_BUSINESS_TRAN_APP',
    path: '/fsp/businessApplyment/credit/tranApp',
    pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
  },
  {
    name: '期权业务',
    id: 'FSP_BUSINESS_APPLYMENT_OPTION',
    path: '',
    pid: 'FSP_BUSINESS_APPLYMENT',
  },
  {
    name: '股票期权评估申请',
    id: 'FSP_BUSINESS_APPLYMENT_OPTIONSTOCKINVEST',
    path: '/fsp/businessApplyment/option/stockinvest',
    pid: 'FSP_BUSINESS_APPLYMENT_OPTION',
  },
  {
    name: '期权佣金申请业务',
    id: 'FSP_BUSINESS_APPLYMENT_OF',
    path: '/fsp/businessApplyment/option/optionfund',
    pid: 'FSP_BUSINESS_APPLYMENT_OPTION',
  },
  {
    name: '适当性申请',
    id: 'FSP_BUSINESS_APPLYMENT_APPROPRIATE',
    path: '',
    pid: 'FSP_BUSINESS_APPLYMENT',
  },
  {
    name: '双录文件申请',
    id: 'FSP_BUSINESS_APPLYMENT_VFSH',
    path: '/fsp/businessApplyment/appropriate/vfsh',
    pid: 'FSP_BUSINESS_APPLYMENT_APPROPRIATE',
  },
  {
    name: '私募产品资格申请',
    id: 'FSP_PP_M_PRIPROD',
    path: '/fsp/businessApplyment/appropriate/priProd',
    pid: 'FSP_BUSINESS_APPLYMENT_APPROPRIATE',
  },
  {
    name: '通道类业务',
    id: 'FSP_BUSINESS_APPLYMENT_CHANNEL',
    path: '',
    pid: 'FSP_BUSINESS_APPLYMENT',
  },
  {
    name: 'PB系统业务',
    id: 'FSP_BUSINESS_APPLYMENT_PB',
    path: '/fsp/businessApplyment/channel/pbbiz',
    pid: 'FSP_BUSINESS_APPLYMENT_CHANNEL',
  },
  {
    name: '统计查询',
    id: 'FSP_STATISTICAL_QUERY',
    path: '',
    pid: 'ROOT',
  },
  {
    name: '管理者视图',
    id: 'FSP_MANAGER_VIEW',
    path: '/statisticalQuery/report',
    pid: 'FSP_STATISTICAL_QUERY',
  },
  {
    name: '高净值绩效服务经理查询',
    id: 'FSP_HIGH_SERVICE_KPI_MGR_QUERY',
    path: '',
    pid: 'FSP_STATISTICAL_QUERY',
  },
  {
    name: '高净值客户服务绩效',
    id: 'FSP_HIGH_SERVICE_KPI_MGR',
    path: '',
    pid: 'FSP_HIGH_SERVICE_KPI_MGR_QUERY',
  },
  {
    name: '高净值客户净创收',
    id: 'FSP_HIGH_SERVICE_KPI_MGR_REVENUE',
    path: '',
    order: 2,
  },
  {
    name: '高净值客户资产变动',
    id: 'FSP_HIGH_SERVICE_KPI_MGR_ASSETS',
    path: '',
    pid: 'FSP_HIGH_SERVICE_KPI_MGR_QUERY',
  },
  {
    name: '高净值客户信息有效性',
    id: 'FSP_HIGH_SERVICE_KPI_MGR_EFFECTIVENESS',
    path: '',
    pid: 'FSP_HIGH_SERVICE_KPI_MGR_QUERY',
  },
  {
    name: '理财平台应用情况统计',
    id: 'FSP_HIGH_SERVICE_KPI_MGR_APPLICATION',
    path: '',
    pid: 'FSP_HIGH_SERVICE_KPI_MGR_QUERY',
  },
  {
    name: '高净值绩效部门查询',
    id: 'FSP_HIGH_SERVICE_KPI',
    path: '',
    pid: 'FSP_STATISTICAL_QUERY',
  },
  {
    name: '高净值客户服务绩效',
    id: 'FSP_HIGH_SERVICE_KPI_DEPT',
    path: '',
    pid: 'FSP_HIGH_SERVICE_KPI',
  },
  {
    name: '理财平台应用情况统计',
    id: 'FSP_HIGH_SERVICE_KPI_DEPT_APPLICATION',
    path: '',
    pid: 'FSP_HIGH_SERVICE_KPI',
  },
  {
    name: '高净值客户资产变动',
    id: 'FSP_HIGH_SERVICE_KPI_DEPT_ASSETS',
    path: '',
    pid: 'FSP_HIGH_SERVICE_KPI',
  },
  {
    name: '高净值客户信息有效性',
    id: 'FSP_HIGH_SERVICE_KPI_DEPT_EFFECTIVENESS',
    path: '',
    pid: 'FSP_HIGH_SERVICE_KPI',
  },
  {
    name: '高净值客户信息完善率',
    id: 'FSP_HIGH_SERVICE_KPI_DEPT_INFO',
    path: '',
    pid: 'FSP_HIGH_SERVICE_KPI',
  },
  {
    name: '高净值客户净创收',
    id: 'FSP_HIGH_SERVICE_KPI_DEPT_REVENUE',
    path: '',
    pid: 'FSP_HIGH_SERVICE_KPI',
  },
  {
    name: 'MOT执行情况报表',
    id: 'FSP_MOT_M_EXECUTE_STATISTICS',
    path: '',
    pid: 'FSP_STATISTICAL_QUERY',
  },
  {
    name: '产品销售适当性查询',
    id: 'FSP_PRODUCT_SALE_APPROPRIATE_DEPT',
    path: '',
    pid: 'FSP_STATISTICAL_QUERY',
  },
  {
    name: '服务类任务统计',
    id: 'FSP_MOT_M_SVRTASK_STATISTICS',
    path: '',
    pid: 'FSP_STATISTICAL_QUERY',
  },
  {
    name: '期货IB业务适当性报表',
    id: 'FSP_IB_REPORT',
    path: '',
    pid: 'FSP_STATISTICAL_QUERY',
  },
  {
    name: '投资专项报表（服务管理）',
    id: 'FSP_TGINVEST_CONTRACT',
    path: '',
    pid: 'FSP_STATISTICAL_QUERY',
  },
  {
    name: '投资专项报表（部门统计）',
    id: 'FSP_TGINVEST_STATISTICS',
    path: '',
    pid: 'FSP_STATISTICAL_QUERY',
  },
  {
    name: 'MOT服务统计',
    id: 'FSP_MOT_M_SERVICE_STATISTICS',
    path: '/fsp/statisticalQuery/MOTStatistics',
    pid: 'FSP_STATISTICAL_QUERY',
  },
  {
    name: '积分兑换产品历史查询报表',
    id: 'FSP_LOYALTY_ORDER',
    path: '/exchange',
    pid: 'FSP_STATISTICAL_QUERY',
  },
  {
    name: '运维管理',
    id: 'FSP_SYS_OPERATE',
    path: '',
    pid: 'ROOT',
  },
  {
    name: '平台参数设置',
    id: 'FSP_SYSTEM_MANAGE_PARAMETER',
    path: '/platformParameterSetting',
    pid: 'FSP_SYS_OPERATE',
  },
  {
    name: '组织和人员管理',
    id: 'FSP_ORGAN_PERSONAL_MANAGE',
    path: '',
    pid: 'FSP_SYS_OPERATE',
  },
  {
    name: '分公司人工划转',
    id: 'FSP_CROSS_DEPARTMENT',
    path: '/filialeCustTransfer',
    pid: 'FSP_ORGAN_PERSONAL_MANAGE',
  },
  {
    name: '汇报关系树管理',
    id: 'FSP_REPORT_RELATION',
    path: '/relation',
    pid: 'FSP_ORGAN_PERSONAL_MANAGE',
  },
  {
    name: '服务经理主职位管理',
    id: 'FSP_MAIN_POSTN_MANAGE',
    path: '/mainPosition',
    pid: 'FSP_ORGAN_PERSONAL_MANAGE',
  },
  {
    name: '公务手机管理',
    id: 'FSP_ADVISOR_MOBILE_BINDING',
    path: '/telephoneNumberManage',
    pid: 'FSP_SYS_OPERATE',
  },
  {
    name: '投诉工单管理',
    id: 'FSP_CUST_COMPLAINT_MANGER',
    path: '/fsp/sysOperate/custcomplaint',
    pid: 'FSP_SYS_OPERATE',
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
    name: '待办流程',
    id: 'FSP_TODO',
    path: '/customerPool/todo',
    pid: 'ROOT',
  },
  {
    name: '消息提醒',
    id: 'FSP_MESSAGE',
    path: '/fsp/messageCenter',
    pid: 'ROOT',
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
    pid: 'ROOT',
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

export default newOpenTabConfig;

// 默认当前激活的主导航菜单项
const indexPaneKey = 'FSP_NEW_HOMEPAGE';

// 主导航默认的几个菜单项
// export const defaultMenu = [
//   'FSP_NEW_HOMEPAGE',
//   'FSP_CUST_M_CENTER',
//   'FSP_MOT_M_TASK',
//   'FSP_PRD_REPOSITORY',
//   'FSP_SERVICE_CENTER',
//   'FSP_STRATEGY_CENTER',
//   'FSP_BUSINESS_APPLYMENT',
//   'FSP_STATISTICAL_QUERY',
//   'FSP_SYS_OPERATE',
  // }
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

export {
  newOpenTabConfig,
  indexPaneKey,
  defaultMenu,
};

