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
      key: 'season',
      name: '本季',
    },
    {
      key: 'year',
      name: '本年',
    },
  ],
  // 按类别排序
  sortBytype: [
    {
      key: '1',
      name: '按分公司',
    },
    {
      key: '2',
      name: '按营业部',
    },
  ],
  // 按顺序排序
  sortByOrder: [
    {
      key: '1',
      name: '自高到低',
    },
    {
      key: '2',
      name: '自低到高',
    },
  ],
};

export default optionsMap;
