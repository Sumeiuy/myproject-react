/*
 * @Author: zuoguangzu
 * @Date: 2018-12-05 11:29:05
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-12-07 15:50:07
 * @description 个股收益明细图表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import IECharts from '../../IECharts';
import styles from './incomeDetailChart.less';

export default class IncomeDetailChart extends PureComponent {
  static propTypes = {
    incomeChartData: PropTypes.array.isRequired,
  }

  // 图表配置项
  @autobind
  getChartOption() {
    const { incomeChartData } = this.props;
    const incomeChartDataOrder = incomeChartData.reverse();
    const newIncomeChartData = _.map(incomeChartDataOrder, (item) => {
      if (item > 0) {
        return {
          value: item,
          label: {
            normal: {
              position: 'right'
            }
          }
        };
      }
      return {
        value: item,
        label: {
          normal: {
            position: 'left'
          }
        }
      };
    });
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
              color: (item) => {
                const colorList = ['#ed3e1e', '#50a116'];
                if (item.value >= 0) {
                  return colorList[0];
                }
                return colorList[1];
              }
            }
          },
          data: newIncomeChartData,
        },
      ]
    };
    return option;
  }

  render() {
    // 图表配置项
    const option = this.getChartOption();
    return (
      <div className={styles.incomeDetailChart}>
        <IECharts
          option={option}
        />
      </div>
    );
  }
}
