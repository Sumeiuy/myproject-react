/**
 * @file config/menu.js
 *  侧边栏菜单配置
 * @author maoquan(maoquan@htsc.com)
 */

import _ from 'lodash';

const menus = [
  {
    key: 'customerPool',
    path: 'customerPool',
    name: '首页',
    default: true,
    child: [
      {
        key: 'viewpointDetail',
        path: 'viewpointDetail',
        name: '视图详情',
      },
      {
        key: 'viewpointList',
        path: 'viewpointList',
        name: '视图列表',
      },
      {
        key: 'todo',
        path: 'todo',
        name: '代办事项',
      },
      {
        key: 'list',
        path: 'list',
        name: '列表详情',
      },
      {
        key: 'customerGroup',
        path: 'customerGroup',
        name: '客户分组',
      },
      {
        key: 'createTask',
        path: 'createTask',
        name: '创建任务',
      },
      {
        key: 'taskFlow',
        path: 'taskFlow',
        name: '任务流程',
      },
      {
        key: 'serviceLog',
        path: 'serviceLog',
        name: '服务记录',
      },
    ],
  },
  {
    path: 'task',
    name: '任务中心',
    child: [
      {
        key: 'fspmotTask',
        path: 'fspmotTask',
        name: 'MOT任务',
      },
      {
        key: 'fspselfbuildTask',
        path: 'fspselfbuildTask',
        name: '自建任务管理',
      },
      {
        key: 'fspmotService',
        path: 'fspmotService',
        name: 'MOT服务统计',
      },
      {
        key: 'fspcustomerHistory',
        path: 'fspcustomerHistory',
        name: '客服全服务记录',
      },
      {
        key: 'fspibreport',
        path: 'fspibreport',
        name: '期货IB业务适当性报表',
      },
     /*  {
        key: 'externalLink1',
        path: 'externalLink1',
        name: 'MOT执行情况报表',
      }, */
     /*  {
        key: 'externalLink2',
        path: 'externalLink2',
        name: '产品销售适当性查询',
      }, */
    /*   {
        key: 'externalLink3',
        path: 'externalLink3',
        name: '服务类任务统计',
      }, */
    ],
  },
  {
    path: 'customerCenter',
    name: '客户中心',
    child: [
      {
        key: 'fsptest',
        path: 'fsptest',
        name: '小测试',
      },
      {
        key: 'fspinvestContract',
        path: 'fspinvestContract',
        name: '投资签约',
      },
      {
        key: 'fspcustomerManage',
        path: 'fspcustomerManage',
        name: '客户管理',
      },
      {
        key: 'fspcustomerDetail',
        path: 'fspcustomerDetail',
        name: '客户360视图-客户信息',
      },
      {
        key: 'customerGroupManage',
        path: 'customerGroupManage',
        name: '客户分组管理',
      },
    ],
  },
  {
    key: 'report',
    path: 'report',
    name: '绩效视图',
  },
  {
    path: 'asset',
    name: '资产配置',
    child: [
      {
        key: 'fspmainTab',
        path: 'fspmainTab',
        name: '基础配置',
      },
      {
        key: 'fspimplementation',
        path: 'fspimplementation',
        name: '资产配置实施',
      },
    ],
  },
  {
    path: 'appCenter',
    name: '产品中心',
    child: [
      {
        key: 'fspproductBase',
        path: 'fspproductBase',
        name: '金融产品库',
      },
      {
        key: 'fspcalendar',
        path: 'fspcalendar',
        name: '产品日历',
      },
    ],
  },
  {
    key: 'messageCenter',
    path: 'messageCenter',
    name: '消息中心',
  },
  {
    path: 'knowledges',
    name: '知识库',
    child: [
      {
        key: 'fspinitmain',
        path: 'fspinitmain',
        name: '专项业务知识',
      },
    ],
  },
  {
    path: 'custcomplaint',
    name: '客户投诉',
    child: [
      {
        key: 'fsplistContent',
        path: 'fsplistContent',
        name: '投诉工单管理',
      },
      {
        key: 'fsppending',
        path: 'fsppending',
        name: '工单处理',
      },
      {
        key: 'fspall',
        path: 'fspall',
        name: '工单查询',
      },
      {
        key: 'fspnew',
        path: 'fspnew',
        name: '工单创建',
      },
      {
        key: 'fspreport',
        path: 'fspreport',
        name: '工单统计',
      },
    ],
  },
  {
    path: 'bizapply',
    name: '业务申请',
    child: [
      {
        path: 'finance',
        name: '资金业务',
        child: [
          {
            key: 'fspexcessCache',
            path: 'fspexcessCache',
            name: '超额快取',
          },
          {
            key: 'fspappointDrawTab',
            path: 'fspappointDrawTab',
            name: '预约取款申请业务',
          },
          {
            key: 'fspappointBook',
            path: 'fspappointBook',
            name: '客户预约取现查询',
          },
        ],
      },
      {
        path: 'priReuqest',
        name: '适当性申请',
        child: [
          {
            key: 'fsppriProd',
            path: 'fsppriProd',
            name: '私募产品资格申请',
          },
          {
            key: 'fspappropriate',
            path: 'fsppriProd',
            name: '双录文件申请',
          },
        ],
      },
      {
        key: 'tunnel',
        name: '通道类业务',
        child: [
          {
            key: 'fsppbbiz',
            path: 'fsppbbiz',
            name: 'PB系统业务',
          },
        ],
      },
      {
        path: 'credit',
        name: '信用业务',
        child: [
          {
            key: 'fsppostApplyManage',
            path: 'fsppostApplyManage',
            name: '专项头寸申请',
          },
          {
            key: 'fspcreditRequest',
            path: 'fspcreditRequest',
            name: '授信申请',
          },
          {
            key: 'fspchangeRequest',
            path: 'fspchangeRequest',
            name: '利率调整申请',
          },
          {
            key: 'fspthought',
            path: 'fspthought',
            name: '意向申报评估',
          },
          {
            key: 'fspprojectInvest',
            path: 'fspprojectInvest',
            name: '项目尽职调查',
          },
          {
            key: 'fspprojectScore',
            path: 'fspprojectScore',
            name: '项目评审',
          },
          {
            key: 'fspfollowingSearch',
            path: 'fspfollowingSearch',
            name: '贷后管理-跟踪调查管理',
          },
          {
            key: 'fspriskFollow',
            path: 'fspriskFollow',
            name: '风险持续跟踪与提示',
          },
          {
            key: 'fspinitialTrade',
            path: 'fspinitialTrade',
            name: '初始化交易申请',
          },
        ],
      },
      {
        path: 'option',
        name: '期权业务',
        child: [
          {
            key: 'fspoptionfund',
            path: 'fspoptionfund',
            name: '期权佣金申请业务',
          },
          {
            key: 'fspoptionResearch',
            path: 'fspoptionResearch',
            name: '股票期权评估申请',
          },
        ],
      },
      {
        key: 'permission',
        path: 'permission',
        name: '佣金调整',
        child: [
          {
            key: 'permissionEdit',
            path: 'edit',
            name: '佣金申请编辑',
          },
        ],
      },
      {
        key: 'contract',
        path: 'contract',
        name: '合约管理',
      },
      {
        key: 'channelsTypeProtocol',
        path: 'channelsTypeProtocol',
        name: '协议管理',
        child: [
          {
            key: 'edit',
            path: 'edit',
            name: '协议修订',
          },
        ],
      },
    ],
  },
  {
    key: 'feedback',
    path: 'feedback',
    name: '反馈管理',
  },
  {
    key: 'commissionChange',
    path: 'commissionChange',
    name: '合约调整',
  },
  {
    key: 'modal',
    path: 'modal',
    name: '模态框示例',
  },
  {
    key: 'preview',
    path: 'preview',
    name: '预览视图',
  },
  {
    key: 'report',
    path: 'history',
    name: '历史记录',
  },
  {
    key: 'report',
    path: 'boardManage',
    name: '绩效视图',
  },
  {
    key: 'boardEdit',
    path: 'boardEdit',
    name: '看板编辑',
  },
  {
    key: 'taskList',
    path: 'taskList',
    name: '任务列表',
  },
  {
    key: 'demote',
    path: 'demote',
    name: '零售非零售客户划转',
  },
  {
    key: 'filialeCustTransfer',
    path: 'filialeCustTransfer',
    name: '分公司客户划转',
  },
  {
    key: 'taskFeedback',
    path: 'taskFeedback',
    name: '任务反馈',
  },
  {
    key: 'relation',
    path: 'relation',
    name: '汇报关系树',
  },
];

export default menus;

export const getDefaultMenu = () => _.find(menus, item => !!item.default);

export const getDefaultMenus = () => _.filter(menus, item => !!item.default);
