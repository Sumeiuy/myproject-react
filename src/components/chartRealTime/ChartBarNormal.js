/**
 * @fileOverview chartRealTime/ChartBarNormal.js
 * @author sunweibin
 * @description 普通柱状图
 */

import React, { PropTypes, PureComponent } from 'react';
// import ReactEcharts from 'echarts-for-react';
import { autobind } from 'core-decorators';

import { AxisOptions, gridOptions, barColor, barShadow } from './ChartGeneralOptions';
import {
  getMaxAndMinPercent,
  getMaxAndMinPermillage,
  getMaxAndMinMoney,
  getMaxAndMinCust,
  getMaxAndMinCi,
  toFixedMoney,
  toFixedCust,
  toFixedCI,
} from './FixNumber';
import IECharts from '../IECharts';
import { iconTypeMap, ZHUNICODE } from '../../config';
import Icon from '../common/Icon';
import styles from './ChartBar.less';
import imgSrc from './noChart.png';

const getIcon = iconTypeMap.getIcon;
const PERCENT = ZHUNICODE.PERCENT;
const PERMILLAGE = ZHUNICODE.PERMILLAGE;
const REN = ZHUNICODE.REN;
const HU = ZHUNICODE.HU;
const CI = ZHUNICODE.CI;
const YUAN = ZHUNICODE.YUAN;

export default class ChartBarNormal extends PureComponent {

  static propTypes = {
    location: PropTypes.object,
    level: PropTypes.string.isRequired,
    scope: PropTypes.number.isRequired,
    chartData: PropTypes.object,
    iconType: PropTypes.string,
  }

