/*
 * @Author: XuWenKang
 * @Description: 精选组合页面配置项
 * @Date: 2018-04-26 19:55:31
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-27 19:23:57
*/

export default {
  // 趋势图tab
  chartTabList: [
    {
      label: '近3个月',
      key: '3',
    },
    {
      label: '近一年',
      key: '12',
    },
    {
      label: '全部',
      key: 'all',
    },
  ],
  // 收益率排序
  yieldRankList: [
    {
      show: true,
      value: '1',
      label: '近7天收益率',
      showNameKey: 'weekEarnings',
    },
    {
      show: true,
      value: '2',
      label: '近30天收益率',
      showNameKey: 'monthEarnings',
    },
    {
      show: true,
      value: '3',
      label: '当年收益率',
      showNameKey: 'yearEarnings',
    },
    {
      show: true,
      value: '4',
      label: '累计收益率',
      showNameKey: 'totalEarnings',
    },
  ],
  // 筛选默认值
  riskDefaultItem: {
    key: 'all',
    value: 'all',
    label: '全部',
  },
};
