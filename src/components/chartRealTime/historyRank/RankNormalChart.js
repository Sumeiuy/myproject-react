/**
 * @description 历史对比普通图表
 * @author sunweibin
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { Icon } from 'antd';
import _ from 'lodash';

import IECharts from '../../IECharts';
import { barColor, yAxis, xAxis, chartGrid, chartTooltip } from './rankChartGeneralConfig';
import { filterData, filterRankData, dealNormalData, designGrid, optimizeGrid } from './rankDataHandle';
import styles from './RankChart.less';

export default class RankNormalChart extends PureComponent {
  static propTypes = {
    chartData: PropTypes.object.isRequired,
    level: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    showChartUnit: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.initialChartData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { scope: preScope, chartData: preData } = this.props;
    const { scope, chartData } = nextProps;
    if (!_.isEqual(scope, preScope) || !_.isEqual(chartData, preData)) {
      this.state.echart.clear();
      this.initialChartData(nextProps);
    }
  }

  // Echarts渲染后onReady
  @autobind
  onReady(echart) {
    this.setState({
      echart,
    });
  }

  // 初始化图表数据，
  // props为传递的值，
  // flag表示在constructor设置state，
  // 还是在改变的时候设置
  @autobind
  initialChartData(props) {
    const { scope, chartData: { indiModel: { name }, orgModel = [] } } = props;
    let { chartData: { indiModel: { unit } } } = props;
    const levelName = `level${scope}Name`;
    // 分公司名称数组
    const company = filterData(orgModel, 'level2Name', 'yAxis');
    // 营业部名称数组
    const stores = filterData(orgModel, 'level3Name', 'yAxis');
    // 此处为y轴刻度值
    const yAxisLabels = filterData(orgModel, levelName, 'yAxis');
    // TODO 获取排名信息数据
    const rank = filterRankData(orgModel);
    // 取出所有的value,并将value转化成数字
    let seriesData = filterData(orgModel, 'value', 'xAxis');
    seriesData = seriesData.map(item => Number(item));
    // 补足Y轴刻度值不够的情况
    // 补足10位数字
    const realLength = seriesData.length;
    const padLength = 10 - realLength;
    if (padLength > 0) {
      for (let i = 0; i < padLength; i++) {
        yAxisLabels.push('--');
        seriesData.push(0);
      }
    }
    // 根据单位进行数据处理
    const dealResult = dealNormalData(seriesData, unit);
    seriesData = dealResult.newSeries;
    unit = dealResult.newUnit;
    // 对直角坐标系进行处理
    const newGrid = designGrid(seriesData, unit);
    if (newGrid.max < 0) {
      newGrid.max = 0;
    }
    // 改变头部的单位显示
    this.props.showChartUnit(unit);
    this.setState({
      scope,
      unit,
      name,
      company,
      stores,
      yAxisLabels,
      grid: newGrid,
      seriesData,
      rank,
      realLength,
    });
  }

  @autobind
  makeDataArray(v) {
    return new Array(10).fill(v);
  }

  @autobind
  makeAxis(gridIndex, base, others) {
    return {
      ...base,
      gridIndex,
      ...others,
    };
  }
  // 用来占位的
  @autobind
  makeLabelShadowSeries(name, data) {
    return {
      name,
      data,
      stack: 'label-shadow',
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
      label: {
        normal: {
          show: false,
        },
      },
      itemStyle: {
        normal: { color: 'transparent' },
      },
      barWidth: '22',
    };
  }
  // 柱状图阴影
  @autobind
  makeDataShadowSeries(name, data) {
    return {
      name,
      data,
      type: 'bar',
      stack: 'data-shadow',
      xAxisIndex: 0,
      yAxisIndex: 0,
      label: {
        normal: {
          show: false,
        },
      },
      itemStyle: {
        normal: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      barGap: 0,
      barWidth: '4',
    };
  }
  // 柱状图Label
  @autobind
  makeLabelSeries(name, data, labels, realLength) {
    const flag = name === 'max-label';
    const position = flag ? 'insideRight' : 'insideLeft';
    const textColor = flag ? '#999' : '#333';
    const itemColor = 'transparent';
    return {
      name,
      data,
      type: 'bar',
      stack: 'label',
      xAxisIndex: 1,
      yAxisIndex: 1,
      barWidth: '22',
      animation: false,
      itemStyle: {
        normal: { color: itemColor },
      },
      label: {
        normal: {
          show: true,
          position,
          textStyle: { color: textColor },
          formatter(p) {
            const index = p.dataIndex;
            if (index < realLength) {
              return labels[p.dataIndex];
            }
            return '--';
          },
        },
      },
    };
  }

  @autobind
  optimizeLableSeriesOrder(grid, maxLabelSeries, minLabelSeries) {
    // label显示还跟其在echart中series中的顺序有关
    const { max } = grid;
    if (max <= 0) {
      return [
        maxLabelSeries,
        minLabelSeries,
      ];
    }
    return [
      minLabelSeries,
      maxLabelSeries,
    ];
  }

  // 真实的数据
  @autobind
  makeRealSeries(name, data) {
    return {
      name,
      type: 'bar',
      stack: 'real-series',
      xAxisIndex: 1,
      yAxisIndex: 1,
      label: {
        normal: {
          show: false,
        },
      },
      data,
      barGap: 0,
      barWidth: '4',
    };
  }

  @autobind
  makeTooltip(base, scope, company, store, unit) {
    return {
      ...base,
      formatter(params) {
        const item = params[6];
        const axisValue = item.axisValue;
        const seriesName = item.seriesName;
        let value = item.value;
        const dataIndex = item.dataIndex;
        if (axisValue === '--') {
          value = '--';
        }
        let tooltipHead = '';
        if (scope === '4' && axisValue !== '--') {
          tooltipHead = `
            <tr>
              <td>${company[dataIndex]} - ${store[dataIndex]}</td>
            </tr>
          `;
        } else if (scope === '3' && axisValue !== '--') {
          tooltipHead = `
            <tr>
              <td>${company[dataIndex]}</td>
            </tr>
          `;
        }
        const tips = `
          <table class="echartTooltipTable">
            ${tooltipHead}
            <tr>
              <td>${axisValue}</td>
            </tr>
            <tr>
              <td class="itemValue">${seriesName}: <span>${value}</span> (${unit})</td>
            </tr>
          </table>
        `;
        return tips;
      },
    };
  }

  render() {
    const {
      unit,
      name,
      grid,
      scope,
      seriesData,
      yAxisLabels,
      stores,
      company,
      rank,
      realLength,
    } = this.state;
    // 生成最大值数组和最小值数组
    const realGrid = optimizeGrid(grid);
    const maxData = this.makeDataArray(realGrid.max);
    const minData = this.makeDataArray(realGrid.min);
    // Label的series
    const maxLabelSeries = this.makeLabelSeries('max-label', maxData, seriesData, realLength);
    const minLabelSeries = this.makeLabelSeries('min-label', minData, yAxisLabels, realLength);
    // 普通视图配置项
    // TODO 当最小值和最大值是相同单位的时候，需要做特殊处理
    const options = {
      color: [barColor],
      tooltip: this.makeTooltip(chartTooltip, scope, company, stores, unit),
      grid: [
        ...chartGrid,
      ],
      xAxis: [
        this.makeAxis(0, xAxis, grid),
        this.makeAxis(1, xAxis, grid),
      ],
      yAxis: [
        this.makeAxis(0, yAxis, { data: yAxisLabels }),
        this.makeAxis(1, yAxis, { data: yAxisLabels }),
      ],
      series: [
        this.makeLabelShadowSeries('min-shadow', minData),
        this.makeLabelShadowSeries('max-shadow', maxData),
        this.makeDataShadowSeries('data-min-shadow', minData),
        this.makeDataShadowSeries('data-max-shadow', maxData),
        ...this.optimizeLableSeriesOrder(realGrid, maxLabelSeries, minLabelSeries),
        this.makeRealSeries(name, seriesData),
      ],
    };
    return (
      <div className={styles.rankChart}>
        {/* 排名序号,以及名次变化 */}
        <div className={styles.ranking}>
          {
            rank.map((item, index) => {
              const key = `rank-${index}`;
              const { current, change } = item;
              const icon = change < 0 ? 'arrow-down' : 'arrow-up';
              const rankClass = classnames({
                [styles.rankUp]: change >= 0,
                [styles.rankDown]: change < 0,
              });
              return (
                <div key={key} className={styles.rankNumberAndChange}>
                  <span className={styles.rankNumber}>{current}</span>
                  <span className={rankClass}><Icon type={icon} /></span>
                  <span className={styles.rankChange}>{`${Math.abs(change)}名`}</span>
                </div>
              );
            })
          }
        </div>
        <div className={styles.rankingchart}>
          <IECharts
            option={options}
            resizable
            onReady={this.onReady}
            style={{
              height: '360px',
            }}
          />
        </div>
      </div>
    );
  }
}
