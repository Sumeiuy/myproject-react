/*
 * @Author: zhangjun
 * @Date: 2018-11-23 09:25:41
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-23 18:52:41
 * @description 资产变动报表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { number } from '../../../helper';
import IECharts from '../../IECharts';
import { filterData, filterXAxisDate } from '../utils';
import { FUND_INVEST, ASSET_MARKET } from '../config';
import styles from './assetChangeChart.less';

const { thousandFormat } = number;

export default class AssetChangeChart extends PureComponent {
  static propTypes = {
    // 账户资产变动图表数据
    assetChangeReportData: PropTypes.array.isRequired,
  }

  @autobind
  tooltipFormat(params) {
    const { dataIndex } = params[0];
    const { assetChangeReportData } = this.props;
    // 账户资产变动图表返回的日期
    const filterDate = filterData(assetChangeReportData, 'date');
    const dateData = filterDate[dataIndex];
    return `
      <div>${dateData}</div>
      <div>${params[0].marker}${params[0].seriesName}: ${thousandFormat(params[0].value)}</div>
      <div>${params[1].marker}${params[1].seriesName}: ${thousandFormat(params[1].value)}</div>
    `;
  }

  @autobind
  getChartOption() {
    const { assetChangeReportData } = this.props;
    // x轴数据
    const xAxisData = filterXAxisDate(filterData(assetChangeReportData, 'date'));
    // 资金投入数据
    const fundInvestData = filterData(assetChangeReportData, 'inflowFund');
    // 资产市值数据
    const assetMarketData = filterData(assetChangeReportData, 'fundMarket');
    const option = {
      grid: {
        left: 0,
        right: 5,
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
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#ccc',
            type: 'dotted',
          }
        }
      },
      smooth: true,
      color: ['#485a7b', '#fe5f03'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(2, 22, 55, 0.8)',
        padding: 10,
        textStyle: {
          fontSize: 12,
        },
        formatter: this.tooltipFormat,
      },
      series: [
        {
          name: FUND_INVEST,
          type: 'line',
          symbol: 'none',
          data: fundInvestData,
        },
        {
          name: ASSET_MARKET,
          type: 'line',
          symbol: 'none',
          data: assetMarketData,
        },
      ],
    };
    return option;
  }
  render() {
    const { assetChangeReportData } = this.props;
    const option = this.getChartOption();
    const fundInvestValueCls = classnames([styles.value, styles.fundInvestValue]);
    const assetMarketValueCls = classnames([styles.value, styles.assetMarketValue]);
    return (
      <div className={styles.assetChangeChart}>
        {
          _.isEmpty(assetChangeReportData)
            ? null
            : (
              <div className={styles.chartBox}>
                <div className={styles.chartlegend}>
                  <div className={styles.column}>
                    <span className={fundInvestValueCls}>{FUND_INVEST}</span>
                  </div>
                  <div className={styles.column}>
                    <span className={assetMarketValueCls}>{ASSET_MARKET}</span>
                  </div>
                </div>
                <IECharts
                  option={option}
                  style={{ height: '260px' }}
                />
                <div className={styles.assetChangeTips}>
                  <div className={styles.label}>注：</div>
                  <div className={styles.value}>
                    <p>1.上图为统计期内资金投入与资产市值的变化情况。</p>
                    <p>2. 期初资产为统计期前一日资产市值。</p>
                    <p>3. 资金投入为每日累计净流入值。</p>
                  </div>
                </div>
              </div>
            )
        }
      </div>
    );
  }
}
