export default {};

export const constructPieOptions = (options) => {
  const { renderTooltip, level1Data, level2Data } = options;
  return {
    tooltip: {
      trigger: 'item',
      // a系列名称
      // b数据项名称
      // c数值
      // d百分比
      formatter: params => renderTooltip(params),
      position: 'right',
    },
    // grid: {
    //   left: '10%',
    //   right: '10%',
    //   bottom: '10%',
    //   containLabel: true,
    // },
    series: [
      {
        key: 'level1',
        name: '一级反馈',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '45%'],
        selectedOffset: 0,
        label: {
          normal: {
            show: false,
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: level1Data,
        color: [
          'rgba(57,131,255,1)',
          'rgba(74,218,213,1)',
          'rgba(117,111,184,1)',
          'rgba(255,78,123,1)',
          'rgba(255,178,78,1)',
          'rgba(112,195,129,1)',
          'rgba(241,222,90,1)',
          'rgba(120,146,98,1)',
          'rgba(255,120,78,1)',
        ],
        // 高亮扇区的偏移距离
        hoverOffset: 5,
      },
      {
        key: 'level2',
        name: '二级反馈',
        type: 'pie',
        radius: ['59%', '80%'],
        label: {
          normal: {
            show: false,
          },
        },
        data: level2Data,
        color: ['#a7effa', '#7be8f7', '#23d8f2', '#c0bbff', '#948de9', '#756fb8', '#a3cbf8', '#4897f1'],
        // 高亮扇区的偏移距离
        hoverOffset: 5,
      },
    ],
  };
};

