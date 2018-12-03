/*
 * @Author: XuWenKang
 * @Description: 收益率走势图
 * @Date: 2018-04-25 13:55:06
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-21 19:12:51
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { SingleFilter } from 'lego-react-filter/src';
import IECharts from '../IECharts';
import styles from './profitRateChart.less';
import { timeList, codeList } from '../../config/profitRateConfig';

const EMPTY_ARRAY = [];

export default class ProfitRateChart extends Component {
  static propTypes = {
    // 切换图表时间范围
    onTimeChange: PropTypes.func.isRequired,
    // 切换对比指标
    onCompareCodeChange: PropTypes.func.isRequired,
    // 基本的指标数据
    custBasicData: PropTypes.object.isRequired,
    // 对比指标的数据
    custCompareData: PropTypes.object.isRequired,
    // 当前对比的指标
    compareCode: PropTypes.string,
    // 当前选择的时间
    time: PropTypes.string,
    // 标题
    title: PropTypes.string,
  }

  static defaultProps = {
    title: '收益走势',
    time: timeList[0].key,
    compareCode: codeList[0].key,
  }

  @autobind
  getSeriesData() {
    const { custBasicData, custCompareData } = this.props;
    const { compareCode } = this.props;
    const compareCodeItem = _.find(codeList, codeItem => codeItem.key === compareCode);
    const compareCodeName = compareCodeItem && compareCodeItem.value;
    const seriesData = [
      {
        data: custBasicData.indexLine,
        type: 'line',
        name: '账户收益率',
        lineStyle: {
          normal: {
            width: 2,
            color: '#fe5f03',
          },
        },
      },
      {
        data: custCompareData.indexLine,
        type: 'line',
        name: compareCodeName || '沪深300',
        lineStyle: {
          normal: {
            width: 1,
            color: '#7289b4',
          },
        },
      },
    ];
    return seriesData;
  }

  @autobind
  getTimeCls(item) {
    return classnames({
      [styles.timeItem]: true,
      [styles.activeItem]: item.key === this.props.time,
    });
  }

  @autobind
  tooltipFormat(params) {
    const { custBasicData, custCompareData } = this.props;
    const combinationNum = (custCompareData.indexLine || EMPTY_ARRAY)[params[0].dataIndex] || 0;
    const baseNum = (custBasicData.indexLine || EMPTY_ARRAY)[params[0].dataIndex] || 0;
    const timeItem = custCompareData.timeLine && custCompareData.timeLine[0];
    const timePrefix = timeItem.slice(0, timeItem.indexOf('/') + 1);
    return `
      <div>${timePrefix + params[0].axisValueLabel}</div>
      <div>${params[1].marker}${params[1].seriesName}: ${combinationNum.toFixed(2)}%</div>
      <div>${params[0].marker}${params[0].seriesName}: ${baseNum.toFixed(2)}%</div>
    `;
  }


  render() {
    const {
      custCompareData,
      compareCode,
      title,
      onTimeChange,
      onCompareCodeChange,
    } = this.props;

    const option = {
      grid: {
        left: 20,
        right: 35,
        top: 10,
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false,
        },
        data: _.map(custCompareData.timeLine, value => value && value.slice(value.indexOf('/') + 1)),
        axisLabel: {
          color: '#333',
          showMinLabel: true,
          showMaxLabel: true,
          fontSize: 12,
        },
      },
      yAxis: {
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#999',
            type: 'dotted',
          },
        },
        axisTick: {
          show: false,
        },
        type: 'value',
        axisLabel: {
          color: '#333',
          formatter: '{value} %',
          fontSize: 12,
        },
      },
      series: this.getSeriesData(),
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(2, 22, 55, 0.8)',
        padding: 10,
        textStyle: {
          fontSize: 12,
        },
        formatter: this.tooltipFormat,
      },
      color: ['#fe5f03', '#7289b4'],
    };

    return (
      <div className={styles.yieldChartBox}>
        <div className={styles.title}>{title}</div>
        <div className={styles.tabBox}>
          <div className={styles.timeSelectBox}>
            {
              _.map(timeList, item => (
                <span
                  key={item.key}
                  className={this.getTimeCls(item)}
                  onClick={() => onTimeChange(item.key)}
                >
                  {item.value}
                </span>
              ))
            }
          </div>
          <div className={styles.codeSelectBox}>
            <span className={styles.compareCode} />
            <span className={styles.codeController}>
              <SingleFilter
                filterName="对比指标"
                data={codeList}
                value={compareCode}
                onChange={onCompareCodeChange}
              />
            </span>
            <span className={styles.basicCode} />
            <span className={styles.text}>账户收益率</span>
          </div>
        </div>
        <div className={styles.chartWrapper}>
          <IECharts
            key={compareCode}
            option={option}
            style={{ height: '203px' }}
            resizable
            notMerge
          />
        </div>
      </div>
    );
  }
}
