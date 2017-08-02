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

// const EMPTY_OBJECT = {};
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
      year: '',
      currentValue: '',
      previousValue: '',
      currentDate: '',
      previousDate: '',
      chartOptions: '',
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
      const { date: currentDate, value: currentValue, year } = curSeries[0] || EMPTY_ARRAY;
      const { date: previousDate, value: previousValue } = curSeries[0] || EMPTY_ARRAY;

      this.setState({
        chartOptions: options, // 折线图配置项
        name,
        unit,
        year,
        currentValue,
        previousValue,
        currentDate,
        previousDate,
      });
    }
  }


  // 当前单位为元时
  // 计算y轴的刻度范围
  getYAxisTickMinAndMax(array) {
    if (_.isEmpty(array)) {
      return {
        min: 0,
        max: 1,
      };
    }

    const { max, min } = FixNumber.getMaxAndMinMoney(array);

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
      }
      if (_.isEmpty(xAxisData.day)) {
        xSeries.push(xAxisData.month);
      } else {
        xSeries.push(`${xAxisData.month}/${xAxisData.day}`);
      }
    });

    const newYAxisUnit = this.getYAxisUnit(newYSeries, yAxisData.unit);
    const yAxisTickArea = this.getYAxisTickMinAndMax(newYAxisUnit.newSeries);

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
    // const areaLen = xSeries.length;
    // const newSeries = [];
    // if (areaLen > 7) {
    //   const maxDate = xSeries[areaLen - 1];
    //   const xAxisArea = Math.ceil(areaLen / 7);
    //   let item = xSeries.shift();
    //   newSeries.push(item);
    //   for (let i = 0; i < 7; i++) {
    //     if (item.length === 2) {
    //       // 月
    //       const currentDate = parseInt(item, 10) + xAxisArea;
    //       const formatedMaxDate = parseInt(maxDate, 10);
    //       if (currentDate < formatedMaxDate) {
    //         item = `${currentDate < 10 ? `0${currentDate}` : currentDate}`;
    //         newSeries.push(item);
    //       } else {
    //         item = `${formatedMaxDate < 10 ? `0${formatedMaxDate}` : formatedMaxDate}`;
    //         newSeries.push(item);
    //         break;
    //       }
    //     } else {
    //       // 天
    //       const currentDate = parseInt(item.substring(3, 5), 10) + xAxisArea;
    //       const formatedMaxDate = parseInt(maxDate.substring(3, 5), 10);
    //       if (currentDate < formatedMaxDate) {
    //         item = `${item.substring(0, 3)}
    // ${currentDate < 10 ? `0${currentDate}` : currentDate}`;
    //         newSeries.push(item);
    //       } else {
    //         item = `${item.substring(0, 3)}
    // ${formatedMaxDate < 10 ? `0${formatedMaxDate}` : formatedMaxDate}`;
    //         newSeries.push(item);
    //         break;
    //       }
    //     }
    //   }
    // }

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
    console.log(params);
    const { value: currentDate, seriesData:
      [
        { data: { name, unit, year, value: currentValue } },
        { data: { value: previousValue, date: previousDate } },
      ],
    } = params;

    this.setState({
      name,
      unit,
      year,
      currentValue,
      previousValue,
      currentDate,
      previousDate,
    });
  }

  render() {
    const { data } = this.props;
    const {
      chartOptions,
      name,
      unit,
      year,
      currentValue,
      previousValue,
      currentDate,
      previousDate,
     } = this.state;

    if (_.isEmpty(data)) {
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
              height: '325px',
            }}
          />
        </div>
        <div className={styles.chartFoot}>
          <span className={styles.tipDot} />
          <span className={styles.tipIndicator}>{name}</span>
          <span className={styles.tipTime}>{year}{currentDate}:</span>
          <span className={styles.currentValue}>{currentValue}</span>
          <span className={styles.tipUnit}>{unit}</span>
          <span className={styles.tipTime}>{year}{previousDate}</span>
          <span className={styles.contrastValue}>{previousValue}</span>
          <span className={styles.tipUnit}>{unit}</span>
        </div>
      </div>
    );
  }
}
