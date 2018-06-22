/**
 * @Descripter: 客户列表排序
 * @Author: K0170179
 * @Date: 2018/6/7
 */

// 升序降序的方向值
const DESC = 'desc'; // 降序
const ASC = 'asc'; // 升序

const reorder = [
  {
    sortType: 'Aset',
    name: '总资产',
    sortDirections: [ASC, DESC],
    defaultDirections: DESC,
  },
  {
    sortType: 'OpenDt',
    name: '开户时间',
    sortDirections: [ASC, DESC],
    defaultDirections: DESC,
  },
  {
    sortType: 'Fee',
    name: '佣金率',
    sortDirections: [ASC, DESC],
    defaultDirections: DESC,
  },
];

export default reorder;
