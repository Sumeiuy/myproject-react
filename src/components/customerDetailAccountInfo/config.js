/*
 * @Author: sunweibin
 * @Date: 2018-10-11 18:37:20
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-12 12:24:31
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
export const RADAR_OPTIONS = {
  radar: {
    radius: '70%',
    center: ['40%', '50%'],
    name: {
      textStyle: {
        color: '#108ee9',
        borderRadius: 3,
        padding: [3, 5]
      },
      formatter: function (value) {
        return '{name|' + value + '}\n' + '{value|1000}';
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
    indicator: [
      { name: '销售', max: 6500},
      { name: '管理', max: 16000},
      { name: '信息技术', max: 30000},
      { name: '客服', max: 38000},
      { name: '研发', max: 52000},
      { name: '市场', max: 25000}
    ]
  },
  series: [{
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
    },
    data : [
      {
        value : [4300, 10000, 28000, 35000, 50000, 19000],
        name : '资产分布'
      }
    ]
  }]
};
