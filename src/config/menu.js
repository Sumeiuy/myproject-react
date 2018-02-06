/**
 * @file config/menu.js
 *  侧边栏菜单配置
 * @author maoquan(maoquan@htsc.com)
 */

const menus = [
  {
    id: 'FSP_NEW_HOMEPAGE',
    name: '首页',
    order: 1,
    pid: 'ROOT',
    url: '',
    type: 'link',
    action: '',
    path: '/customerPool',
  },
  {
    id: 'FSP_CUST_M_CENTER',
    name: '客户中心',
    order: 2,
    pid: 'ROOT',
    url: '',
    type: 'menu',
    action: '',
    path: '',
    children: [
      {
        id: 'FSP_CUST_M_CENTER_MANAGE',
        name: '客户管理',
        order: 1,
        pid: 'FSP_CUST_M_CENTER',
        url: '/customer/manage/showCustManageTabWin',
        type: 'link',
        action: 'loadInTab',
        path: '/fsp/customerCenter/customerManage',
      },
      {
        id: 'FSP_CUST_GROUP_MANAGE',
        name: '分组管理',
        order: 2,
        pid: 'FSP_CUST_M_CENTER',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/customerCenter/customerGroupManage',
      },
    ],
  },
  {
    id: 'FSP_MOT_M_TASK',
    name: '任务中心',
    order: 3,
    pid: 'ROOT',
    url: '',
    type: 'menu',
    action: '',
    path: '',
    children: [
      {
        id: 'FSP_MOT_SELFBUILT_TASK',
        name: '任务列表',
        order: 1,
        pid: 'FSP_MOT_M_TASK',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/taskCenter/selfbuildTask',
      },
      {
        id: 'FSP_MOT_M_SERVICELIST',
        name: '服务记录管理',
        order: 2,
        pid: 'FSP_MOT_M_TASK',
        url: '/mot/service/showList',
        type: 'link',
        action: 'loadInTab',
        path: '/fsp/taskCenter/serviceManage',
      },
    ],
  },
  {
    id: 'FSP_PRD_REPOSITORY',
    name: '产品中心',
    order: 4,
    pid: 'ROOT',
    url: '',
    type: 'menu',
    action: '',
    path: '',
    children: [
      {
        id: 'FSP_PRD_POOL',
        name: '推荐资产池',
        order: 1,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/product/pool/selectProduct',
        type: 'link',
        action: 'loadInTab',
        path: '/fsp/productCenter/productPool',
      },
      {
        id: 'FSP_PRD_CALENDAR',
        name: '产品日历',
        order: 2,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/htsc-product-base/product_sales_calendar.do?clientType=crm',
        type: 'link',
        action: 'loadInTab',
        path: '/fsp/productCenter/salesCalendar',
      },
      {
        id: 'FSP_PUBLIC_FUND',
        name: '公募基金',
        order: 3,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/htsc-product-base/financial_product_search.do?clientType=crm',
        type: 'link',
        action: 'loadExternSystemPage',
        path: '',
      },
      {
        id: 'FSP_PRD_FINANCE',
        name: '金融产品库',
        order: 4,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/htsc-product-base/product_search_currency.do?clientType=crm&special_enter=1',
        type: 'link',
        action: 'loadInTab',
        path: '/fsp/productCenter/financeProducts',
      },
      {
        id: 'FSP_DAILY_PAPER',
        name: '每日晨报',
        order: 5,
        pid: 'FSP_PRD_REPOSITORY',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/productCenter/dailyPaper',
      },
    ],
  },
  {
    id: 'FSP_SERVICE_CENTER',
    name: '服务中心',
    order: 5,
    pid: 'ROOT',
    url: '',
    type: 'menu',
    action: '',
    path: '',
    children: [
      {
        id: 'FSP_CUST_COMPLAINT_MANGER', // 任务管理需要修正
        name: '投诉工单管理',
        order: 1,
        pid: 'FSP_SERVICE_CENTER',
        url: '/custcomplaint/manage/listContent',
        type: 'link',
        action: 'loadInTab',
        path: '/fsp/serviceCenter/custcomplaint',
      },
      {
        id: 'FSP_ASSET_ALLOCATION',
        name: '资产配置',
        order: 2,
        pid: 'FSP_SERVICE_CENTER',
        url: '',
        type: 'menu',
        action: '',
        path: '/serviceCenter/asset',
        children: [
          {
            id: 'FSP_ASSET_ALLOCATION_IMPLEMENTATION',
            name: '实施',
            order: 1,
            pid: 'FSP_ASSET_ALLOCATION',
            url: '/asset/implementation/main',
            type: 'link',
            action: 'loadInTab',
            path: '/fsp/serviceCenter/asset/implementation',
          },
          {
            id: 'FSP_ASSET_ALLOCATION_BASIS',
            name: '模板',
            order: 2,
            pid: 'FSP_ASSET_ALLOCATION',
            url: '/asset/basis/mainTab',
            type: 'link',
            action: 'loadInTab',
            path: '/fsp/serviceCenter/asset/basis',
          },
        ],
      },
    ],
  },
  {
    id: 'FSP_STRATEGY_CENTER',
    name: '策略中心',
    order: 6,
    pid: 'ROOT',
    url: '',
    type: 'menu',
    action: '',
    path: '',
    children: [
      {
        id: 'FSP_INFORMATION_M_CENTER',
        name: '资讯中心',
        order: 1,
        pid: 'FSP_STRATEGY_CENTER',
        url: '/jeip/psso/htscsso.jsp?biz_sys_key=zxzx',
        type: 'link',
        action: 'loadInTab',
        path: '/fsp/strategyCenter/informationCenter',
      },
      {
        id: 'FSP_LASTEST_VIEWPOINT',
        name: '最新观点',
        order: 2,
        pid: 'FSP_STRATEGY_CENTER',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/strategyCenter/lastestViewpoint',
      },
      {
        id: 'FSP_STOCK_INFORMATION',
        name: '个股资讯',
        order: 3,
        pid: 'FSP_STRATEGY_CENTER',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/strategyCenter/stockInformation',
      },
    ],
  },
];

export default menus;
