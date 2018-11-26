/*
 * @Author: zhangjun
 * @Date: 2018-11-25 11:31:40
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-26 15:39:31
 * @description 账户收益走势图表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import IfWrap from '../../common/biz/IfWrap';
import IECharts from '../../IECharts';
import { filterData, filterXAxisDate } from '../utils';
import { ACCOUNT_DAILY_RATE, HS300_DAILY_RATE, ACCOUNT_CUMULATIVE_RATE, HS300_CUMULATIVE_RATE, profitTrendChartTip, NOT_EXCESS_BENEFIT_TEXT, EXCESS_BENEFIT_TEXT } from '../config';
import styles from './profitTrendChart.less';

export default class ProfitTrendChart extends PureComponent {
  static propTypes = {
    // 账户收益走势图表数据
    profitTrendData: PropTypes.object.isRequired,
  }

  @autobind
  tooltipFormat(params) {
    const { dataIndex } = params[0];
    const {
      profitTrendData: {
        profitTrendChartData = [],
      }
    } = this.props;
    // 账户收益走势图表返回的日期
    const filterDate = filterData(profitTrendChartData, 'date');
    const dateData = filterDate[dataIndex];
    return `
      <div>${dateData}</div>
      <div>${params[2].marker}${params[2].seriesName}: ${params[2].value}%</div>
      <div>${params[0].marker}${params[0].seriesName}: ${params[0].value}%</div>
      <div>${params[3].marker}${params[3].seriesName}: ${params[3].value}%</div>
      <div>${params[1].marker}${params[1].seriesName}: ${params[1].value}%</div>
    `;
  }

  // 图表配置项
  @autobind
  getChartOption() {
    const {
      profitTrendData: {
        profitTrendChartData = [],
      }
    } = this.props;
    // x轴数据
    const xAxisData = filterXAxisDate(filterData(profitTrendChartData, 'date'));
    // 账户日收益率数据
    const accountDailyRateData = filterData(profitTrendChartData, 'accountDailyRate');
    // 沪深300日收益率数据
    const HS300DailyRateData = filterData(profitTrendChartData, 'HS300DailyRate');
    // 账户累计收益率数据
    const accountCumulativeRateData = filterData(profitTrendChartData, 'accountCumulativeRate');
    // 沪深300累计收益率数据
    const HS300CumulativeRateData = filterData(profitTrendChartData, 'HS300CumulativeRate');
    const option = {
      grid: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        data: xAxisData,
        axisLabel: {
          color: '#666',
          fontSize: 12,
        },
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
        },
        axisLabel: {
          color: '#666',
          formatter: '{value} %',
          fontSize: 12,
        },
      },
      smooth: true,
      color: ['#485a7b', '#fe5f03', '#485a7b', '#fe5f03'],
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
          name: ACCOUNT_DAILY_RATE,
          type: 'bar',
          symbol: 'none',
          data: accountDailyRateData,
        },
        {
          name: HS300_DAILY_RATE,
          type: 'bar',
          symbol: 'none',
          data: HS300DailyRateData,
        },
        {
          name: ACCOUNT_CUMULATIVE_RATE,
          type: 'line',
          symbol: 'none',
          data: accountCumulativeRateData,
        },
        {
          name: HS300_CUMULATIVE_RATE,
          type: 'line',
          symbol: 'none',
          data: HS300CumulativeRateData,
        },
      ],
    };
    return option;
  }

  // 走势图总结概括文字
  @autobind
  getProfitTrendSummary() {
    const {
      profitTrendData: {
        accountCumulativeRate,
        HS300CumulativeRate,
      }
    } = this.props;
    let summaryText = `统计期内客，客户该账户累计收益率为${accountCumulativeRate}%，基准（沪深300指数）同期收益率为${HS300CumulativeRate}%，`;
    if (_.isNumber(accountCumulativeRate)
      && _.isNumber(HS300CumulativeRate)
      && accountCumulativeRate < HS300CumulativeRate
    ) {
      summaryText = `${summaryText}${NOT_EXCESS_BENEFIT_TEXT}`;
    } else {
      summaryText = `${summaryText}${EXCESS_BENEFIT_TEXT}`;
    }
    return summaryText;
  }

  render() {
    const {
      profitTrendData: {
        profitTrendChartData = [],
        timeRate,
      }
    } = this.props;
    const accountDailyRateCls = classnames([styles.value, styles.accountDailyRateValue]);
    const HS300DailyRateCls = classnames([styles.value, styles.HS300DailyRateValue]);
    const accountCumulativeRateCls = classnames([styles.value, styles.accountCumulativeRateValue]);
    const HS300CumulativeRateCls = classnames([styles.value, styles.HS300CumulativeRateValue]);
    const profitTrendTipData = _.map(profitTrendChartTip, item => <p>{item}</p>);
    const option = this.getChartOption();
    const profitTrendSummary = this.getProfitTrendSummary();
    return (
      <div className={styles.profitTrendChart}>
        <IfWrap isRender={!_.isEmpty(profitTrendChartData)}>
          <div className={styles.chartBox}>
            <div className={styles.chartlegend}>
              <div className={styles.column}>
                <span className={accountDailyRateCls}>{ACCOUNT_DAILY_RATE}</span>
              </div>
              <div className={styles.column}>
                <span className={HS300DailyRateCls}>{HS300_DAILY_RATE}</span>
              </div>
              <div className={styles.column}>
                <span className={accountCumulativeRateCls}>{ACCOUNT_CUMULATIVE_RATE}</span>
              </div>
              <div className={styles.column}>
                <span className={HS300CumulativeRateCls}>{HS300_CUMULATIVE_RATE}</span>
              </div>
            </div>
             <IECharts
              option={option}
              style={{ height: '260px' }}
            />
            <div className={styles.profitTrendTips}>
              <div className={styles.label}>注：</div>
              <div className={styles.value}>
                {profitTrendTipData}
              </div>
            </div>
            <div className={styles.profitTrendSummary}>
              <p className={styles.profitContrast}>{profitTrendSummary}</p>
              <p className={styles.timeRate}>报告期内，{timeRate}%的时间段客户投资收益战胜基准。</p>
            </div>
          </div>
        </IfWrap>
      </div>
    );
  }
}
