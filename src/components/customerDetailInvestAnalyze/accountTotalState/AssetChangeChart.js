/*
 * @Author: zhangjun
 * @Date: 2018-11-23 09:25:41
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-11 22:51:01
 * @description 资产变动报表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import IfWrap from '../../common/biz/IfWrap';
import { number, data } from '../../../helper';
import IECharts from '../../IECharts';
import { filterData, filterXAxisDate } from '../utils';
import {
  FUND_INVEST, ASSET_MARKET, assetChangeChartTip, chartOption
} from '../config';

import styles from './assetChangeChart.less';

const { thousandFormat } = number;

export default class AssetChangeChart extends PureComponent {
  static propTypes = {
    // 账户资产变动图表数据
    assetChangeReportData: PropTypes.array.isRequired,
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
    const { xAxis, tooltip } = chartOption;
    const option = {
      ...chartOption,
      xAxis: {
        ...xAxis,
        boundaryGap: false,
        data: xAxisData,
      },
      color: ['#485a7b', '#fe5f03'],
      tooltip: {
        ...tooltip,
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

  // echart渲染完，默认需要显示资金投入最大的toopTip
  @autobind
  handleReady(instance) {
    const { assetChangeReportData } = this.props;
    // 资金投入数据
    const fundInvestData = _.map(assetChangeReportData, item => _.toNumber(item.inflowFund));
    // 资金投入最大的dataIndex
    const dataIndex = _.findIndex(fundInvestData, item => (item === _.max(fundInvestData)));
    // 显示series是资金投入，数据是dataIndex的toolTip
    // 图表所有数据加载完成，调用dispatchAction方法显示浮层提示框
    // 参考网址：https://blog.csdn.net/u013558749/article/details/83826672
    setTimeout(() => {
      instance.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex,
      });
    }, 0);
  }

  render() {
    const { assetChangeReportData } = this.props;
    const option = this.getChartOption();
    const fundInvestValueCls = classnames([styles.value, styles.fundInvestValue]);
    const assetMarketValueCls = classnames([styles.value, styles.assetMarketValue]);
    const assetChangeTipData = _.map(assetChangeChartTip, item => <p key={data.uuid()}>{item}</p>);
    return (
      <div className={styles.assetChangeChart}>
        <IfWrap
          isRender={!_.isEmpty(assetChangeReportData)}
          isUsePlaceholderImage
        >
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
              resizable
              onReady={this.handleReady}
            />
            <div className={styles.assetChangeTips}>
              <div className={styles.label}>注：</div>
              <div className={styles.value}>
                {assetChangeTipData}
              </div>
            </div>
          </div>
        </IfWrap>
      </div>
    );
  }
}
