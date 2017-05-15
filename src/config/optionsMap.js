/*
* @Author: LiuJianShu
* @Date:   2017-04-26 11:17:08
* @Last Modified by:   LiuJianShu
* @Last Modified time: 2017-04-26 15:35:45
*/

const optionsMap = {
  // 头部查询条件
  headBar: {
    key: 'invest',
    name: '投顾业绩汇总',
  },
  // 时间选择
  time: [
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
  // 按类别排序
  sortByType: [
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
