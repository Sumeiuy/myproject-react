/**
 * @file config/fspRoutes.js
 *  路由和請求的url之間的映射表
 * @author zhufeiyang
 */

const fspRoutes = [
  // 任务中心
  {
    path: 'motTask',
    url: '/mot/manage/showMotTaskSubTabWin?taskType=MOT',
  },
  {
    path: 'selfbuildTask',
    url: '/mot/selfbuildTask/selfBuildTaskMain',
  },
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
    url: 'customer/manage/showCustManageTabWin',
  },
  {
    path: 'customerDetail',
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
  // 资产配置
  {
    path: 'mainTab',
    url: '/asset/basis/mainTab',
  },
  {
    path: 'implementation',
    url: '/asset/implementation/main',
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

  // 信用业务
  /*   {
      path: 'postApplyManage',
      url: '/cbs/login?defaultTargetUrl=/cbspages/postnApplyManage/postnApp',
    },
    {
      path: 'creditRequest',
      url: '/priProd/initmain',
    },
    {
      path: 'changeRequest',
      url: '/priProd/initmain',
    },
    {
      path: 'thought',
      url: '/priProd/initmain',
    },
    {
      path: 'projectInvest',
      url: '/priProd/initmain',
    },
    {
      path: 'projectScore',
      url: '/priProd/initmain',
    },
    {
      path: 'riskFollow',
      url: '/priProd/initmain',
    },
    {
      path: 'initialTrade',
      url: '/priProd/initmain',
    },
    {
      path: 'followingSearch',
      url: '/priProd/initmain',
    }, */

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
    path: 'messageCenter',
    url: '/messgeCenter',
  },
];

export default fspRoutes;

