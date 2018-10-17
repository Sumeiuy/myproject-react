/*
 * @Author: zhangjun
 * @Descripter: 渠道变化趋势
 * @Date: 2018-10-12 15:30:10
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-16 13:32:18
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import IECharts from '../../IECharts';
import ChartLegend from '../ChartLegend';
import { generalOptions, serviceChannelOptions } from '../config';
import { number } from '../../../helper';
import { filterData } from '../utils';

import styles from './serviceChannelLineChart.less';
import imgSrc from '../../chartRealTime/noChart.png';

const { thousandFormat } = number;
const { yAxisSplitLine, textStyle, toolbox } = generalOptions;
const {
  color,
  zhangle,
  message,
  telephone,
  interview,
  legendOptions,
  gridOptions,
  series,
} = serviceChannelOptions;

const legendList = _.map(legendOptions, item => ({...item, type: 'line'}));

export default function ServiceCustChart(props) {
    const {
      trendData,
      trendData: {
        // 涨乐列表数据
        zhangleList,
        // 短信列表数据
        messageList,
        // 电话列表数据
        telephoneList,
        // 面谈列表数据
        interviewList,
      },
    } = props;
    // 涨乐数据
    const zhangleData = filterData(zhangleList, 'value');
    // 短信数据
    const messageData = filterData(messageList, 'value');
    // 电话数据
    const telephoneData = filterData(telephoneList, 'value');
    // 面谈数据
    const interviewData = filterData(interviewList, 'value');
    // xAxis轴截止时间数据
    const deadlineTimeData = filterData(zhangleList, 'deadlineTime');
    // xAxis轴刻度标签的显示间隔, 超过30天，则横坐标改为按周展示
    const xAxisLabelInterval = deadlineTimeData.length > 30 ? 6 : 0;
    // tooltip 配置项
    const tooltipOtions = {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
      formatter(params) {
        const deadlineTime = params[0].name;
        const firstSeriesName = params[0].seriesName;
        const firstDataNumber = thousandFormat(params[0].value);
        const secondSeriesName = params[1].seriesName;
        const secondDataNumber = thousandFormat(params[1].value);
        const tips = `
          <div class="echartTooltipTable">
            ${deadlineTime}
            <div>${firstSeriesName}: ${firstDataNumber}</div>
            <div>${secondSeriesName}: ${secondDataNumber}</div>
          </div>
        `;
        return tips;
      },
      backgroundColor: 'rgba(2, 22, 55, .8)',
      padding: [12, 10, 12, 10],
      extraCssText:
        `box-shadow: 0 2px 4px 0 rgba(0,0,0,0.30);
          border-radius: 3px 3px 3px 0 0 3px 0 0 0;`,
    };
    const options = {
      color,
      textStyle,
      toolbox,
      grid: gridOptions,
      tooltip: tooltipOtions,
      xAxis: [
        {
          type: 'category',
          data: deadlineTimeData,
          axisLabel: {
            interval: xAxisLabelInterval,
            margin: 20,
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: false,
          },
          axisLabel: {
            margin: 20,
          },
          splitLine: yAxisSplitLine,
        },
      ],
      series: [
        {
          name: zhangle,
          type: 'line',
          data: zhangleData,
          ...series,
        },
        {
          name: zhangle,
          type: 'line',
          data: messageData,
          ...message,
          ...series,
        },
        {
          name: telephone,
          type: 'line',
          data: telephoneData,
          ...series,
        },
        {
          name: interview,
          type: 'line',
          data: interviewData,
          ...series,
        }
      ]
    };
    return (
      <div className={styles.serviceChannelLineChart}>
        {
          !_.isEmpty(trendData)
          ?
          (
            <div>
              <div className={styles.chartTitle}>
                渠道变化趋势
              </div>
              <ChartLegend
                legendList={legendList}
                className='serviceChannelLineLegend'
              />
              <IECharts
                option={options}
                resizable
                style={{
                  height: '310px',
                }}
              />
            </div>
          )
          :
          (
            <div className={styles.noChart}>
              <img src={imgSrc} alt="图表不可见" />
            </div>
          )
        }
      </div>
    );
}

ServiceCustChart.propTypes = {
  // 报表数据
  trendData: PropTypes.object.isRequired,
};
