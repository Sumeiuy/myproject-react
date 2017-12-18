// import _ from 'lodash';

export default {};

export const constructPieOptions = (options) => {
  const { renderTooltip, level1Data, level2Data } = options;

  return {
    tooltip: {
      trigger: 'item',
      formatter: params => renderTooltip(params),
      position: 'right',
    },
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
        // 高亮扇区的偏移距离
        hoverOffset: 5,
      },
    ],
  };
};

