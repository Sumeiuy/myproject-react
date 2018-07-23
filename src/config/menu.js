/**
 * @file config/menu.js
 *  侧边栏菜单配置
 * @author maoquan(maoquan@htsc.com)
 */

const primaryMenu = [
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
        id: 'FSP_CUST_M_CENTER_LIST',
        name: '客户管理',
        order: 1,
        pid: 'FSP_CUST_M_CENTER',
        url: '',
        type: 'link',
        action: '',
        path: '/customerPool/list?source=leftMenu',
      },
    ],
  },
  {
    id: 'FSP_MOT_M_TASK',
    name: '任务中心',
    order: 3,
    pid: 'ROOT',
    url: '/',
    type: 'menu',
    action: '',
    path: '',
    children: [
      {
        id: 'FSP_MOT_SELFBUILT_TASK',
        name: 'SMART任务管理',
        order: 1,
        pid: 'FSP_MOT_M_TASK',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/taskCenter/taskList',
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
        id: 'FSP_PUBLIC_FUND',
        name: '公募基金',
        order: 1,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/htsc-product-base/financial_product_search.do?clientType=crm',
        type: 'link',
        action: 'loadInIframe',
        path: '/fsp/productCenter/publicFund',
      },
      {
        id: 'FSP_PRD_INCOME',
        name: '收益凭证',
        order: 2,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/htsc-product-base/financial_product_search.do?router=receipt&clientType=crm',
        type: 'link',
        action: 'loadInIframe',
        path: '/fsp/productCenter/receipt',
      },
      {
        id: 'FSP_PRD_PURPLE_GOLD',
        name: '紫金产品',
        order: 3,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/htsc-product-base/financial_product_search.do?router=finance&clientType=crm',
        type: 'link',
        action: 'loadInIframe',
        path: '/fsp/productCenter/finance',
      },
      {
        id: 'FSP_PRIVATE_PRD',
        name: '私募产品',
        order: 4,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/htsc-product-base/financial_product_search.do?router=privateFund',
        type: 'link',
        action: 'loadInIframe',
        path: '/fsp/productCenter/privateFund',
      },
      {
        id: 'FSP_PRD_FINANCE',
        name: '金融产品库',
        order: 5,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/htsc-product-base/product_search_currency.do?clientType=crm&special_enter=1',
        type: 'link',
        action: 'loadInIframe',
        path: '/fsp/productCenter/financeProducts',
      },
      {
        id: 'FSP_PRD_CALENDAR',
        name: '产品日历',
        order: 6,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/htsc-product-base/product_sales_calendar.do?clientType=crm',
        type: 'link',
        action: 'loadInIframe',
        path: '/fsp/productCenter/salesCalendar',
      },
      {
        id: 'FSP_PRD_POOL',
        name: '推荐资产池',
        order: 7,
        pid: 'FSP_PRD_REPOSITORY',
        url: '/product/pool/selectProduct',
        type: 'link',
        action: 'loadInIframe',
        path: '/fsp/productCenter/productPool',
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
        id: 'FSP_ASSET_ALLOCATION',
        name: '资产配置',
        order: 1,
        pid: 'FSP_SERVICE_CENTER',
        url: '',
        type: 'menu',
        action: '',
        path: '/asset',
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
        id: 'FSP_TGINVEST_LIST',
        name: '投顾签约',
        order: 2,
        pid: 'FSP_SERVICE_CENTER',
        url: '/tgcontract/list/listContent',
        type: 'link',
        action: 'loadInTab',
        path: '/fsp/serviceCenter/investContract',
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
        action: 'loadInIframe',
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
        path: '/strategyCenter/stock',
      },
      {
        id: 'FSP_CHOICENESS_COMBINATION',
        name: '精选组合',
        order: 3,
        pid: 'FSP_STRATEGY_CENTER',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/strategyCenter/choicenessCombination',
      },
      {
        id: 'FSP_DAILY_PAPER',
        name: '每日晨报',
        order: 4,
        pid: 'FSP_PRD_REPOSITORY',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/strategyCenter/broadcastList',
      },
    ],
  },
  {
    id: 'FSP_BUSINESS_APPLYMENT',
    name: '业务申请',
    order: 7,
    pid: 'ROOT',
    url: '',
    type: 'menu',
    action: '',
    path: '',
    children: [
      {
        id: 'FSP_COMMISSION_ADJUSTMENT',
        name: '服务订阅',
        order: 1,
        pid: 'FSP_BUSINESS_APPLYMENT',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/businessApplyment/commission',
      },
      {
        id: 'FSP_CONTRACT_MANAGEMENT',
        name: '合约管理',
        order: 2,
        pid: 'FSP_BUSINESS_APPLYMENT',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/businessApplyment/contract',
      },
      {
        id: 'FSP_PROTOCOL_MANAGEMENT',
        name: '协议管理',
        order: 3,
        pid: 'FSP_BUSINESS_APPLYMENT',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/businessApplyment/channelsTypeProtocol',
      },
      {
        id: 'FSP_INVEST_CONTRACT',
        name: '权限管理',
        order: 4,
        pid: 'FSP_BUSINESS_APPLYMENT',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/businessApplyment/permission',
      },
      {
        id: 'FSP_BUSINESS_APPLYMENT_FINANCE',
        name: '资金业务',
        order: 5,
        pid: 'FSP_BUSINESS_APPLYMENT',
        url: '',
        type: 'menu',
        action: '',
        path: '/bizapply',
        children: [
          {
            id: 'FSP_BIZAPPLY_EXCESSCACHE',
            name: '超额快取',
            order: 1,
            pid: 'FSP_BUSINESS_APPLYMENT_FINANCE',
            url: '/bizapply/excesscache/list',
            type: 'link',
            action: 'loadInTab',
            path: '/fsp/businessApplyment/bizapply/excesscache',
          },
          {
            id: 'FSP_BUSINESS_APPLYMENT_AP',
            name: '预约取款申请业务',
            order: 2,
            pid: 'FSP_BUSINESS_APPLYMENT_FINANCE',
            url: '/bizapply/appoint/appointDrawTab',
            type: 'link',
            action: 'loadInTab',
            path: '/fsp/businessApplyment/bizapply/applyment',
          },
          {
            id: 'FSP_BUSINESS_APPLYMENT_B',
            name: '客户预约取现查询',
            order: 3,
            pid: 'FSP_BUSINESS_APPLYMENT_FINANCE',
            url: '/bizapply/appointBook/init',
            type: 'link',
            action: 'loadInTab',
            path: '/fsp/businessApplyment/bizapply/appointBook',
          },
          {
            id: 'FSP_BUSINESS_BANKACCOUNT_APPLY',
            name: '银行账户报备申请',
            order: 4,
            pid: 'FSP_BUSINESS_APPLYMENT_FINANCE',
            url: '/liquid/login.jsp?NETWORK_INVOKE=98&defaultTargetUrl=sendRedirec',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_BUSINESS_BANKACCOUNT_QUERY',
            name: '银行账户申请',
            order: 5,
            pid: 'FSP_BUSINESS_APPLYMENT_FINANCE',
            url: '/liquid/login.jsp?NETWORK_INVOKE=97&defaultTargetUrl=sendRedirect.jsp&iv-user=#[userCode]',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
        ],
      },
      {
        id: 'FSP_BUSINESS_APPLYMENT_CREDIT',
        name: '信用业务',
        order: 6,
        pid: 'FSP_BUSINESS_APPLYMENT',
        url: '',
        type: 'menu',
        action: '',
        path: '/credit',
        children: [
          {
            id: 'FSP_BUSINESS_TC_APPLYMANAGE',
            name: '专项头寸申请',
            order: 1,
            pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
            url: '/cbs/login?defaultTargetUrl=/cbspages/postnApplyManage/postnApplyManageIndex.jsf&iv-user=#[userCode]',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_BUSINESS_CREDIT_APPLYMANAGE',
            name: '授信申请',
            order: 2,
            pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
            url: '/cbs/login?defaultTargetUrl=/cbspages/creditApplyManage/creditApplyManageIndex.jsf?reqType=1&iv-user=#[userCode]&custOrgId=#[orgCode]',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_BUSINESS_RATEADJUST_INTERESCT',
            name: '利率调整申请',
            order: 3,
            pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
            url: '/cbs/login?defaultTargetUrl=/cbspages/interestRateAdjustment/interestRateAdjustmentManage.jsf&iv-user=#[userCode]',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_BUSINESS_ESTIMATE_INTERESCT',
            name: '意向申报评估',
            order: 4,
            pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
            url: '/cbs/login?defaultTargetUrl=/cbspages/stkPdgClareProv/IntentClareEstimate.jsf&iv-user=#[userCode]',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_BUSINESS_DUE_PROJECT',
            name: '项目尽职调查',
            order: 5,
            pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
            url: '/cbs/login?defaultTargetUrl=/cbspages/stkPdgClareProv/dutyVestig.jsf&iv-user=#[userCode]',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_BUSINESS_REALL_PROJECT',
            name: '项目评审',
            order: 6,
            pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
            url: '/cbs/login?defaultTargetUrl=/cbspages/stkPdgClareProv/review.jsf&iv-user=#[userCode]',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_BUSINESS_TRAKING_MANAGE',
            name: '贷后管理-跟踪调查管理',
            order: 7,
            pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
            url: '/cbs/login?defaultTargetUrl=/cbspages/stkPdgPostLoan/postLoanTrack.jsf&iv-user=#[userCode]',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_BUSINESS_TRAKING_PROMP',
            name: '风险持续跟踪与提示',
            order: 8,
            pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
            url: '/cbs/login?defaultTargetUrl=/cbspages/marExpReminder/marFeedbackManage.jsf&iv-user=#[userCode]',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_BUSINESS_TRAN_APP',
            name: '初始化交易申请',
            order: 9,
            pid: 'FSP_BUSINESS_APPLYMENT_CREDIT',
            url: '/cbs/login?defaultTargetUrl=/cbspages/projectTranFlow/initTranAppList.jsf&iv-user=#[userCode]',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
        ],
      },
      {
        id: 'FSP_BUSINESS_APPLYMENT_OPTION',
        name: '期权业务',
        order: 7,
        pid: 'FSP_BUSINESS_APPLYMENT',
        url: '',
        type: 'menu',
        action: '',
        path: '/option',
        children: [
          {
            id: 'FSP_BUSINESS_APPLYMENT_OPTIONSTOCKINVEST',
            name: '股票期权评估申请',
            order: 1,
            pid: 'FSP_BUSINESS_APPLYMENT_OPTION',
            url: '/bizapply/stockinvest/listContent',
            type: 'link',
            action: 'loadInTab',
            path: '/fsp/businessApplyment/option/stockinvest',
          },
          {
            id: 'FSP_BUSINESS_APPLYMENT_OF',
            name: '期权佣金申请业务',
            order: 2,
            pid: 'FSP_BUSINESS_APPLYMENT_OPTION',
            url: '/bizapply/optionfund/mainPage',
            type: 'link',
            action: 'loadInTab',
            path: '/fsp/businessApplyment/option/optionfund',
          },
        ],
      },
      {
        id: 'FSP_BUSINESS_APPLYMENT_APPROPRIATE',
        name: '适当性申请',
        order: 8,
        pid: 'FSP_BUSINESS_APPLYMENT',
        url: '',
        type: 'menu',
        action: '',
        path: '/appropriate',
        children: [
          {
            id: 'FSP_BUSINESS_APPLYMENT_VFSH',
            name: '双录文件申请',
            order: 1,
            pid: 'FSP_BUSINESS_APPLYMENT_APPROPRIATE',
            url: '/appropriate/vfsh/listContent',
            type: 'link',
            action: 'loadInTab',
            path: '/fsp/businessApplyment/appropriate/vfsh',
          },
          {
            id: 'FSP_PP_M_PRIPROD',
            name: '私募产品资格申请',
            order: 2,
            pid: 'FSP_BUSINESS_APPLYMENT_APPROPRIATE',
            url: '/priProd/initmain',
            type: 'link',
            action: 'loadInTab',
            path: '/fsp/businessApplyment/appropriate/priProd',
          },
        ],
      },
      {
        id: 'FSP_BUSINESS_APPLYMENT_CHANNEL',
        name: '通道类业务',
        order: 9,
        pid: 'FSP_BUSINESS_APPLYMENT',
        url: '',
        type: 'menu',
        action: '',
        path: '/channel',
        children: [
          {
            id: 'FSP_BUSINESS_APPLYMENT_PB',
            name: 'PB系统业务',
            order: 1,
            pid: 'FSP_BUSINESS_APPLYMENT_CHANNEL',
            url: '/bizapply/pbbiz/list',
            type: 'link',
            action: 'loadInTab',
            path: '/fsp/businessApplyment/channel/pbbiz',
          },
        ],
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
        action: 'loadInTab',
        path: '/statisticalQuery/report',
      },
      {
        id: 'FSP_HIGH_SERVICE_KPI_MGR_QUERY',
        name: '高净值绩效服务经理查询',
        order: 2,
        pid: 'FSP_STATISTICAL_QUERY',
        url: '',
        type: 'menu',
        action: '',
        path: '',
        children: [
          {
            id: 'FSP_HIGH_SERVICE_KPI_MGR',
            name: '高净值客户服务绩效',
            order: 1,
            pid: 'FSP_HIGH_SERVICE_KPI_MGR_QUERY',
            url: '/acrmbi/login?menuId=01017&iv-user=#[userCode]&theme=acrm',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_HIGH_SERVICE_KPI_MGR_REVENUE',
            name: '高净值客户净创收',
            order: 2,
            pid: 'FSP_HIGH_SERVICE_KPI_MGR_QUERY',
            url: '/acrmbi/login?menuId=01013&iv-user=#[userCode]&theme=acrm',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_HIGH_SERVICE_KPI_MGR_ASSETS',
            name: '高净值客户资产变动',
            order: 3,
            pid: 'FSP_HIGH_SERVICE_KPI_MGR_QUERY',
            url: '/acrmbi/login?menuId=01015&iv-user=#[userCode]&theme=acrm',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_HIGH_SERVICE_KPI_MGR_EFFECTIVENESS',
            name: '高净值客户信息有效性',
            order: 4,
            pid: 'FSP_HIGH_SERVICE_KPI_MGR_QUERY',
            url: '/acrmbi/login?menuId=01026&iv-user=#[userCode]&theme=acrm',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_HIGH_SERVICE_KPI_MGR_APPLICATION',
            name: '理财平台应用情况统计',
            order: 5,
            pid: 'FSP_HIGH_SERVICE_KPI_MGR_QUERY',
            url: '/acrmbi/login?menuId=01021&iv-user=#[userCode]&theme=acrm',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
        ],
      },
      {
        id: 'FSP_HIGH_SERVICE_KPI',
        name: '高净值绩效部门查询',
        order: 3,
        pid: 'FSP_STATISTICAL_QUERY',
        url: '',
        type: 'menu',
        action: '',
        path: '',
        children: [
          {
            id: 'FSP_HIGH_SERVICE_KPI_DEPT',
            name: '高净值客户服务绩效',
            order: 1,
            pid: 'FSP_HIGH_SERVICE_KPI',
            url: '/acrmbi/login?menuId=01016&iv-user=#[userCode]&theme=acrm',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_HIGH_SERVICE_KPI_DEPT_APPLICATION',
            name: '理财平台应用情况统计',
            order: 2,
            pid: 'FSP_HIGH_SERVICE_KPI',
            url: '/acrmbi/login?menuId=01020&iv-user=#[userCode]&theme=acrm',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_HIGH_SERVICE_KPI_DEPT_ASSETS',
            name: '高净值客户资产变动',
            order: 3,
            pid: 'FSP_HIGH_SERVICE_KPI',
            url: '/acrmbi/login?menuId=01014&iv-user=#[userCode]&theme=acrm',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_HIGH_SERVICE_KPI_DEPT_EFFECTIVENESS',
            name: '高净值客户信息有效性',
            order: 4,
            pid: 'FSP_HIGH_SERVICE_KPI',
            url: '/acrmbi/login?menuId=01025&iv-user=#[userCode]&theme=acrm',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_HIGH_SERVICE_KPI_DEPT_INFO',
            name: '高净值客户信息完善率',
            order: 5,
            pid: 'FSP_HIGH_SERVICE_KPI',
            url: '/acrmbi/login?menuId=12106&iv-user=#[userCode]&theme=acrm',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
          {
            id: 'FSP_HIGH_SERVICE_KPI_DEPT_REVENUE',
            name: '高净值客户净创收',
            order: 6,
            pid: 'FSP_HIGH_SERVICE_KPI',
            url: '/acrmbi/login?menuId=01011&iv-user=#[userCode]&theme=acrm',
            type: 'link',
            action: 'loadExternSystemPage',
            path: '',
          },
        ],
      },
      {
        id: 'FSP_MOT_M_EXECUTE_STATISTICS',
        name: 'MOT执行情况报表',
        order: 4,
        pid: 'FSP_STATISTICAL_QUERY',
        url: '/acrmbi/login?menuId=10011&iv-user=#[userCode]',
        type: 'link',
        action: 'loadExternSystemPage',
        path: '',
      },
      {
        id: 'FSP_PRODUCT_SALE_APPROPRIATE_DEPT',
        name: '产品销售适当性查询',
        order: 5,
        pid: 'FSP_STATISTICAL_QUERY',
        url: '/acrmbi/login?iv-user=#[userCode]&theme=acrm&menuId=',
        type: 'link',
        action: 'loadExternSystemPage',
        path: '',
      },
      {
        id: 'FSP_MOT_M_SVRTASK_STATISTICS',
        name: '服务类任务统计',
        order: 6,
        pid: 'FSP_STATISTICAL_QUERY',
        url: '/acrmbi/login?iv-user=#[userCode]&theme=acrm&menuId=01012&org_id=#[orgCode]',
        type: 'link',
        action: 'loadExternSystemPage',
        path: '',
      },
      {
        id: 'FSP_IB_REPORT',
        name: '期货IB业务适当性报表',
        order: 7,
        pid: 'FSP_STATISTICAL_QUERY',
        url: '/ibReport/main',
        type: 'link',
        action: 'loadExternSystemPage',
        path: '',
      },
      {
        id: 'FSP_TGINVEST_STATISTICS',
        name: '投资专项报表（部门统计）',
        order: 8,
        pid: 'FSP_STATISTICAL_QUERY',
        url: '/acrmbi/login?iv-user=#[userCode]&menuId=01041',
        type: 'link',
        action: 'loadExternSystemPage',
        path: '',
      },
      {
        id: 'FSP_TGINVEST_CONTRACT',
        name: '投资专项报表（服务管理）',
        order: 9,
        pid: 'FSP_STATISTICAL_QUERY',
        url: '/acrmbi/login?iv-user=#[userCode]&menuId=01042',
        type: 'link',
        action: 'loadExternSystemPage',
        path: '',
      },
      {
        id: 'FSP_MOT_M_SERVICE_STATISTICS',
        name: 'MOT服务统计',
        order: 10,
        pid: 'FSP_STATISTICAL_QUERY',
        url: '/mot/statistics/showList',
        type: 'link',
        action: 'loadInTab',
        path: '/fsp/statisticalQuery/MOTStatistics',
      },
      {
        id: 'FSP_LOYALTY_ORDER',
        name: '积分兑换产品历史查询报表',
        order: 11,
        pid: 'FSP_STATISTICAL_QUERY',
        url: '',
        type: 'link',
        action: 'loadInTab',
        path: '/statisticalQuery/exchange',
      },
    ],
  },
  {
    id: 'FSP_SYS_OPERATE',
    name: '运维管理',
    order: 9,
    pid: 'ROOT',
    url: '',
    type: 'menu',
    action: '',
    path: '',
    children: [
      {
        id: 'FSP_SYSTEM_MANAGE_PARAMETER',
        name: '平台参数设置',
        order: 1,
        pid: 'FSP_SYS_OPERATE',
        url: '',
        type: 'link',
        action: '',
        path: '/sysOperate/platformParameterSetting',
      },
      {
        id: 'FSP_ORGAN_PERSONAL_MANAGE',
        name: '组织和人员管理',
        order: 2,
        pid: 'FSP_SYS_OPERATE',
        url: '',
        type: 'menu',
        action: '',
        path: '/crossDepartment',
        children: [
          {
            id: 'FSP_CROSS_DEPARTMENT',
            name: '分公司人工划转',
            order: 1,
            pid: 'FSP_ORGAN_PERSONAL_MANAGE',
            url: '',
            type: 'link',
            action: 'loadInTab',
            path: '/sysOperate/crossDepartment/filialeCustTransfer',
          },
          {
            id: 'FSP_REPORT_RELATION',
            name: '汇报关系树管理',
            order: 2,
            pid: 'FSP_ORGAN_PERSONAL_MANAGE',
            url: '',
            type: 'link',
            action: 'loadInTab',
            path: '/sysOperate/crossDepartment/relation',
          },
          {
            id: 'FSP_MAIN_POSTN_MANAGE',
            name: '服务经理主职位管理',
            order: 3,
            pid: 'FSP_ORGAN_PERSONAL_MANAGE',
            url: '',
            type: 'link',
            action: 'loadInTab',
            path: '/sysOperate/crossDepartment/mainPosition',
          },
        ],
      },
      {
        id: 'FSP_ADVISOR_MOBILE_BINDING',
        name: '公务手机管理',
        order: 3,
        pid: 'FSP_SYS_OPERATE',
        url: '',
        type: 'link',
        action: '',
        path: '/sysOperate/telephoneNumberManage',
      },
      {
        id: 'FSP_CUST_COMPLAINT_MANGER',
        name: '投诉工单管理',
        order: 4,
        pid: 'FSP_SYS_OPERATE',
        url: '/custcomplaint/manage/listContent',
        type: 'link',
        action: 'loadInTab',
        path: '/fsp/sysOperate/custcomplaint',
      },
    ],
  },
];

export default primaryMenu;
