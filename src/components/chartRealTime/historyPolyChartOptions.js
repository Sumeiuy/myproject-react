/**
 * @description 历史对比折线图配置项
 * @author sunweibin
 */

const historyPolyChartOptions = {
  animation: true,
  xAxis: {
    type: 'time',
    splitLine: {
      show: false,
    },
    axisPointer: {
      snap: true,
      lineStyle: {
        color: '#004E52',
        opacity: 0.5,
        width: 2,
      },
      label: {
        show: false,
      },
      handle: {
        show: true,
        icon: 'circle',
        color: '#004E52',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisTick: {
      inside: true,
    },
    splitLine: {
      show: false,
    },
    z: 10,
  },
};

export default historyPolyChartOptions;
