/**
 * by xuxiaoqin
 * ConstructScatterOptions.js
 */
export default {};

export const constructScatterOptions = (option = {}) => {
  const {
    startCoord,
    endCoord,
    pointerData,
    xAxisMin,
    xAxisMax,
    yAxisMin,
    yAxisMax,
  } = option;

  const markLineOpt = {
    animation: false,
    // 不响应鼠标事件
    silent: true,
    lineStyle: {
      normal: {
        type: 'solid',
        color: '#ffcb77',
      },
    },
    data: [[{
      coord: startCoord,
      symbol: 'none',
    }, {
      coord: endCoord,
      symbol: 'none',
    }]],
  };

  const scatterOptions = {
    grid: [
      { x: '12%', y: '-10%', width: '75%', height: '90%' },
      { x2: '10%', y2: '10%', width: '75%', height: '90%' },
    ],
    tooltip: {
      show: false,
      formatter: '',
    },
    xAxis: {
      gridIndex: 0,
      min: xAxisMin,
      max: xAxisMax,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        showMinLabel: false,
        show: true,
        textStyle: {
          color: '#777777',
          fontSize: 12,
        },
      },
      boundaryGap: false,
      // 不一定从零刻度开始
      scale: true,
    },
    yAxis: {
      gridIndex: 0,
      min: yAxisMin,
      max: yAxisMax,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#777777',
          fontSize: 12,
        },
      },
      splitLine: {
        lineStyle: {
          color: '#eeeeee',
        },
      },
      boundaryGap: false,
      scale: true,
    },
    series: [
      {
        name: 'I',
        type: 'scatter',
        data: pointerData,
        markLine: markLineOpt,
        itemStyle: {
          normal: {
            show: true,
            color: '#57b0f0',
          },
          emphasis: {
            show: true,
            color: 'rgb(56, 216, 232)',
            shadowColor: 'rgb(56, 216, 232)',
            shadowBlur: 15,
          },
        },
        symbol: 'circle',
        symbolSize: 15,
        // symbolSize: item => Math.sqrt(item[1]) / 0.5,
      },
    ],
  };

  return scatterOptions;
};
