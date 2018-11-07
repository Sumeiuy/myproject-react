/**
 * @file config/fspRoutes.js
 *  路由和請求的url之間的映射表
 * @author zhufeiyang
 */

/**
 * 由于要嵌入fsp页面，原fsp页面代码的调用参数只与url相关，
 * 但是在react中，需要与path进行关联，从而跳转新的页面
 * 所以设置这个映射表，根据fsp的url，映射相应的react框架的path
 * 次级导航菜单涉及到的fsp页面非常多，所以不在这里配置，而是直接复用后端的数据
 */
const fspRoutes = [
  // 跳回首页
  {
    path: '/customerPool',
    action: '',
    url: '/fspRouteError', // url属性可以为string类型，或者为RegExp类型，从而方便匹配
  },
  // MOT任务相关
  {
    path: '/fsp/motTask',
    action: 'loadInTab',
    containerId: 'FSP_MOT_TAB_TASK_MANAGE',
    url: '/mot/manage/showMotTaskSubTabWin?taskType=MOT',
  },
  // MOT服务统计
  {
    path: '/fsp/statisticalQuery/MOTStatistics',
    action: 'loadInTab',
    containerId: 'FSP_MOT_TAB_SERVICE_STATISTICS',
    url: '/mot/statistics/showList',
  },
  // MOT服务统计明细
  {
    path: '/fsp/MOTStatisticsDetail',
    action: 'loadInTab',
    containerId: 'FSP_MOT_TAB_SERVICE_STATISTICS',
    url: /\/mot\/statistics\/detail\/(showMotThingViewDetail)|(showMotExeStatusDetail)/,
  },
  {
    path: '/fsp/motTaskHandle',
    action: 'loadInTab',
    containerId: 'FSP_MOT_TAB_TASK_HANDLE',
    url: '/mot/manage/showHandle',
  },
  // 服务记录管理
  {
    path: '/fsp/taskCenter/serviceManage',
    action: 'loadInTab',
    containerId: 'FSP_MOT_TAB_SERVICELIST',
    url: '/mot/service/showList',
  },
  // 投顾签约
  {
    path: '/fsp/serviceCenter/investContract',
    action: 'loadInTab',
    containerId: 'FSP_TGINVEST_LIST_TAB',
    url: '/tgcontract/list/listContent',
  },
  // 投顾签约向导
  {
    path: '/fsp/contractWizard',
    action: 'loadInTab',
    containerId: 'utb-stockcontract-wizard',
    url: '/client/investcontract/wizard/',
  },
  // 新建签约向导
  {
    path: '/fsp/customerCenter/contractSelectOperate',
    action: 'loadInTab',
    containerId: 'FSP_CONTRACTLIST_OPERATE_TAB',
    url: '/tgcontract/list/selectOperate',
  },
  // 佣金调整向导
  {
    path: '/fsp/serviceOrderingWizard',
    action: 'loadInTab',
    containerId: 'utb-serviceOrdering-wizard',
    url: '/client/serviceOrdering/wizard/',
  },
  // 客户管理
  {
    path: '/fsp/customerCenter/customerManage',
    action: 'loadInTab',
    containerId: 'FSP_CUST_TAB_CENTER_MANAGE', // 外层容器id
    url: '/customer/manage/showCustManageTabWin',
  },
  // 客户360
  {
    path: '/fsp/customerCenter/customer360',
    action: 'loadInTab',
    containerId: 'FSP_CUST_TAB_CENTER_MANAGE',
    url: '/customerCenter/360/',
  },
  // 合约详情
  {
    path: '/fsp/customerCenter/360OrderDetail',
    action: 'loadInTab',
    url: /\/customerCenter\/360\/.+(?=orderDetail)/,
  },
  // 投顾签约变更向导
  {
    path: '/fsp/customerCenter/360OperateType',
    action: 'loadInTab',
    url: /\/customerCenter\/360\/.+(?=operateType)/,
  },
  // 投顾签约计划变更向导
  {
    path: '/fsp/customerCenter/360Wizard',
    action: 'loadInTab',
    containerId: 'utb-stockcontractupd-wizard',
    url: /client\/tgcontractupd\/wizard\/main/,
  },
  // 投顾签约转签向导
  {
    path: '/fsp/customerCenter/tgcontracttransfer',
    action: 'loadInTab',
    containerId: 'utb-stockcontracttransfer-wizard',
    url: '/client/tgcontracttransfer/wizard/main',
  },
  // 合约历史记录
  {
    path: '/fsp/customerCenter/360orderHisDetail',
    action: 'loadInTab',
    url: /\/customerCenter\/360\/.+(?=orderHisDetail)/,
  },
  // 佣金查询
  {
    path: '/fsp/customerCenter/toCommission',
    action: 'loadInTab',
    url: /\/customerCenter\/360\/.+(?=toCommission)/,
  },
  // 投诉工单管理
  {
    path: '/fsp/sysOperate/custcomplaint',
    action: 'loadInTab',
    containerId: 'FSP_CUST_COMPLAINT_MANGER',
    url: '/custcomplaint/manage/listContent',
  },
  // 工单投诉信息
  {
    path: '/fsp/custcomplaint/complaintInfo',
    action: 'loadInTab',
    url: '/custcomplaint/manage/viewCustComplaintInfo',
  },
  // 新增投诉工单
  {
    path: '/fsp/custcomplaint/toAddPageInfo',
    action: 'loadInTab',
    containerId: 'FSP_ST_TAB_CUSTCOMP_ADD',
    url: '/custcomplaint/manage/toAddPageInfo',
  },
  // 资产配置明细
  {
    path: '/fsp/implementation/initsee',
    action: 'loadInTab',
    containerId: 'asset_implementation_tab',
    url: '/asset/implementation/initsee',
  },
  // 资产配置明细
  {
    path: '/fsp/implementation/initsee',
    action: 'loadInTab',
    containerId: 'asset_implementation_tab',
    url: '/asset/implementation/wizard/main',
  },
  // 资产配置实施
  {
    path: '/fsp/serviceCenter/asset/implementation',
    action: 'loadInTab',
    containerId: 'FSP_ASSET_ALLOCATION',
    url: '/asset/implementation/main',
  },
  // 资产配置模板
  {
    path: '/fsp/serviceCenter/asset/basis',
    action: 'loadInTab',
    url: '/asset/basis/mainTab',
  },
  // 资讯中心
  {
    path: '/fsp/strategyCenter/informationCenter',
    action: 'loadInIframe',
    url: '/jeip/psso/htscsso.jsp?biz_sys_key=zxzx',
  },
  // 超额快取
  {
    path: '/fsp/businessApplyment/bizapply/excesscache',
    action: 'loadInTab',
    containerId: 'FSP_BIZAPPLY_EXCESSCACHE',
    url: '/bizapply/excesscache/list',
  },
  // 超额快取信息
  {
    path: '/fsp/bizapply/excesscacheView',
    action: 'loadInTab',
    containerId: 'FSP_BIZAPPLY_EXCESSCACHE_EDIT',
    url: '/bizapply/excesscache/view',
  },
  // 超额快取信息编辑（与超额快取信息共用一个页面）
  {
    path: '/fsp/bizapply/excesscacheView',
    action: 'loadInTab',
    containerId: 'FSP_BIZAPPLY_EXCESSCACHE_EDIT',
    url: '/bizapply/excesscache/edit',
  },
  // 预约取款申请业务
  {
    path: '/fsp/businessApplyment/bizapply/applyment',
    action: 'loadInTab',
    containerId: 'FSP_BUSINESS_APPLYMENT_AP_LIST',
    url: '/bizapply/appoint/appointDrawTab',
  },
  // 预约取款申请
  {
    path: '/fsp/bizapply/queryAppointDraw',
    action: 'loadInTab',
    containerId: 'appoint_queryAppointDraw_tab',
    url: '/bizapply/appoint/queryAppointDraw',
  },
  // 股票期权评估申请
  {
    path: '/fsp/businessApplyment/option/stockinvest',
    action: 'loadInTab',
    containerId: 'FSP_BUSINESS_APPLYMENT_OPTIONSTOCKINVEST',
    url: '/bizapply/stockinvest/listContent',
  },
  // 新增股票期权评估申请
  {
    path: '/fsp/stockinvest/toAddPageInfo',
    action: 'loadInTab',
    containerId: 'FSP_ST_TAB_APY_STOCKINVEST_ADD',
    url: '/bizapply/stockinvest/toAddPageInfo',
  },
  // 查看股票期权评估申请
  {
    path: '/fsp/stockinvest/viewCustComplaintInfo',
    action: 'loadInTab',
    containerId: '',
    url: '/bizapply/stockinvest/viewCustComplaintInfo',
  },
  // 期权佣金申请业务
  {
    path: '/fsp/businessApplyment/option/optionfund',
    action: 'loadInTab',
    containerId: 'FSP_BUSINESS_APPLYMENT_OF_LIST',
    url: '/bizapply/optionfund/mainPage',
  },
  // 期权佣金申请明细
  {
    path: '/fsp/optionfund/showApplyInfoTab',
    action: 'loadInTab',
    containerId: 'optionfund_applyInfo_tab',
    url: '/bizapply/optionfund/showApplyInfoTab',
  },
  // 双录文件申请
  {
    path: '/fsp/businessApplyment/appropriate/vfsh',
    action: 'loadInTab',
    containerId: 'FSP_BUSINESS_APPLYMENT_VFSH',
    url: '/appropriate/vfsh/listContent',
  },
  // 查看双录文件审核
  {
    path: '/fsp/vfsh/showMainInfoTab',
    action: 'loadInTab',
    containerId: '',
    url: '/appropriate/vfsh/showMainInfoTab',
  },
  // 双录视频向导
  {
    path: '/fsp/dbvfsh/wizard',
    action: 'loadInTab',
    containerId: 'utb-dbvfsh-wizard',
    url: '/client/dbvfsh/wizard/main',
  },
  // 私募产品资格申请
  {
    path: '/fsp/businessApplyment/appropriate/priProd',
    action: 'loadInTab',
    containerId: 'FSP_PP_M_PRIPROD',
    url: '/priProd/initmain',
  },
   // 私募产品信息
  {
    path: '/fsp/priProd/showPriProdTask',
    action: 'loadInTab',
    containerId: '',
    url: /\/priProd\/showPriProdTask\?.*detail$/,
  },
   // 私募产品信息编辑
  {
    path: '/fsp/priProd/showPriProdTaskManage',
    action: 'loadInTab',
    containerId: 'add_btn_priprod',
    url: '/priProd/showPriProdTask',
  },
  // 私募产品信息编辑
  {
    path: '/fsp/priProd/showPriProdTaskManage',
    action: 'loadInTab',
    containerId: 'add_btn_priprod',
    url: '/priProd/showAddPriProd',
  },
  // PB系统业务
  {
    path: '/fsp/businessApplyment/channel/pbbiz',
    action: 'loadInTab',
    containerId: 'FSP_BUSINESS_APPLYMENT_PB_LIST',
    url: '/bizapply/pbbiz/list',
  },
  // PB业务申请详情
  {
    path: '/fsp/pbbiz/detail',
    action: 'loadInTab',
    containerId: '',
    url: /\/bizapply\/pbbiz\/detail\?oper=view/,
  },
  // PB业务申请编辑
  {
    path: '/fsp/pbbiz/edit',
    action: 'loadInTab',
    containerId: 'FSP_PB_BIZ_MANAGE_EDIT',
    url: /\/bizapply\/pbbiz\/detail\?oper=all/,
  },
  // 客户预约取现查询
  {
    path: '/fsp/businessApplyment/bizapply/appointBook',
    action: 'loadInTab',
    containerId: 'FSP_BUSINESS_APPLYMENT_B',
    url: '/bizapply/appointBook/init',
  },
  // 专项业务知识
  {
    path: '/fsp/knowledge',
    action: 'loadInTab',
    containerId: 'FSP_M_K_CENTER',
    url: '/knowledge/initmain',
  },
  // 专项业务知识
  {
    path: '/fsp/knowledge',
    action: 'loadInTab',
    containerId: 'FSP_M_K_CENTER',
    url: '/knowledge/initmain',
  },
  // 业务知识信息
  {
    path: '/fsp/showKnowledgeDetail',
    action: 'loadInTab',
    containerId: 'edit_btn_showDetailsKnowledge',
    url: /\/knowledge\/showUpdKnowledge\?.*details$/,
  },
  // 新建专项业务知识
   {
    path: '/fsp/knowledgeEdit',
    action: 'loadInTab',
    containerId: 'edit_btn_showDetailsKnowledge',
    url: /\/knowledge\/showeAddKnowledge/,
  },
  // 编辑专项业务知识
  {
    path: '/fsp/knowledgeEdit',
    action: 'loadInTab',
    containerId: 'edit_btn_showDetailsKnowledge',
    url: /\/knowledge\/showUpdKnowledge/,
  },
];

export default fspRoutes;

