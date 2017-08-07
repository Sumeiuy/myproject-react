/**
 * @description 历史对比折线图
 * @author sunweibin
 * @fileOverview history/HistoryComparePolyChart.js
 */

import React, { PropTypes, PureComponent } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { constructPolyChartOptions } from './ConstructPolyChartOptions';
import IECharts from '../IECharts';
import FixNumber from '../chartRealTime/FixNumber';
import styles from './HistoryComparePolyChart.less';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

export default class HistoryComparePolyChart extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      unit: '',
      curYear: '',
      prevYear: '',
      currentValue: '',
      previousValue: '',
      currentDate: '',
      previousDate: '',
      chartOptions: EMPTY_OBJECT,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    const { data: prevData } = this.props;
    if (prevData !== data) {
      // 构造数据
      // 构造配置项
      const {
        xSeries,
        series,
        unit,
        yAxisTickArea,
      } = this.formatData(data.current);

      const finalCurrentData = this.formatDate(xSeries, series,
        unit, yAxisTickArea);

      const {
        series: previousNewSeries,
        yAxisTickArea: previousYAxisTickArea,
      } = this.formatData(data.previous);

      const finalPreviousData = {
        series: previousNewSeries,
        yAxisMin: previousYAxisTickArea.min,
        yAxisMax: previousYAxisTickArea.max,
      };

      const {
        yAxisMin: curYAxisMin,
        yAxisMax: curYAxisMax,
        xAxisTickArea,
        series: curSeries,
      } = finalCurrentData;

      const {
        yAxisMin: previousYAxisMin,
        yAxisMax: previousYAxisMax,
        series: previousSeries,
      } = finalPreviousData;

      const options = constructPolyChartOptions({
        xAxisTickArea,
        current: curSeries || EMPTY_ARRAY,
        previous: previousSeries || EMPTY_ARRAY,
        yAxisMin: Math.min(curYAxisMin, previousYAxisMin),
        yAxisMax: Math.max(curYAxisMax, previousYAxisMax),
        onAxisPointerMouseMove: this.handlePloyChartMove,
      });

      // 默认选中第一条展示信息
      const { date: currentDate, value: currentValue,
        year: curYear, name } = curSeries[0] || EMPTY_ARRAY;
      const { date: previousDate, value: previousValue,
        year: prevYear } = previousSeries[0] || EMPTY_ARRAY;

      this.setState({
        chartOptions: options, // 折线图配置项
        name,
        unit,
        curYear,
        prevYear,
        currentValue,
        previousValue,
        currentDate,
        previousDate,
      });
    }
  }


  // 当前单位为元时
  // 计算y轴的刻度范围
  getYAxisTickMinAndMax(array, curUnit) {
    if (_.isEmpty(array)) {
      return {
        min: 0,
        max: 1,
      };
    }

    let minAndMax;
    if (curUnit.indexOf('元') !== -1) {
      minAndMax = FixNumber.getMaxAndMinMoney(array);
    } else if (curUnit.indexOf('户') !== -1) {
      minAndMax = FixNumber.getMaxAndMinCust(array);
    } else if (curUnit.indexOf('个') !== -1) {
      minAndMax = FixNumber.getMaxAndMinGE(array);
    } else if (curUnit.indexOf('次') !== -1) {
      minAndMax = FixNumber.getMaxAndMinCi(array);
    } else if (curUnit.indexOf('%') !== -1) {
      minAndMax = FixNumber.getMaxAndMinPercent(array);
    } else if (curUnit.indexOf('‰') !== -1) {
      minAndMax = FixNumber.getMaxAndMinPermillage(array);
    }

    const { max, min } = minAndMax;
    return {
      max,
      min,
    };
  }

  // 获取y轴的单位和格式化后的数据源
  getYAxisUnit(array, yAxisUnit) {
    if (!_.isEmpty(array)) {
      if (yAxisUnit.indexOf('元') !== -1) {
        return FixNumber.toFixedMoney(array);
      } else if (yAxisUnit.indexOf('户') !== -1) {
        return FixNumber.toFixedCust(array);
      } else if (yAxisUnit.indexOf('个') !== -1) {
        return FixNumber.toFixedGE(array);
      } else if (yAxisUnit.indexOf('次') !== -1) {
        return FixNumber.toFixedCI(array);
      } else if (yAxisUnit.indexOf('%') !== -1
        || yAxisUnit.indexOf('‰') !== -1) {
        return {
          newSeries: array,
          newUnit: yAxisUnit,
        };
      }
    }

    return {
      newUnit: '',
      newSeries: [],
    };
  }

  formatData(data) {
    const newYSeries = [];
    const xSeries = [];
    let yAxisData = '';
    let xAxisData = '';
    _.each(data, (item) => {
      const indicatorMeta = item.indicatorMetaDto;
      const timeModel = item.timeModel;
      yAxisData = _.pick(indicatorMeta, ['name', 'value', 'unit']);
      xAxisData = _.pick(timeModel, ['year', 'month', 'day']);
      if (!_.isEmpty(yAxisData.value) && yAxisData.value !== 0 && yAxisData.value !== '0') {
        newYSeries.push(yAxisData.value);
      } else {
        newYSeries.push(0);
      }
      if (_.isEmpty(xAxisData.day)) {
        xSeries.push(xAxisData.month);
      } else {
        xSeries.push(`${xAxisData.month}/${xAxisData.day}`);
      }
    });

    const newYAxisUnit = this.getYAxisUnit(newYSeries, yAxisData.unit);
    const yAxisTickArea = this.getYAxisTickMinAndMax(newYAxisUnit.newSeries, yAxisData.unit);

    const itemDataArray = newYAxisUnit.newSeries.map((item, index) => (
      {
        value: item,
        name: yAxisData.name,
        unit: newYAxisUnit.newUnit,
        year: xAxisData.year,
        date: xSeries[index],
      }
    ));

    return {
      xSeries,
      series: itemDataArray,
      unit: newYAxisUnit.newUnit,
      yAxisTickArea,
    };
  }

  formatDate(xSeries, newSeries, newUnit, newYAxisTickArea) {
    const finalData = {
      series: newSeries,
      yAxisUnit: newUnit,
      xAxisTickArea: xSeries,
      yAxisMin: newYAxisTickArea.min,
      yAxisMax: newYAxisTickArea.max,
    };

    return finalData;
  }

  @autobind
  handlePloyChartMove(params) {
    const { seriesData } = params;
    let comparePoly = EMPTY_OBJECT;
    if (seriesData.length === 1) {
      const [{ seriesName }] = seriesData;
      if (seriesName === '本期') {
        const [
          { data: { value: currentValue, date: currentDate } },
        ] = seriesData;
        comparePoly = {
          currentValue,
          currentDate,
          previousValue: '',
          previousDate: '',
        };
      } else {
        const [
          { data: { value: previousValue, date: previousDate } },
        ] = seriesData;
        comparePoly = {
          currentValue: '',
          currentDate: '',
          previousValue,
          previousDate,
        };
      }
    } else if (seriesData.length === 2) {
      const [
        { data: { value: currentValue, date: currentDate } },
        { data: { value: previousValue, date: previousDate } },
      ] = seriesData;

      comparePoly = {
        currentValue,
        previousValue,
        currentDate,
        previousDate,
      };
    } else {
      comparePoly = {
        currentValue: '',
        currentDate: '',
        previousValue: '',
        previousDate: '',
      };
    }
    this.setState({
      ...comparePoly,
    });
  }

  render() {
    const {
      chartOptions,
      name,
      unit,
      curYear,
      prevYear,
      currentValue,
      previousValue,
      currentDate,
      previousDate,
     } = this.state;

    if (_.isEmpty(chartOptions)) {
      return null;
    }

    return (
      <div className={styles.historyPoly}>
        <div className={styles.chartHd}>
          <div className={styles.headerLeft}>
            <span className={styles.chartHdCaption}>历史对比</span>
            <span className={styles.chartUnit}>({unit})</span>
          </div>
        </div>
        <div className={styles.chartMain}>
          <IECharts
            option={chartOptions}
            resizable
            style={{
              height: '335px',
            }}
          />
        </div>
        <div className={styles.chartFoot}>
          <span className={styles.tipDot} />
          <span className={styles.tipIndicator}>{name}</span>
          <span className={styles.tipTime}>{currentDate ? `${curYear}/${currentDate}:` : ''}</span>
          <span className={styles.currentValue}>{(currentValue === 0 || currentValue) ? `${currentValue}` : ''}</span>
          <span className={styles.tipUnit}>{(currentValue === 0 || currentValue) ? `${unit}` : ''}</span>
          <span className={styles.tipTime}>{previousDate ? `${prevYear}/${previousDate}:` : ''}</span>
          <span className={styles.contrastValue}>{(previousValue === 0 || previousValue) ? `${previousValue}` : ''}</span>
          <span className={styles.tipUnit}>{(previousValue === 0 || previousValue) ? `${unit}` : ''}</span>
        </div>
      </div>
    );
  }
}
