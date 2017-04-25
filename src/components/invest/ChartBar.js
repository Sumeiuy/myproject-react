/**
 * @fileOverview components/invest/ChartBar.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { autobind } from 'core-decorators';

import Icon from '../common/Icon';
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
    chartData: PropTypes.object,
    iconType: PropTypes.string,
  }

  static defaultProps = {
    chartData: {},
    iconType: 'zichan',
  }

  constructor(props) {
    super(props);
    this.state = {
      seeChart: true,
    };
  }

  @autobind
  getChartData(data, key) {
    const yAxisLabels = [];
    data.forEach(item => yAxisLabels.push(item[key]));
    return yAxisLabels;
  }

  @autobind
  handleClickSeeChart() {
    const { seeChart } = this.state;
    this.setState({
      seeChart: !seeChart,
    });
  }

  @autobind
  seeChart(see) {
    if (see) {
      return (
        <Icon
          type="xianshi"
          style={{
            color: '#6f7e96',
          }}
          onClick={this.handleClickSeeChart}
        />
      );
    }
    return (
      <Icon
        type="hide"
        style={{
          color: '#bbbbbb',
        }}
        onClick={this.handleClickSeeChart}
      />
    );
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

  render() {
    const { chartData: { title, unit, data = [] }, iconType } = this.props;
    const { seeChart } = this.state;
    // 此处为y轴刻度值
    const yAxisLabels = this.getChartData(data, 'name');
    // 此处为数据
    const seriesData = this.getChartData(data, 'value');
    const seriesDataLen = seriesData.length;
    // 数据中最大的值
    const xMax = Math.max(...seriesData);
    // 图表边界值
    const gridXAxisMax = xMax * 1.1;
    const dataShadow = [];
    for (let i = 0; i < seriesDataLen; i++) {
      dataShadow.push(gridXAxisMax);
    }
    // 生成柱状图渐变

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
        data: yAxisLabels,
      },
      series: [
        {
          ...barShadow,
          data: dataShadow,
        },
        {
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
      ],
    };

    return (
      <div>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <Icon type={iconType} className={styles.chartTiltleTextIcon} />
            <span className={styles.chartTitleText}>{title}</span>
          </div>
          <div className={styles.seeIcon}>
            {this.seeChart(seeChart)}
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
