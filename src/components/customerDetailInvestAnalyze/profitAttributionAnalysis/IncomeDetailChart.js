/*
 * @Author: zuoguangzu
 * @Date: 2018-12-05 11:29:05
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-12-11 16:35:53
 * @description 个股收益明细图表
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import IECharts from '../../IECharts';
import styles from './incomeDetailChart.less';

// 图表配置项
function getChartOption(value) {
  const incomeChartDataOrder = value.reverse();
  // 累计盈利额大于等于0时候数字展示在右边，小于0展示在左边
  const newIncomeChartData = _.map(incomeChartDataOrder, item => ({
    value: item,
    label: {
      normal: {
        position: item > 0 ? 'right' : 'left'
      }
    }
  }));
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      containLabel: true,
      left: 0,
      top: 38,
      bottom: 0,
    },
    xAxis: [
      {
        type: 'value',
        show: false,
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: []
      }
    ],
    series: [
      {
        name: '利润',
        type: 'bar',
        label: {
          normal: {
            show: true,
            color: '#333',
            fontSize: 14,
          }
        },
        itemStyle: {
          normal: {
            color: item => (item.value >= 0 ? '#ed3e1e' : '#50a116')
          }
        },
        data: newIncomeChartData,
      },
    ]
  };
  return option;
}
export default function IncomeDetailChart(props) {
  const { incomeChartData } = props;
  return (
    <div className={styles.incomeDetailChart}>
      <IECharts
        option={getChartOption(incomeChartData)}
        style={{
          height: '438px',
        }}
      />
    </div>
  );
}
IncomeDetailChart.propTypes = {
  incomeChartData: PropTypes.array.isRequired,
};
