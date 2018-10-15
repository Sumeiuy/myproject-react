/*
 * @Author: sunweibin
 * @Date: 2018-10-11 18:37:20
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-15 12:24:43
 * @description 新版客户360详情的账户信息Tab下页面的配置项
 */

// 表格滚动的配置
export const TABLE_SCROLL_SETTING = { x: 400, y: 220 };

// 资产分布雷达图配置
export const CHART_RADAR_OPTIONS = {
  radius: '65%',
  center: ['40%', '50%'],
  name: {
    textStyle: {
      color: '#108ee9',
      borderRadius: 3,
      padding: [3, 5]
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
      hightLightName: {
        fontSize: 16,
        lineHeight: 18,
        color: '#e75806',
      },
      hightLightValue: {
        fontSize: 14,
        lineHeight: 16,
        color: '#333',
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
  triggerEvent: true,
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
