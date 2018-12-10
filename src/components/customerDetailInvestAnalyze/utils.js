import _ from 'lodash';

// 过滤图标数据,获取指定key的数据
function filterData(data, key) {
  const reportData = [];
  if (_.isArray(data)) {
    data.forEach((item) => {
      reportData.push(item[key]);
    });
  }
  return reportData;
}

// 图表x轴数据不需要展示日期的年份
function filterXAxisDate(data) {
  return _.map(data, item => item.substr(5));
}

// 将指标名称,指标索引和指标值合并起来，用于在渲染指标名称的时候使用echart的formatter属性
function composeIndicatorAndData(indicators, data) {
  // 找出最大和最小值，并且分别设置雷达图上的最大和最小值区间范围，以便图表展示合理
  let max = Math.max(...data);
  const min = Math.min(...data);
  if (max === min && max === 0) {
    // 如果max和min都是0的时候
    max = 10;
  }
  return _.map(indicators, (indicator, index) => {
    const { name } = indicator;
    const value = data[index];
    return {
      name: `${name}|${index}|${value}`,
      max: max * 1.1,
      min: -(max * 0.5),
      color: '#666',
    };
  });
}

export {
  filterData,
  filterXAxisDate,
  composeIndicatorAndData,
};
