/**
 * @fileOverview components/invest/ChartBar.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { autobind } from 'core-decorators';

import styles from './ChartBar.less';

// Y轴通用样式
const AxisOptions = {
  axisLine: {
    lineStyle: {
      color: '#e7eaec',
    },
  },
  axisTick: {
    show: false,
  },
  axisLabel: {
    textStyle: {
      color: '#999',
    },
  },
};

// eCharts图表表格基础样式
const gridOptions = {
  show: true,
  top: '0',
  left: '0',
  right: '40px',
  bottom: '20px',
  containLabel: true,
  borderWidth: '1',
  borderColor: '#e7eaec',
};
// 柱状图颜色
const barColor = '#4bbbf4';

export default class ChartBar extends PureComponent {

  static propTypes = {
    chartData: PropTypes.object,
  }

  static defaultProps = {
    chartData: {},
  }

  @autobind
  getChartData(data, key) {
    const yAxisLabels = [];
    data.forEach(item => yAxisLabels.push(item[key]));
    return yAxisLabels;
  }

  render() {
    const { chartData: { title, unit, data = [] } } = this.props;
    const yAxisLabels = this.getChartData(data, 'name');
    const seriesData = this.getChartData(data, 'value');

    const options = {
      color: [barColor],
      grid: {
        ...gridOptions,
      },
      xAxis: {
        type: 'value',
        name: unit,
        nameGap: '8',
        nameTextStyle: {
          color: '#999',
        },
        ...AxisOptions,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e7eaec',
          },
        },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        ...AxisOptions,
        data: yAxisLabels,
      },
      series: {
        name: title,
        type: 'bar',
        silent: true,
        label: {
          normal: {
            show: true,
            position: 'insideRight',
          },
        },
        data: seriesData,
      },
    };

    return (
      <div>
        <div className={styles.chartTitle}>
          <div className={styles.chartTitleText}>{title}</div>
          <div className={styles.seeIcon}>
            1
          </div>
        </div>
        <div className={styles.chartWrapper}>
          <ReactEcharts
            option={options}
            style={{
              height: '290px',
            }}
          />
        </div>
      </div>
    );
  }
}
