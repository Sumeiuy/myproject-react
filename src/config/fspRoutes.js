/**
 * @file config/fspRoutes.js
 *  路由和請求的url之間的映射表
 * @author zhufeiyang
 */

const fspRoutes = [
  // 任务中心
  {
    path: '/motTask',
    action: 'loadInTab',
    url: '/mot/manage/showMotTaskSubTabWin?taskType=MOT',
  },
  {
    path: '/taskCenter/serviceManage',
    action: 'loadInTab',
    url: '/mot/service/showList',
  },
  /*  {
     path: 'selfbuildTask',
     url: '/mot/selfbuildTask/selfBuildTaskMain',
   }, */
  {
    path: 'motService',
    url: '/mot/statistics/showList',
  },
  {
    path: 'customerHistory',
    url: '/mot/service/showList',
  },
  {
    path: 'ibreport',
    url: '/ibReport/main',
  },
  // 客户中心
  {
    path: 'test',
    url: '/custgroup/manage/showTestOtkTabWin',
  },
  // 知识库
  {
    path: 'fspinitmain',
    url: '/knowledge/initmain',
  },
  {
    path: 'investContract',
    url: '/tgcontract/list/listContent',
  },
  {
    path: '/customerCenter/customerManage',
    action: 'loadInTab',
    url: '/customer/manage/showCustManageTabWin',
  },
  {
    path: '/fsp/customerCenter/customer360',
    action: 'loadInTab',
    url: '/customerCenter/360/org/main',
  },
  // 客户投诉
  {
    path: 'listContent',
    url: '/custcomplaint/manage/listContent',
  },
  {
    path: 'pending',
    url: '/complaint/pending',
  },
  {
    path: 'fspall',
    url: '/complaint/all',
  },
  {
    path: 'fspnew',
    url: '/complaint/new',
  },
  {
    path: 'fspreport',
    url: '/complaint/report',
  },
  // 资金业务
  {
    path: 'excessCache',
    url: '/bizapply/excesscache/list',
  },
  {
    path: 'appointDrawTab',
    url: '/bizapply/appoint/appointDrawTab',
  },
  {
    path: 'appointBook',
    url: '/bizapply/appointBook/init',
  },
  // 适当性申请
  {
    path: 'priProd',
    url: '/priProd/initmain',
  },
  {
    path: 'appropriate',
    url: '/appropriate/vfsh/listContent',
  },

  // 通道类业务
  {
    path: 'pbbiz',
    url: '/bizapply/pbbiz/list',
  },

  // 期权业务
  {
    path: 'optionResearch',
    url: '/bizapply/stockinvest/listContent',
  },
  {
    path: 'optionfund',
    url: '/bizapply/optionfund/mainPage',
  },
  // 消息中心
  {
    path: '/messageCenter',
    action: 'loadInTab',
    url: '/messgeCenter',
  },
  // 产品中心
  {
    path: '/productCenter/productPool',
    action: 'loadInTab',
    url: '/product/pool/selectProduct',
  },
  {
    path: '/productCenter/salesCalendar',
    action: 'loadInIframe',
    url: '/htsc-product-base/product_sales_calendar.do?clientType=crm',
  },
  {
    path: '/productCenter/financeProducts',
    action: 'loadInIframe',
    url: '/htsc-product-base/product_search_currency.do?clientType=crm&special_enter=1',
  },
  // 服务中心
  {
    path: '/serviceCenter/custcomplaint',
    action: 'loadInTab',
    url: '/custcomplaint/manage/listContent',
  },
  {
    path: '/serviceCenter/asset/implementation',
    action: 'loadInTab',
    url: '/asset/implementation/main',
  },
  {
    path: '/serviceCenter/asset/basis',
    action: 'loadInTab',
    url: '/asset/basis/mainTab',
  },
  // 策略中心
  {
    path: '/strategyCenter/informationCenter',
    action: 'loadInIframe',
    url: '/jeip/psso/htscsso.jsp?biz_sys_key=zxzx',
  },
];

export default fspRoutes;

