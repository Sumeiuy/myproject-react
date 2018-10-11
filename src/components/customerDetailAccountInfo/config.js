/*
 * @Author: sunweibin
 * @Date: 2018-10-11 18:37:20
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-11 19:44:27
 * @description 新版客户360详情的账户信息Tab下页面的配置项
 */

// 表格滚动的配置
export const TABLE_SCROLL_SETTING = { x: 400, y: 220 };

export const dataSource = [
  {
    name: '制造',
    key: 'PA020200',
    value: 1020513,
    percent: 0.485,
    profit: 5478922,
    profitPercent: 3,
    children: [
      {
        name: '2011 某某证券',
        key: 'PA020300',
        value: 80419039,
        percent: 0.98,
        profit: 3666560,
        profitPercent: -48
      },
      {
        name: '2011 某某证券',
        key: 'PA020300',
        value: 38507820,
        percent: 0.4,
        profit: 5173734,
        profitPercent: 269
      }
    ]
  }
];
