/*
 * @Author: sunweibin
 * @Date: 2018-10-12 15:08:16
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 19:20:46
 * @description 资产分布的雷达图数据处理相关的辅助函数
 */
import _ from 'lodash';

// 将指标名称,指标索引和指标值合并起来，用于在渲染指标名称的时候使用echart的formatter属性
export function composeIndicatorAndData(indicators, data) {
  // 用于渲染雷达图的值
  const renderValue = _.map(data, item => item.value);
  // 找出最大和最小值，并且分别设置雷达图上的最大和最小值区间范围，以便图表展示合理
  let max = Math.max(...renderValue);
  let min = Math.min(...renderValue);
  if (max === 0) {
    max = 10;
  }
  if (min === 0) {
    min = -10;
  }
  return _.map(indicators, (indicator, index) => {
    const { name } = indicator;
    const value = data[index].formatedValue || 0;
    const unit = data[index].unit;
    return {
      name: `${name}|${index}|${value}${unit}`,
      max: max * 1.1,
      min: min * 0.9,
    };
  });
};
