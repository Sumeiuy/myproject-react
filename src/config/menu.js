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
    path: '/empty',  // TODO
  },
  {
    id: 'FSP_MOT_M_TASK',
    name: '任务中心',
    order: 3,
    pid: 'ROOT',
    url: '',
    type: 'menu',
    action: '',
    path: '/taskList',
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
        id: 'FSP_PUBLIC_FUND',
        name: '公募基金',
        order: 1,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/htsc-product-base/financial_product_search.do?clientType=crm',
        type: 'link',
        action: 'loadExternSystemPage',
        path: '',
      },
      {
        id: 'FSP_INCOME_RECEIPTS',
        name: '收益凭证',
        order: 2,
        pid: 'FSP_PRD_REPOSITORY',
        url: '',
        type: 'link',
        action: 'loadExternSystemPage',
        path: '',
      },
      {
        id: 'FSP_ZIJIN_RPODUCTS',
        name: '紫金产品',
        order: 3,
        pid: 'FSP_PRD_REPOSITORY',
        url: '',
        type: 'link',
        action: 'loadExternSystemPage',
        path: '',
      },
      {
        id: 'FSP_PRIVATE_RPODUCTS',
        name: '私募产品',
        order: 4,
        pid: 'FSP_PRD_REPOSITORY',
        url: '',
        type: 'link',
        action: 'loadExternSystemPage',
        path: '',
      },
      {
        id: 'FSP_PRD_FINANCE',
        name: '金融产品库',
        order: 5,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/htsc-product-base/product_search_currency.do?clientType=crm&special_enter=1',
        type: 'link',
        action: 'loadInTab',
        path: '/fsp/productCenter/financeProducts',
      },
      {
        id: 'FSP_PRD_CALENDAR',
        name: '产品日历',
        order: 6,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/htsc-product-base/product_sales_calendar.do?clientType=crm',
        type: 'link',
        action: 'loadInTab',
        path: '/fsp/productCenter/salesCalendar',
      },
      // {
      //   id: 'FSP_PRD_POOL',
      //   name: '推荐资产池',
      //   order: 1,
      //   pid: 'FSP_PRD_REPOSITORY',
      //   url: '/product/pool/selectProduct',
      //   type: 'link',
      //   action: 'loadInTab',
      //   path: '/fsp/productCenter/productPool',
      // },
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
        id: 'FSP_ASSET_ALLOCATION',
        name: '资产配置',
        order: 1,
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
      {
        id: 'FSP_INVESTMENT_CONTRACT',
        name: '投顾签约',
        order: 2,
        pid: 'FSP_SERVICE_CENTER',
        url: '',
        type: 'link',
        action: '',
        path: '',
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
        id: 'FSP_STOCK_INFORMATION',
        name: '个股资讯',
        order: 2,
        pid: 'FSP_STRATEGY_CENTER',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/stock',
      },
      {
        id: 'FSP_FEATURED_COMBINATION',
        name: '精选组合',
        order: 3,
        pid: 'FSP_STRATEGY_CENTER',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/choicenessCombination',
      },
      {
        id: 'FSP_DAILY_PAPER',
        name: '每日晨报',
        order: 4,
        pid: 'FSP_STRATEGY_CENTER',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/broadcastList',
      },
    ],
  },
  {
    id: 'FSP_BUSINESS_APPLICATION',
    name: '业务申请',
    order: 7,
    pid: 'ROOT',
    url: '',
    type: 'menu',
    action: '',
    path: '',
    children: [
      {
        id: 'FSP_SERVICE_SUBSCRIPTION',
        name: '服务订阅',
        order: 1,
        pid: 'FSP_BUSINESS_APPLICATION',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
      {
        id: 'FSP_CONTRACT_MANAGEMENT',
        name: '合约管理',
        order: 2,
        pid: 'FSP_BUSINESS_APPLICATION',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
      {
        id: 'FSP_AGREEMENT_MANAGEMENT',
        name: '协议管理',
        order: 3,
        pid: 'FSP_BUSINESS_APPLICATION',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
      {
        id: 'FSP_AUTHORITY_MANAGEMENT',
        name: '权限管理',
        order: 4,
        pid: 'FSP_BUSINESS_APPLICATION',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
      {
        id: 'FSP_MONEY_BUSINESS',
        name: '资金业务',
        order: 5,
        pid: 'FSP_BUSINESS_APPLICATION',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
      {
        id: 'FSP_CREDIT_BUSINESS',
        name: '信用业务',
        order: 6,
        pid: 'FSP_BUSINESS_APPLICATION',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
      {
        id: 'FSP_OPTIONS_BUSINESS',
        name: '期权业务',
        order: 7,
        pid: 'FSP_BUSINESS_APPLICATION',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
      {
        id: 'FSP_APPROPRIATE_APPLICATION',
        name: '适当性申请',
        order: 8,
        pid: 'FSP_BUSINESS_APPLICATION',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
      {
        id: 'FSP_CHANNEL_BUSINESS',
        name: '通道类业务',
        order: 9,
        pid: 'FSP_BUSINESS_APPLICATION',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
    ],
  },
  {
    id: 'FSP_STATISTICAL_QUERY',
    name: '统计查询',
    order: 8,
    pid: 'ROOT',
    url: '',
    type: 'menu',
    action: '',
    path: '',
    children: [
      {
        id: 'FSP_MANAGER_VIEW',
        name: '管理者视图',
        order: 1,
        pid: 'FSP_STATISTICAL_QUERY',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
      {
        id: 'FSP_INTEGRAL_EXCHANGE',
        name: '积分兑换产品历史查询报表',
        order: 2,
        pid: 'FSP_STATISTICAL_QUERY',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
    ],
  },
  {
    id: 'FSP_OM_MANAGEMENT',
    name: '运维管理',
    order: 9,
    pid: 'ROOT',
    url: '',
    type: 'menu',
    action: '',
    path: '',
    children: [
      {
        id: 'FSP_PLATFORM_PARAMETER',
        name: '平台参数设置',
        order: 1,
        pid: 'FSP_OM_MANAGEMENT',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
      {
        id: 'FSP_ORGANIZATION_PERSONNEL',
        name: '组织和人员管理',
        order: 2,
        pid: 'FSP_OM_MANAGEMENT',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
      {
        id: 'FSP_OFFICIAL_MOBILEPHONE',
        name: '公务手机管理',
        order: 3,
        pid: 'FSP_OM_MANAGEMENT',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
      {
        id: 'FSP_COMPLAINT_WORKORDER',
        name: '投诉工单管理',
        order: 4,
        pid: 'FSP_OM_MANAGEMENT',
        url: '',
        type: 'link',
        action: '',
        path: '',
      },
    ],
  },
];

export default menus;
