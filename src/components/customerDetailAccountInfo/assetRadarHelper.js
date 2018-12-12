/*
 * @Author: sunweibin
 * @Date: 2018-10-12 15:08:16
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-12 13:08:26
 * @description 资产分布的雷达图数据处理相关的辅助函数
 */
import _ from 'lodash';

// 将指标名称,指标索引和指标值合并起来，用于在渲染指标名称的时候使用echart的formatter属性
export function composeIndicatorAndData(indicators, data) {
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

// 因为需求要求资产分布的雷达图按照顺时针展示
// 但是实际上echarts的雷达图均是逆时针方向填写各个指标
// 因此需要配置指标的展示顺序
const indicatorsOrder = [
  { name: '开基', key: 'PA050000', isMust: true },
  { name: '权证', key: 'PA020000' },
  { name: '回购', key: 'PA080000' },
  { name: '债券', key: 'PA030000', isMust: true },
  { name: 'OTC', key: 'PA090000' },
  { name: '现金', key: '99', isMust: true },
  { name: '私募', key: 'PA100000' },
  { name: '理财', key: 'PA070000', isMust: true },
  { name: '股票', key: 'PA040000', isMust: true },
];

// 根据需求当除了现金、股票、债券、理财、基金五项指标之外的指标，
// 如果其指标值为 0 的话，则不展示该指标值
export function pickRadarDisplayData(data) {
  if (_.isEmpty(data)) {
    return [];
  }
  const orderedData = _.map(indicatorsOrder, (indicator) => {
    const { key } = indicator;
    const dataItem = _.find(data, item => item.key === key) || {};
    return {
      ...indicator,
      value: dataItem.value || 0,
    };
  });
  return _.filter(orderedData, (item) => {
    const { value, isMust = false } = item;
    return value !== 0 || isMust;
  });
}
