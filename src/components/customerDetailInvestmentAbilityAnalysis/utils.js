import _ from 'lodash';

// 过滤图标数据,获取指定key的数据
function filterData(data, key) {
  let reportData = [];
  if (_.isArray(data)) {
    data.forEach(item => {
      reportData.push(item[key]);
    });
  }
  return reportData;
}

// 图表x轴数据不需要展示日期的年份
function filterXAxisDate(data) {
  return _.map(data, item => item.substr(5));
}

export {
  filterData,
  filterXAxisDate,
};
