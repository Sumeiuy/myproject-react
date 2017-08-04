/*
* @Author: LiuJianShu
* @Date:   2017-04-26 11:17:08
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-08-03 15:41:35
*/

const optionsMap = {
  // 头部查询条件
  headBar: [
    {
      key: 'invest',
      name: '投顾业绩汇总',
      url: '/invest',
    },
    {
      key: 'business',
      name: '经营业绩汇总',
      url: '/business',
    },
  ],
  // 时间选择
  time: [
    {
      key: 'beforeLastMonth',
      name: '上上月',
    },
    {
      key: 'lastMonth',
      name: '上月',
    },
    {
      key: 'month',
      name: '本月',
    },
    {
      key: 'quarter',
      name: '本季',
    },
    {
      key: 'year',
      name: '本年',
    },
  ],
  historyTime: [
    {
      key: 'month',
      name: '本月',
    },
    {
      key: 'quarter',
      name: '本季',
    },
    {
      key: 'year',
      name: '本年',
    },
    {
      key: 'lastMonth',
      name: '上月',
    },
    {
      key: 'lastQuarter',
      name: '上季',
    },
    {
      key: 'lastYear',
      name: '去年',
    },
  ],
  compare: [
    {
      key: 'YoY',
      name: '同比',
    },
    {
      key: 'MoM',
      name: '环比',
    },
  ],
  visibleBoardType: {
    ordinary: {
      key: 'ordinary',
      name: '普通看板',
    },
    history: {
      key: 'history',
      name: '历史对比看板',
    },
    manage: {
      key: 'manage',
      name: '看板管理',
    },
  },
  // 按类别排序
  sortByType: {
    TYPE_TGJX: [
      {
        scope: '2',
        name: '分公司',
      },
      {
        scope: '3',
        name: '营业部',
      },
      {
        scope: '4',
        name: '投顾',
      },
    ],
    TYPE_JYYJ: [
      {
        scope: '2',
        name: '分公司',
      },
      {
        scope: '3',
        name: '营业部',
      },
      {
        scope: '4',
        name: '服务经理',
      },
    ],
  },
  // 按顺序排序
  sortByOrder: [
    {
      key: 'desc',
      name: '自高到低',
    },
    {
      key: 'asc',
      name: '自低到高',
    },
  ],
  showType: [
    {
      key: '1',
      type: 'tables',
      title: '表格视图',
      active: 'active',
    },
    {
      key: '2',
      type: 'zhuzhuangtu',
      title: '柱状图',
      active: '',
    },
  ],
};

export default optionsMap;
