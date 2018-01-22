/**
 * @file config/fspRoutes.js
 *  路由和請求的url之間的映射表
 * @author zhufeiyang
 */

const fspRoutes = [
  // 跳回首页
  {
    path: '/customerPool',
    action: '',
    url: '/homepage',
  },
  // MOT任务相关
  {
    path: '/fsp/motTask',
    action: 'loadInTab',
    url: '/mot/manage/showMotTaskSubTabWin?taskType=MOT',
  },
  {
    path: '/fsp/motTaskHandle',
    action: 'loadInTab',
    url: '/mot/manage/showHandle',
  },
  // 服务记录管理
  {
    path: '/fsp/taskCenter/serviceManage',
    action: 'loadInTab',
    url: '/mot/service/showList',
  },
  // 投顾签约
  {
    path: '/fsp/investContract',
    action: 'loadInTab',
    url: '/tgcontract/list/listContent',
  },
  // 客户管理
  {
    path: '/fsp/customerCenter/customerManage',
    action: 'loadInTab',
    url: '/customer/manage/showCustManageTabWin',
  },
  // 客户360
  {
    path: '/fsp/customerCenter/customer360',
    action: 'loadInTab',
    url: '/customerCenter/360/',
  },
  // 佣金查询
  {
    path: '/fsp/customerCenter/toCommission',
    action: 'loadInTab',
    url: /\/customerCenter\/360\/.+(?=toCommission)/,
  },
  // 消息中心
  {
    path: '/fsp/messageCenter',
    action: 'loadInTab',
    url: '/messgeCenter',
  },
  // 产品中心
  {
    path: '/fsp/productCenter/productPool',
    action: 'loadInTab',
    url: '/product/pool/selectProduct',
  },
  {
    path: '/fsp/productCenter/salesCalendar',
    action: 'loadInIframe',
    url: '/htsc-product-base/product_sales_calendar.do?clientType=crm',
  },
  {
    path: '/fsp/productCenter/financeProducts',
    action: 'loadInIframe',
    url: '/htsc-product-base/product_search_currency.do?clientType=crm&special_enter=1',
  },
  // 服务中心
  {
    path: '/fsp/serviceCenter/custcomplaint',
    action: 'loadInTab',
    url: '/custcomplaint/manage/listContent',
  },
  {
    path: '/fsp/serviceCenter/asset/implementation',
    action: 'loadInTab',
    url: '/asset/implementation/main',
  },
  {
    path: '/fsp/serviceCenter/asset/basis',
    action: 'loadInTab',
    url: '/asset/basis/mainTab',
  },
  // 策略中心
  {
    path: '/fsp/strategyCenter/informationCenter',
    action: 'loadInIframe',
    url: '/jeip/psso/htscsso.jsp?biz_sys_key=zxzx',
  },
];

export default fspRoutes;

