export default function constructPieOptions(options) {
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
        // [
        //   {
        //     value: 335,
        //     name: '直达',
        //     children: [
        //       {
        //         value: 335,
        //         name: '直达方式',
        //       },
        //     ],
        //   },
        //   { value: 679, name: '营销广告' },
        //   { value: 1548, name: '搜索引擎' },
        // ],
        color: ['#4897f1', '#23d8f2', '#756fb8'],
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
        // [
        //   {
        //     value: 335,
        //     name: '直达方式',
        //     parent: {
        //       value: 335, name: '直达',
        //     },
        //   },
        //   { value: 310, name: '邮件营销' },
        //   { value: 234, name: '联盟广告' },
        //   { value: 135, name: '视频广告' },
        //   { value: 1048, name: '百度' },
        //   { value: 251, name: '谷歌' },
        //   { value: 147, name: '必应' },
        //   { value: 102, name: '其他' },
        // ],
        color: ['#a7effa', '#7be8f7', '#23d8f2', '#c0bbff', '#948de9', '#756fb8', '#a3cbf8', '#4897f1'],
        // 高亮扇区的偏移距离
        hoverOffset: 5,
      },
    ],
  };
}