  static defaultProps = {
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

  @autobind
  createNewSeriesData(series, medianValue, unit, padLength) {
    let maxIndex = 10;
    if (padLength !== 0) {
      maxIndex = 10 - padLength;
    }

    const judge = (item) => {
      // 正数最大值
      const plusMax = medianValue.plus * 2;
      // 负数最大值
      const minusMax = medianValue.minus * 2;
      if (minusMax >= 0) {
        // 全是正数
        return medianValue.plus > item ? 'right' : 'insideRight';
      } else if (plusMax <= 0) {
        // 全是负数
        return medianValue.minus < item ? 'left' : 'insideLeft';
      }
      // 有正有负
      // 判断正负所占比例
      const axisGap = plusMax - minusMax;
      const plusPercent = (plusMax / axisGap) * 100;
      const minusPercent = (Math.abs(minusMax) / axisGap) * 100;
      if (plusPercent < 20 && item >= 0) {
        return 'left';
      }
      if (minusPercent < 20 && item <= 0) {
        return 'right';
      }
      if (item > 0) {
        return medianValue.plus > item ? 'right' : 'insideRight';
      } else if (item < 0) {
        return medianValue.minus < item ? 'left' : 'insideLeft';
      }
      return 'right';
    };

    return series.map((item, index) => ({
      value: (unit === PERCENT || unit === PERMILLAGE) ? Number(item.toFixed(2)) : item,
      label: {
        normal: {
          show: index < maxIndex,
          position: judge(item),
        },
      },
    }));
  }

  render() {
    const { scope, chartData: { indiModel: { name }, orgModel = [] } } = this.props;
    let { chartData: { indiModel: { unit } } } = this.props;
    const IndexIcon = getIcon(unit);
    const levelAndScope = Number(scope);
    const levelName = `level${levelAndScope}Name`;
    // 分公司名称数组
    const levelCompanyArr = this.getChartData(orgModel, 'level2Name', 'yAxis');
    // 营业部
    const levelStoreArr = this.getChartData(orgModel, 'level3Name', 'yAxis');

    // 此处为y轴刻度值
    const yAxisLabels = this.getChartData(orgModel, levelName, 'yAxis');
    // 取出所有的value,并将value转化成数字
    let seriesData = this.getChartData(orgModel, 'value', 'xAxis');
    seriesData = seriesData.map(item => Number(item));
    // 补足10位数字
    const padLength = 10 - seriesData.length;
    if (padLength > 0) {
      for (let i = 0; i < padLength; i++) {
        yAxisLabels.push('--');
        seriesData.push(0);
      }
    }

    // 根据单位进行数字转换
    if (unit === PERCENT) {
      seriesData = seriesData.map(item => (item * 100));
    } else if (unit === PERMILLAGE) {
      seriesData = seriesData.map(item => (item * 1000));
    } else if (unit === YUAN) {
      // 如果图表中的数据表示的是金额的话，需要对其进行单位识别和重构
      const tempSeries = toFixedMoney(seriesData);
      seriesData = tempSeries.newSeries;
      unit = tempSeries.newUnit;
    } else if (unit === HU) {
      const tempSeries = toFixedCust(seriesData);
      seriesData = tempSeries.newSeries;
      unit = tempSeries.newUnit;
    } else if (unit === CI) {
      const tempSeries = toFixedCI(seriesData);
      seriesData = tempSeries.newSeries;
      unit = tempSeries.newUnit;
    }
    const seriesDataLen = seriesData.length;
    // 数据中最大的值
    const xMax = Math.max(...seriesData);
    // 图表边界值,如果xMax是0的话则最大值为1
    let gridXAxisMax = xMax * 1.1 || 1;
    let gridXaxisMin = 0;
    if (unit === PERCENT) {
      const maxAndMinPercent = getMaxAndMinPercent(seriesData);
      gridXAxisMax = maxAndMinPercent.max;
      gridXaxisMin = maxAndMinPercent.min;
    } else if (unit === PERMILLAGE) {
      const maxAndMinPermillage = getMaxAndMinPermillage(seriesData);
      gridXAxisMax = maxAndMinPermillage.max;
      gridXaxisMin = maxAndMinPermillage.min;
    } else if (unit.indexOf(YUAN) > -1) {
      const maxAndMinMoney = getMaxAndMinMoney(seriesData);
      gridXAxisMax = maxAndMinMoney.max;
      gridXaxisMin = maxAndMinMoney.min;
    } else if (unit === REN || unit.indexOf(HU) > -1) {
      const maxAndMinPeople = getMaxAndMinCust(seriesData);
      gridXAxisMax = maxAndMinPeople.max;
      gridXaxisMin = maxAndMinPeople.min;
    } else if (unit === CI) {
      const maxAndMinPeople = getMaxAndMinCi(seriesData);
      gridXAxisMax = maxAndMinPeople.max;
      gridXaxisMin = maxAndMinPeople.min;
    }
    // 计算出所有值的中间值
    const medianValue = {};
    if (gridXAxisMax < 0 || gridXaxisMin > 0) {
      // 要么全是正数，要么全是负数
      medianValue.plus = (gridXAxisMax + gridXaxisMin) / 2;
      medianValue.minus = (gridXAxisMax + gridXaxisMin) / 2;
    } else {
      medianValue.plus = gridXAxisMax / 2;
      medianValue.minus = gridXaxisMin / 2;
    }
    // 需要针对不同的值编写不同的柱状图Label样式
    const newSeriesData = this.createNewSeriesData(seriesData, medianValue, unit, padLength);

    // 此处当 gridXAxisMax 和 gridXaxisMin都是负数的时候后，eChart会出现布局错乱
    // 因此需要改变
    if (gridXaxisMin < 0 && gridXAxisMax < 0) {
      gridXAxisMax = 0;
    }
    // 柱状图阴影
    const maxDataShadow = [];
    const minDataShadow = [];
    for (let i = 0; i < seriesDataLen; i++) {
      maxDataShadow.push(gridXAxisMax);
      minDataShadow.push(gridXaxisMin);
    }
    // tooltip 配置项
    const tooltipOtions = {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter(params) {
        const item = params[2];
        const axisValue = item.axisValue;
        const seriesName = item.seriesName;
        let value = item.data.value;

        if (axisValue === '--') {
          value = '--';
        }
        if (levelAndScope === 4 && axisValue !== '--') {
          const dataIndex = item.dataIndex;
          return `${levelCompanyArr[dataIndex]} - ${levelStoreArr[dataIndex]}<br />
            ${axisValue}<br />
            ${seriesName}: <span style="color:#f8ac59; font-size: 15px;">${value}</span>${unit}`;
        }
        if (levelAndScope === 3 && axisValue !== '--') {
          const dataIndex = item.dataIndex;
          return `${levelCompanyArr[dataIndex]}<br />
            ${axisValue}<br />
            ${seriesName}: <span style="color:#f8ac59; font-size: 15px;">${value}</span>${unit}`;
        }
        return `${axisValue}<br />
          ${seriesName}: <span style="color:#f8ac59; font-size: 15px;">${value}</span>${unit}`;
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
          data: maxDataShadow,
        },
        {
          ...barShadow,
          data: minDataShadow,
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
            <Icon type={IndexIcon} className={styles.chartTiltleTextIcon} />
            <span className={styles.chartTitleText}>{`${name}(${unit})`}</span>
          </div>
        </div>
        <div className={styles.chartWrapper}>
          {
            (orgModel && orgModel.length > 0)
            ?
            (
              <IECharts
                option={options}
                resizable
                style={{
                  height: '325px',
                }}
              />
            )
            :
            (
              <div className={styles.noChart}>
                <img src={imgSrc} alt="图表不可见" />
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
