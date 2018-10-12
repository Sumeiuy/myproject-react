/*
 * @Author: sunweibin
 * @Date: 2018-10-11 18:37:20
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-12 15:57:03
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

// 资产分布雷达图配置
export const CHART_RADAR_OPTIONS = {
  radius: '70%',
  center: ['40%', '50%'],
  name: {
    textStyle: {
      color: '#108ee9',
      borderRadius: 3,
      padding: [3, 5]
    },
    formatter: function (name) {
      // 此时的name中含有了指标的值,并且是用|分割
      const nameLable = name.split('|');
      return `{name|${nameLable[0]}}\n{value|${nameLable[1]}}`;
    },
    rich: {
      name: {
        color:'#108ee9',
        lineHeight: 14,
        fontSize: 12,
        align: 'center',
      },
      value: {
        color: '#333333',
        lineHeight: 14,
        align: 'center',
        fontSize: 12,
      },
    },
  },
  nameGap: 0,
  axisLine: {
    show: false,
  },
  splitNumber: 3,
  splitArea: {
    show: false,
  },
};

export const CHART_SERIES_OPTIONS = {
  type: 'radar',
  itemStyle: {
    normal: {
      opacity: 0,
    },
  },
  lineStyle: {
    normal: {
      color: '#f8af87',
    },
  },
  areaStyle: {
    normal: {
      color: '#ffede2',
      opacity: 1,
    },
  }
};
