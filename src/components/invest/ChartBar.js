/**
 * @fileOverview components/invest/ChartBar.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { autobind } from 'core-decorators';

import { iconTypeMap } from '../../config';
import Icon from '../common/Icon';
import styles from './ChartBar.less';

import imgSrc from './noChart.png';

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

// 柱状图的阴影
const barShadow = {
  type: 'bar',
  itemStyle: {
    normal: {
      color: 'rgba(0,0,0,0.05)',
    },
  },
  barGap: '-100%',
  barCategoryGap: '30%',
  animation: false,
};

export default class ChartBar extends PureComponent {

  static propTypes = {
    level: PropTypes.string,
    chartData: PropTypes.object,
    iconType: PropTypes.string,
  }

  static defaultProps = {
    level: '1',
    chartData: {},
    iconType: 'zichan',
  }

  @autobind
  getChartData(orgModel, key) {
    const yAxisLabels = [];
    orgModel.forEach((item) => {
      if (item[key] === null || item[key] === 'null') {
        yAxisLabels.push(0);
      } else {
        yAxisLabels.push(item[key]);
      }
    });
    return yAxisLabels;
  }

  @autobind
  createBarLinear(input) {
    const output = [];
    input.forEach((item) => {
      const bar = {
        name: 'no',
        value: item,
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgb(136,214,254)',
              }, {
                offset: 1, color: 'rgb(24,141,240)',
              }],
            },
          },
        },
      };
      output.push(bar);
    });
    return output;
  }

  @autobind
  createNewSeriesData(series, medianValue, unit) {
    return series.map(item => ({
      value: unit === '%' ? (Number(item) * 100).toFixed(2) : item,
      label: {
        normal: {
          show: true,
          position: medianValue > item ? 'right' : 'insideRight',
        },
      },
    }));
  }

  render() {
    // const { chartData } = this.props;
    const { chartData: { name, unit, key, orgModel = [] }, level } = this.props;

    const levelName = `level${parseInt(level, 10) + 1}Name`;
    // 此处为y轴刻度值
    const yAxisLabels = this.getChartData(orgModel, levelName);
    // 此处为数据
    const seriesData = this.getChartData(orgModel, 'value');
    const seriesDataLen = seriesData.length;
    // 数据中最大的值
    const xMax = Math.max(...seriesData);
    // 图表边界值
    const gridXAxisMax = xMax * 1.1;
    // 计算出所有值的中间值
    const medianValue = gridXAxisMax / 2;
    // 需要针对不同的值编写不同的柱状图Label样式
    const newSeriesData = this.createNewSeriesData(seriesData, medianValue, unit);
    // 柱状图阴影
    const dataShadow = [];
    for (let i = 0; i < seriesDataLen; i++) {
      dataShadow.push(gridXAxisMax);
    }

    // tooltip 配置项
    const tooltipOtions = {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter(params) {
        return `${params[1].axisValue}<br /> ${params[1].seriesName}: <span style="color:#f8ac59; font-size: 15px;">${params[1].data.value}</span>${unit}`;
      },
      backgroundColor: 'rgba(0, 0, 0, .56)',
      padding: [12, 11, 13, 13],
      extraCssText: 'border-radius: 8px',
    };
    // eCharts的配置项
    const options = {
      color: [barColor],
      tooltip: {
        ...tooltipOtions,
      },
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
        max: gridXAxisMax,
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
        axisLabel: {
          ...AxisOptions.axisLabel,
          formatter(value) {
            if (value.length > 4) {
              return value.substr(0, 4);
            }
            return value;
          },
        },
        data: yAxisLabels,
      },
      series: [
        {
          ...barShadow,
          data: dataShadow,
        },
        {
          name,
          type: 'bar',
          silent: true,
          label: {
            normal: {
              show: false,
            },
          },
          data: newSeriesData,
        },
      ],
    };

    return (
      <div className={styles.chartMain}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <Icon type={iconTypeMap[key]} className={styles.chartTiltleTextIcon} />
            <span className={styles.chartTitleText}>{name}</span>
          </div>
        </div>
        <div className={styles.chartWrapper}>
          {
            orgModel.length ?
              <ReactEcharts
                option={options}
                style={{
                  height: '290px',
                }}
              />
            :
              <div className={styles.noChart}>
                <img src={imgSrc} alt="图表不可见" />
              </div>
          }
        </div>
      </div>
    );
  }
}
