/*
 * @Author: zhangjun
 * @Date: 2018-11-27 17:35:41
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-03 21:15:11
 * @description 归因图表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import IfWrap from '../../common/biz/IfWrap';
import IECharts from '../../IECharts';
import {
  chartOption, EQUITY_TYPE, SOLID_RECOVERY_TYPE, CURRENCY_TYPE
} from '../config';
import { filterData, filterXAxisDate } from '../utils';
import styles from './attributionChart.less';

export default class AttributionChart extends PureComponent {
  static propTypes = {
    // brinson归因趋势
    attributionTrend: PropTypes.array.isRequired,
  }

  // 图表配置项
  @autobind
  getChartOption() {
    const { attributionTrend } = this.props;
    // x轴数据
    const xAxisData = filterXAxisDate(filterData(attributionTrend, 'date'));
    // 权益类收益率数据
    const equityRateData = filterData(attributionTrend, 'equityRate');
    // 固收类收益率数据
    const solidRecoveryRateData = filterData(attributionTrend, 'solidRecoveryRate');
    // 货币类收益率数据
    const currencyRateData = filterData(attributionTrend, 'currencyRate');
    const { xAxis, tooltip } = chartOption;
    const option = {
      ...chartOption,
      xAxis: {
        ...xAxis,
        boundaryGap: false,
        data: xAxisData,
      },
      color: ['#485a7b', '#ffd500', '#fe5f03'],
      tooltip: {
        ...tooltip,
        formatter: this.tooltipFormat,
      },
      series: [
        {
          name: EQUITY_TYPE,
          type: 'line',
          symbol: 'none',
          data: equityRateData,
        },
        {
          name: SOLID_RECOVERY_TYPE,
          type: 'line',
          symbol: 'none',
          data: solidRecoveryRateData,
        },
        {
          name: CURRENCY_TYPE,
          type: 'line',
          symbol: 'none',
          data: currencyRateData,
        },
      ],
    };
    return option;
  }

  // 图表浮层提示框
  @autobind
  tooltipFormat(params) {
    const { dataIndex } = params[0];
    const { attributionTrend } = this.props;
    // 账户收益走势图表返回的日期
    const filterDate = filterData(attributionTrend, 'date');
    const dateData = filterDate[dataIndex];
    return `
      <div>${dateData}</div>
      <div>${params[0].marker}${params[0].seriesName}: ${params[0].value}%</div>
      <div>${params[1].marker}${params[1].seriesName}: ${params[1].value}%</div>
      <div>${params[2].marker}${params[2].seriesName}: ${params[2].value}%</div>
    `;
  }

  render() {
    const { attributionTrend } = this.props;
    // 图表配置项
    const option = this.getChartOption();
    // 权益类样式
    const equityRateCls = classnames([styles.value, styles.equityRateValue]);
    // 固收类样式
    const solidRecoveryRateCls = classnames([styles.value, styles.solidRecoveryRateValue]);
    // 权益类样式
    const currencyRateCls = classnames([styles.value, styles.currencyRateValue]);
    return (
      <div className={styles.attributionChart}>
        <div className={styles.title}>统计期 Brinson 归因趋势</div>
        <IfWrap isRender={!_.isEmpty(attributionTrend)}>
          <div className={styles.chartlegend}>
            <div className={styles.column}>
              <span className={equityRateCls}>{EQUITY_TYPE}</span>
            </div>
            <div className={styles.column}>
              <span className={solidRecoveryRateCls}>{SOLID_RECOVERY_TYPE}</span>
            </div>
            <div className={styles.column}>
              <span className={currencyRateCls}>{CURRENCY_TYPE}</span>
            </div>
          </div>
          <IECharts
            option={option}
            style={{ height: '210px' }}
          />
        </IfWrap>
      </div>
    );
  }
}
