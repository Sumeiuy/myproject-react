/**
 * @fileOverview chartRealTime/ChartBarStack.js
 * @author sunweibin
 * @description 堆叠柱状图
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';

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
} from './chartData';
import IECharts from '../IECharts';
import { iconTypeMap } from '../../config';
import Icon from '../common/Icon';
import styles from './ChartBar.less';

import imgSrc from './noChart.png';

export default class ChartBarStack extends PureComponent {

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
    const {
      chartData: { name, key, orgModel = [] },
      location: { query },
      level,
    } = this.props;
    // 获取本图表的单位,
    let { chartData: { unit } } = this.props;
    // 查询当前需要的Y轴字段名称
    const levelAndScope = query.scope ? Number(query.scope) : Number(level) + 1;
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
    let stackSeries = getStackSeries(orgModel, 'children', key);
    console.log('chartBarStack===stackSeries>>>', stackSeries);
    // const seriesData = [];
    // 此处需要进行对stackSeries中的每一个data根据单位来进行特殊处理
    if (unit === '%') {
      stackSeries = stackSeries.map(this.toFixedPercentOrPermillage(100));
    } else if (unit === '\u2030') {
      stackSeries = stackSeries.map(this.toFixedPercentOrPermillage(1000));
    } else if (unit === '元') {
      // 如果图表中的数据表示的是金额的话，需要对其进行单位识别和重构
      const tempStackSeries = dealStackSeriesMoney(stackSeries);
      stackSeries = tempStackSeries.newStackSeries;
      unit = tempStackSeries.newUnit;
    }
    // stackSeries的data中
    const gridAxisTick = dealStackData(stackSeries);
    // 图表边界值,如果xMax是0的话则最大值为1
    let gridXAxisMax = 1;
    let gridXaxisMin = 0;
    if (unit === '%') {
      // TODO 此处需要对
      const maxAndMinPercent = fixedPercentMaxMin(gridAxisTick);
      gridXAxisMax = maxAndMinPercent.max;
      gridXaxisMin = maxAndMinPercent.min;
    } else if (unit === '\u2030') {
      const maxAndMinPermillage = fixedPermillageMaxMin(gridAxisTick);
      gridXAxisMax = maxAndMinPermillage.max;
      gridXaxisMin = maxAndMinPermillage.min;
    } else if (unit.indexOf('元') > -1) {
      const maxAndMinMoney = fixedMoneyMaxMin(gridAxisTick);
      gridXAxisMax = maxAndMinMoney.max;
      gridXaxisMin = maxAndMinMoney.min;
    } else if (unit === '户' || unit === '人') {
      const maxAndMinPeople = fixedPeopleMaxMin(gridAxisTick);
      gridXAxisMax = maxAndMinPeople.max;
      gridXaxisMin = maxAndMinPeople.min;
    }
    // TODO 因为stack柱状图暂时不用显示Label,所以以下可以暂时不用
    // 计算出所有值的中间值
    // const medianValue = (gridXAxisMax + gridXaxisMin) / 2;
    // 需要针对不同的值编写不同的柱状图Label样式
    // const newSeriesData = this.createNewSeriesData(seriesData, medianValue, unit, padLength);

    // 柱状图阴影的数据series
    const dataShadow = [];
    for (let i = 0; i < 10; i++) {
      dataShadow.push(gridXAxisMax);
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
        // const series = params;
        // const len = series.length;
        // const tips = [];
        // // 因为第一个series是阴影
        // for (let i = 1; i < len; i++) {
        //   tips.push();
        // }
        const item = params[1];
        const axisValue = item.axisValue;
        const seriesName = item.seriesName;
        let value = item.data.value;
        if (axisValue === '--') {
          value = '--';
        }
        if (levelAndScope === 4 && axisValue !== '--') {
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
          data: dataShadow,
        },
        ...stackSeries,
      ],
    };
    return (
      <div className={styles.chartMain}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <Icon type={iconTypeMap[key]} className={styles.chartTiltleTextIcon} />
            <span className={styles.chartTitleText}>{`${name}(${unit})`}</span>
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
