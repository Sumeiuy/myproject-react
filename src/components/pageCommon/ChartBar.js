/**
 * @fileOverview components/invest/ChartBar.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
// import ReactEcharts from 'echarts-for-react';
import { autobind } from 'core-decorators';

import IECharts from '../IECharts';
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
    location: PropTypes.object,
    level: PropTypes.string,
    chartData: PropTypes.object,
    iconType: PropTypes.string,
  }

  static defaultProps = {
    level: '',
    location: {},
    chartData: {},
    iconType: 'zichan',
  }

  @autobind
  getChartData(orgModel, key, axis) {
    const yAxisLabels = [];
    if (orgModel) {
      orgModel.forEach((item) => {
        if (item[key] === null || item[key] === 'null') {
          if (axis === 'yAxis') {
            yAxisLabels.push('--');
          } else if (axis === 'xAxis') {
            yAxisLabels.push(0);
          }
        } else {
          yAxisLabels.push(item[key]);
        }
      });
    }
    return yAxisLabels;
  }

  // 针对百分比的数字来确认图表坐标轴的最大和最小值
  @autobind
  getMaxAndMinPercent(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    max = Math.ceil((max / 10)) * 10;
    min = Math.floor((min / 10)) * 10;
    if (max === 0) {
      max = 100;
    }
    if (min === 100) {
      min = 0;
    }
    return {
      max,
      min,
    };
  }

  // 针对千分比确认图表最大和最小值
  @autobind
  getMaxAndMinPermillage(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    max = Math.ceil(max);
    min = Math.floor(min);
    if (max === 0) {
      max = 1;
    }
    return {
      max,
      min,
    };
  }

  // 针对金额确认图表最大和最小值
  @autobind
  getMaxAndMinMoney(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    if (max >= 10000) {
      max = Math.ceil(max / 1000) * 1000;
    } else if (max >= 1000) {
      max = Math.ceil(max / 1000) * 1000;
    } else if (max >= 100) {
      max = Math.ceil(max / 100) * 100;
    } else if (max < 100) {
      max = Math.ceil(max / 10) * 10;
    }
    if (max === 0) {
      max = 1;
    }
    if (min >= 10000) {
      min = Math.floor(min / 1000) * 1000;
    } else if (min >= 1000) {
      min = Math.floor(min / 1000) * 1000;
    } else if (min >= 100) {
      min = Math.floor(min / 100) * 100;
    } else if (min < 100) {
      min = Math.floor(min / 10) * 10;
    }
    if (min <= 0 || min >= max) {
      min = 0;
    }
    return { max, min };
  }

  // 针对户获取图表最大和最小值
  @autobind
  getMaxAndMinCust(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    if (max >= 10000) {
      max = Math.ceil(max / 1000) * 1000;
    } else if (max >= 100) {
      max = Math.ceil(max / 100) * 100;
    } else if (max < 100) {
      max = Math.ceil(max / 10) * 10;
    }
    if (max === 0) {
      max = 10;
    }
    if (min >= 10000) {
      min = Math.floor(min / 1000) * 1000;
    } else if (min >= 100) {
      min = Math.floor(min / 100) * 100;
    } else if (min < 100) {
      min = Math.floor(min / 10) * 10;
    }
    if (min <= 0 || min >= max) {
      min = 0;
    }
    return { max, min };
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
  createNewSeriesData(series, medianValue, unit, padLength) {
    let maxIndex = 10;
    if (padLength !== 0) {
      maxIndex = 10 - padLength;
    }

    return series.map((item, index) => ({
      value: (unit === '%' || unit === '\u2030') ? Number(item.toFixed(2)) : item,
      label: {
        normal: {
          show: index < maxIndex,
          position: (medianValue > item || item === 0) ? 'right' : 'insideRight',
        },
      },
    }));
  }

  // 对小数进行处理
  @autobind
  toFixedDecimal(value) {
    if (value > 10000) {
      return Number.parseFloat(value.toFixed(0));
    }
    if (value > 1000) {
      return Number.parseFloat(value.toFixed(1));
    }
    return Number.parseFloat(value.toFixed(2));
  }

  // 对金额进行特殊处理的函数
  @autobind
  toFixedMoney(series) {
    let newUnit = '元';
    let newSeries = series;
    const MaxMoney = Math.max(...series);
    // 1. 全部在万元以下的数据不做处理
    // 2.超过万元的，以‘万元’为单位
    // 3.超过亿元的，以‘亿元’为单位
    if (MaxMoney > 100000000) {
      newUnit = '亿元';
      newSeries = series.map(item => this.toFixedDecimal(item / 100000000));
    } else if (MaxMoney > 10000) {
      newUnit = '万元';
      newSeries = series.map(item => this.toFixedDecimal(item / 10000));
    }

    return {
      newUnit,
      newSeries,
    };
  }

  render() {
    // todo未对数据为空进行判断，导致初始页面不渲染
    // const { chartData } = this.props;
    const {
      chartData: { name, key, orgModel = [] },
      location: { query },
      level,
    } = this.props;
    let { chartData: { unit } } = this.props;
    const levelAndScope = query.scope ? Number(query.scope) : Number(level) + 1;

    const levelName = `level${levelAndScope}Name`;
    // 分公司名称数组
    const levelCompanyArr = this.getChartData(orgModel, 'level2Name', 'yAxis');
    const levelStoreArr = this.getChartData(orgModel, 'level3Name', 'yAxis');

    // 此处为y轴刻度值
    const yAxisLabels = this.getChartData(orgModel, levelName, 'yAxis');
    // 此处为数据,此数据在百分比的情况下,全部都是小数，需要乘以100
    let seriesData = this.getChartData(orgModel, 'value', 'xAxis');
    seriesData = seriesData.map(item => Number(item));
    const padLength = 10 - seriesData.length;
    if (padLength > 0) {
      for (let i = 0; i < padLength; i++) {
        yAxisLabels.push('--');
        seriesData.push(0);
      }
    }

    if (unit === '%') {
      seriesData = seriesData.map(item => (item * 100));
    } else if (unit === '\u2030') {
      seriesData = seriesData.map(item => (item * 1000));
    } else if (unit === '元') {
      // 如果图表中的数据表示的是金额的话，需要对其进行单位识别和重构
      const tempSeries = this.toFixedMoney(seriesData);
      seriesData = tempSeries.newSeries;
      unit = tempSeries.newUnit;
    }
    const seriesDataLen = seriesData.length;
    // 数据中最大的值
    const xMax = Math.max(...seriesData);
    // 图表边界值,如果xMax是0的话则最大值为1
    let gridXAxisMax = xMax * 1.1 || 1;
    let gridXaxisMin = 0;
    if (unit === '%') {
      // TODO 此处需要对
      const maxAndMinPercent = this.getMaxAndMinPercent(seriesData);
      gridXAxisMax = maxAndMinPercent.max;
      gridXaxisMin = maxAndMinPercent.min;
    } else if (unit === '\u2030') {
      const maxAndMinPermillage = this.getMaxAndMinPermillage(seriesData);
      gridXAxisMax = maxAndMinPermillage.max;
      gridXaxisMin = maxAndMinPermillage.min;
    } else if (unit.indexOf('元') > -1) {
      const maxAndMinMoney = this.getMaxAndMinMoney(seriesData);
      gridXAxisMax = maxAndMinMoney.max;
      gridXaxisMin = maxAndMinMoney.min;
    } else if (unit === '户' || unit === '人') {
      const maxAndMinPeople = this.getMaxAndMinCust(seriesData);
      gridXAxisMax = maxAndMinPeople.max;
      gridXaxisMin = maxAndMinPeople.min;
    }
    // 计算出所有值的中间值
    const medianValue = (gridXAxisMax + gridXaxisMin) / 2;
    // 需要针对不同的值编写不同的柱状图Label样式
    const newSeriesData = this.createNewSeriesData(seriesData, medianValue, unit, padLength);
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
        const item = params[1];
        console.log('params', params);
        const axisValue = item.axisValue;
        const seriesName = item.seriesName;
        let value = item.data.value;
        if (axisValue === '--') {
          value = '--';
        }
        if (levelAndScope === 4) {
          const seriesIndex = item.seriesIndex;
          return `${levelCompanyArr[seriesIndex]} - ${levelStoreArr[seriesIndex]}<br />${axisValue}<br /> ${seriesName}: <span style="color:#f8ac59; font-size: 15px;">${value}</span>${unit}`;
        }
        return `${axisValue}<br /> ${seriesName}: <span style="color:#f8ac59; font-size: 15px;">${value}</span>${unit}`;
      },
      position(pos, params, dom, rect, size) {
        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
        const obj = { top: (pos[1] - size.contentSize[1]) };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        return obj;
      },
      backgroundColor: 'rgba(0, 0, 0, .56)',
      padding: [12, 11, 13, 13],
      extraCssText: 'border-radius: 8px;',
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
        nameGap: '6',
        nameTextStyle: {
          color: '#999',
        },
        max: gridXAxisMax,
        min: gridXaxisMin,
        ...AxisOptions,
        axisTick: {
          show: true,
          lineStyle: {
            color: '#e7eaec',
          },
        },
        splitLine: {
          show: false,
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
            if (!value) {
              return '--';
            }
            if (value.length > 4) {
              return `${value.substr(0, 4)}...`;
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
            {/*
              <span
                style={{
                  float: 'right',
                  height: '100%',
                  verticalAlign: 'middle',
                  lineHeight: '45px',
                }}
              >3600户</span>
            */}
          </div>
        </div>
        <div className={styles.chartWrapper}>
          {
            (orgModel && orgModel.length) ?
              (<IECharts
                option={options}
                resizable
              />)
            :
              (<div className={styles.noChart}>
                <img src={imgSrc} alt="图表不可见" />
              </div>)
          }
        </div>
      </div>
    );
  }
}
