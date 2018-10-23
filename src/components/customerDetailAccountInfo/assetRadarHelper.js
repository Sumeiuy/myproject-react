/*
 * @Author: sunweibin
 * @Date: 2018-10-12 15:08:16
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-22 16:39:54
 * @description 资产分布的雷达图数据处理相关的辅助函数
 */
import _ from 'lodash';

import { RADAR_MUST_DISPLAY_INDICATORS } from './config';

// 将指标名称,指标索引和指标值合并起来，用于在渲染指标名称的时候使用echart的formatter属性
export function composeIndicatorAndData(indicators, data) {
  // 找出最大和最小值，并且分别设置雷达图上的最大和最小值区间范围，以便图表展示合理
  let max = Math.max(...data);
  return _.map(indicators, (indicator, index) => {
    const { name } = indicator;
    const value = data[index];
    return {
      name: `${name}|${index}|${value}`,
      max: max * 1.1,
      min: - (max * 0.5),
    };
  });
};

// 根据需求当除了现金、股票、债券、理财、基金五项指标之外的指标，
// 如果其指标值为 0 的话，则不展示该指标值
export function pickRadarDisplayData(data) {
  return _.filter(data, item => {
    const { key, value } = item;
    return value !== 0 || _.includes(RADAR_MUST_DISPLAY_INDICATORS, key);
  });
}
