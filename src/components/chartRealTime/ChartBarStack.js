/**
 * @fileOverview chartRealTime/ChartBarStack.js
 * @author sunweibin
 * @description 堆叠柱状图
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { AxisOptions, gridOptions, stackBarColors, barShadow } from './ChartGeneralOptions';
import {
  getLevelName,
  getStackSeries,
  dealStackSeriesMoney,
  dealStackData,
  fixedPercentMaxMin,
  fixedPermillageMaxMin,
  fixedMoneyMaxMin,
  fixedPeopleMaxMin,
  dealStackSeiesHu,
} from './chartData';
import IECharts from '../IECharts';
import { iconTypeMap, ZHUNICODE } from '../../config';
import Icon from '../common/Icon';
import styles from './ChartBar.less';
import imgSrc from '../chartRealTime/noChart.png';

const getIcon = iconTypeMap.getIcon;
const PERCENT = ZHUNICODE.PERCENT;
const PERMILLAGE = ZHUNICODE.PERMILLAGE;
const REN = ZHUNICODE.REN;
const HU = ZHUNICODE.HU;
const YUAN = ZHUNICODE.YUAN;

export default class ChartBarStack extends PureComponent {

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
  createNewSeriesData(series, medianValue, unit, padLength) {
    let maxIndex = 10;
    if (padLength !== 0) {
      maxIndex = 10 - padLength;
    }

    return series.map((item, index) => ({
      value: (unit === PERCENT || unit === PERMILLAGE) ? Number(item.toFixed(2)) : item,
      label: {
        normal: {
          show: index < maxIndex,
          position: (medianValue > item || item === 0) ? 'right' : 'insideRight',
        },
      },
    }));
  }

  @autobind
  toFixedPercentOrPermillage(v) {
    return (item) => {
      const newItem = item;
      const data = item.data;
      newItem.data = data.map(n => (n * v));
      return newItem;
    };
  }

  render() {
    const { scope, chartData: { indiModel: { name, key }, orgModel = [] } } = this.props;
    // 获取本图表的单位,
    let { chartData: { indiModel: { unit } } } = this.props;
    const IndexIcon = getIcon(unit);
    // 查询当前需要的Y轴字段名称
    const levelAndScope = Number(scope);
    const levelName = `level${levelAndScope}Name`;
    // 分公司名称数组
    const levelCompanyArr = getLevelName(orgModel, 'level2Name');
    // 营业部名称数组
    const levelStoreArr = getLevelName(orgModel, 'level3Name');
    // 此处为y轴刻度值
    const yAxisLabels = getLevelName(orgModel, levelName);
    // 对Y轴刻度不足刻度
    const padLength = 10 - yAxisLabels.length;
    if (padLength > 0) {
      for (let i = 0; i < padLength; i++) {
        yAxisLabels.push('--');
      }
    }
    // 获取stackSeries
    const stack = getStackSeries(orgModel, 'indiModelList', key);
    const stackLegend = stack.legends;
    let stackSeries = stack.series;
    // 此处需要进行对stackSeries中的每一个data根据单位来进行特殊处理
    if (unit === PERCENT) {
      stackSeries = stackSeries.map(this.toFixedPercentOrPermillage(100));
    } else if (unit === PERMILLAGE) {
      stackSeries = stackSeries.map(this.toFixedPercentOrPermillage(1000));
    } else if (unit === YUAN) {
      // 如果图表中的数据表示的是金额的话，需要对其进行单位识别和重构
      const tempStackSeries = dealStackSeriesMoney(stackSeries);
      stackSeries = tempStackSeries.newStackSeries;
      unit = tempStackSeries.newUnit;
    } else if (unit === HU) {
      const tempStackSeries = dealStackSeiesHu(stackSeries);
      stackSeries = tempStackSeries.newStackSeries;
      unit = tempStackSeries.newUnit;
    }
    // stackSeries的data中
    const gridAxisTick = dealStackData(stackSeries);
    // 图表边界值,如果xMax是0的话则最大值为1
    let gridXAxisMax = 1;
    let gridXaxisMin = 0;
    if (unit === PERCENT) {
      const maxAndMinPercent = fixedPercentMaxMin(gridAxisTick);
      gridXAxisMax = maxAndMinPercent.max;
      gridXaxisMin = maxAndMinPercent.min;
    } else if (unit === PERMILLAGE) {
      const maxAndMinPermillage = fixedPermillageMaxMin(gridAxisTick);
      gridXAxisMax = maxAndMinPermillage.max;
      gridXaxisMin = maxAndMinPermillage.min;
    } else if (unit.indexOf(YUAN) > -1) {
      const maxAndMinMoney = fixedMoneyMaxMin(gridAxisTick);
      gridXAxisMax = maxAndMinMoney.max;
      gridXaxisMin = maxAndMinMoney.min;
    } else if (unit.indexOf(HU) > -1 || unit === REN) {
      const maxAndMinPeople = fixedPeopleMaxMin(gridAxisTick);
      gridXAxisMax = maxAndMinPeople.max;
      gridXaxisMin = maxAndMinPeople.min;
    }

    // 柱状图阴影的数据series
    const maxDataShadow = [];
    const minDataShadow = [];
    for (let i = 0; i < 10; i++) {
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
        // 堆叠柱状图上因为有多系列的值
        // 所有此处需要做处理
        const series = params;
        const tips = [];
        const total = [];
        let hasPushedAxis = false;
        // 因为第一个series是阴影
        series.forEach((item, index) => {
          if (index > 1) {
            const axisValue = item.axisValue;
            const seriesName = item.seriesName;
            let value = item.value;
            if (axisValue === '--') {
              // 无数据的情况
              value = '--';
            }
            if (axisValue !== '--') {
              total.push(value);
            }
            if (!hasPushedAxis) {
              hasPushedAxis = true;
              // 针对不同的机构级别需要显示不同的分类
              if (levelAndScope === 3 && axisValue !== '--') {
                // 营业部，需要显示分公司名称
                const dataIndex = item.dataIndex;
                tips.push(`${levelCompanyArr[dataIndex]}-`);
              }
              if (levelAndScope === 4 && axisValue !== '--') {
                // 投顾，需要显示分公司，营业部名称
                const dataIndex = item.dataIndex;
                tips.push(`${levelCompanyArr[dataIndex]} - ${levelStoreArr[dataIndex]}<br />`);
              }
              tips.push(`${axisValue}<br/>`);
            }
            tips.push(`<span style="display:inline-block;width: 10px;height: 10px;margin-right:4px;border-radius:100%;background-color:${stackBarColors[index - 2]}"></span>`);
            tips.push(`${seriesName} : <span style="color:#ffd92a; font-size:14px;">${value}</span>`);
            tips.push(`${unit}<br/>`);
          }
        });
        if (total.length > 0) {
          const totalV = Number.parseFloat(_.sum(total).toFixed(2));
          tips.push(`共 <span style="color:#ffd92a; font-size:14px;">${totalV}</span> ${unit}`);
        } else {
          tips.push(`共 <span style="color:#ffd92a; font-size:14px;">--</span> ${unit}`);
        }
        return tips.join('');
      },
      position(pos, params, dom, rect, size) {
        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
        const obj = {};
        obj.top = pos[1] - size.contentSize[1];
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        return obj;
      },
      backgroundColor: 'rgba(0, 0, 0, .56)',
      padding: [12, 11, 13, 13],
      extraCssText: 'border-radius: 8px;',
    };

    // eCharts的配置项
    const options = {
      color: [...stackBarColors],
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
        ...stackSeries,
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
        <div className={styles.chartLegend}>
          {
            stackLegend.map((item, index) => {
              const backgroundColor = stackBarColors[index];
              const uniqueKey = `${key}-legend-${index}`;
              return (
                <div className={styles.oneLegend} key={uniqueKey}>
                  <div
                    className={styles.legendIcon}
                    style={{
                      backgroundColor,
                    }}
                  />
                  {item}
                </div>
              );
            })
          }
        </div>
        <div className={styles.chartWrapper}>
          {
            (orgModel && orgModel.length > 0)
            ?
            (
              <IECharts
                option={options}
                resizable
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
