/**
 * @description 历史排名图表通用配置
 * @author sunweibin
 */

const chartOptions = {
  // 堆叠柱状图使用的颜色
  stackBarColors: ['#e0695c', '#fcd459', '#69ddd5', '#508dc8', '#7cc9ec', '#b2dff4', '#ff7f50', '#ffa500', '#038387', '#00b294'],
  // 柱状图颜色
  barColor: '#4bbbf4',
  // y轴样式
  yAxis: {
    type: 'category',
    inverse: true,
    show: true,
    axisLabel: {
      show: false,
      textStyle: {
        color: '#999',
      },
    },
    axisTick: { show: false },
    axisLine: {
      onZero: true,
      lineStyle: {
        color: '#e7eaec',
      },
    },
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周末', '周1', '周2'],
  },
  // x轴样式
  xAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#e7eaec',
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#e7eaec',
      },
    },
    axisLabel: {
      textStyle: {
        color: '#999',
      },
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: '#e7eaec',
      },
    },
  },
  // 坐标轴样式
  grid: {
    show: false,
    top: '0',
    left: '20px',
    right: '40px',
    bottom: '20px',
    containLabel: false,
    borderWidth: '1',
    borderColor: '#e7eaec',
  },
  // 柱状图每一项用于提示名称，数值所在的项的样式
  itemInfo: {},
  // 柱状阴影
  barShadow: {
    type: 'bar',
    itemStyle: {
      normal: {
        color: 'rgba(0,0,0,0.05)',
      },
    },
    // barGap: '-100%',
    barGap: '0',
    barCategoryGap: '30%',
    animation: false,
    barWidth: '50%',
  },
};

export default chartOptions;
