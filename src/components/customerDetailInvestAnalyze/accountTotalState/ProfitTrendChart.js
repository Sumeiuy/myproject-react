/*
 * @Author: zhangjun
 * @Date: 2018-11-25 11:31:40
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-11 15:09:32
 * @description 账户收益走势图表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import IfWrap from '../../common/biz/IfWrap';
import IECharts from '../../IECharts';
import Summary from '../Summary';
import { data } from '../../../helper';
import { filterData, filterXAxisDate } from '../utils';
import {
  ACCOUNT_DAILY_RATE,
  HS300_DAILY_RATE,
  ACCOUNT_CUMULATIVE_RATE,
  HS300_CUMULATIVE_RATE,
  profitTrendChartTip,
  NOT_EXCESS_BENEFIT_TEXT,
  EXCESS_BENEFIT_TEXT, chartOption,
} from '../config';
import styles from './profitTrendChart.less';

export default class ProfitTrendChart extends PureComponent {
  static propTypes = {
    // 账户收益走势图表数据
    profitTrendData: PropTypes.object.isRequired,
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
    const hs300DailyRateData = filterData(profitTrendChartData, 'hs300DailyRate');
    // 账户累计收益率数据
    const accountCumulativeRateData = filterData(profitTrendChartData, 'accountCumulativeRate');
    // 沪深300累计收益率数据
    const hs300CumulativeRateData = filterData(profitTrendChartData, 'hs300CumulativeRate');
    const {
      xAxis,
      tooltip,
      yAxis,
    } = chartOption;
    const option = {
      ...chartOption,
      xAxis: {
        ...xAxis,
        data: xAxisData,
      },
      yAxis: {
        ...yAxis,
        axisLabel: {
          ...yAxis.axisLabel,
          formatter: '{value}%',
        },
      },
      color: ['#485a7b', '#fe5f03', '#485a7b', '#fe5f03'],
      tooltip: {
        ...tooltip,
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
          data: hs300DailyRateData,
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
          data: hs300CumulativeRateData,
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
        hs300CumulativeRate,
      }
    } = this.props;
    let summaryText = `统计期内客，客户该账户累计收益率为${accountCumulativeRate}%，基准（沪深300指数）同期收益率为${hs300CumulativeRate}%，`;
    if (_.isNumber(accountCumulativeRate)
      && _.isNumber(hs300CumulativeRate)
      && accountCumulativeRate < hs300CumulativeRate
    ) {
      summaryText = `${summaryText}${NOT_EXCESS_BENEFIT_TEXT}`;
    } else {
      summaryText = `${summaryText}${EXCESS_BENEFIT_TEXT}`;
    }
    return summaryText;
  }

  // 图表浮层提示框
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

  // echart渲染完，默认需要显示资金投入最大的toopTip
  @autobind
  handleReady(instance) {
    const {
      profitTrendData: {
        profitTrendChartData = [],
      }
    } = this.props;
    // 账户日收益率数据
    const accountDailyRateData = filterData(profitTrendChartData, 'accountDailyRate');
    // 账户日收益率最大的dataIndex
    const dataIndex = _.findIndex(accountDailyRateData,
      item => (item === _.max(accountDailyRateData)));
    // 显示series是资金投入，数据是dataIndex的toolTip
    setTimeout(() => {
      instance.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex,
      });
    }, 0);
  }

  render() {
    const {
      profitTrendData: {
        profitTrendChartData = [],
        timeRate,
      }
    } = this.props;
    // 账户日收益率样式
    const accountDailyRateCls = classnames([styles.value, styles.accountDailyRateValue]);
    // 沪深300日收益率样式
    const hs300DailyRateCls = classnames([styles.value, styles.hs300DailyRateValue]);
    // 账户累计收益率样式
    const accountCumulativeRateCls = classnames([styles.value, styles.accountCumulativeRateValue]);
    // 沪深300累计收益率样式
    const hs300CumulativeRateCls = classnames([styles.value, styles.hs300CumulativeRateValue]);
    // 账户收益走势图提示
    const profitTrendTipData = _.map(profitTrendChartTip, item => <p key={data.uuid()}>{item}</p>);
    // 图表配置项
    const option = this.getChartOption();
    // 走势图总结概括文字
    const profitTrendSummary = this.getProfitTrendSummary();
    // 时间占比
    const timeRateText = `报告期内，${timeRate}%的时间段客户投资收益战胜基准。`;
    return (
      <div className={styles.profitTrendChart}>
        <IfWrap
          isRender={!_.isEmpty(profitTrendChartData)}
          isUsePlaceholderImage
        >
          <div className={styles.chartBox}>
            <div className={styles.chartlegend}>
              <div className={styles.column}>
                <span className={accountDailyRateCls}>{ACCOUNT_DAILY_RATE}</span>
              </div>
              <div className={styles.column}>
                <span className={hs300DailyRateCls}>{HS300_DAILY_RATE}</span>
              </div>
              <div className={styles.column}>
                <span className={accountCumulativeRateCls}>{ACCOUNT_CUMULATIVE_RATE}</span>
              </div>
              <div className={styles.column}>
                <span className={hs300CumulativeRateCls}>{HS300_CUMULATIVE_RATE}</span>
              </div>
            </div>
            <IECharts
              option={option}
              style={{ height: '260px' }}
              resizable
              onReady={this.handleReady}
            />
            <div className={styles.profitTrendTips}>
              <div className={styles.label}>注：</div>
              <div className={styles.value}>
                {profitTrendTipData}
              </div>
            </div>
            <Summary>
              <p className={styles.profitContrast}>
                <span>{profitTrendSummary}</span>
              </p>
              <p className={styles.timeRate}>
                <span>{timeRateText}</span>
              </p>
            </Summary>
          </div>
        </IfWrap>
      </div>
    );
  }
}
