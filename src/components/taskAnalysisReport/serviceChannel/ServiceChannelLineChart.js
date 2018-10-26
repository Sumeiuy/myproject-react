/*
 * @Author: zhangjun
 * @Descripter: 渠道变化趋势
 * @Date: 2018-10-12 15:30:10
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-26 09:54:56
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
  other,
  telephone,
  interview,
  legendOptions,
  gridOptions,
  series,
} = serviceChannelOptions;

const legendList = _.map(legendOptions, item => ({...item, type: 'line'}));

// 获取xAxis轴刻度标签的显示间隔
function getXAxisLabelInterval(length) {
  // 超过10条小于60条按周显示
  if (length > 10 && length <= 60) {
    return 6;
  // 超过60条按月显示
  } else if (length > 60) {
    return 30;
  }
  return 0;
}

export default function ServiceCustChart(props) {
    const {
      trendData,
      trendData: {
        // 涨乐列表数据
        zhangleList,
        // 电话列表数据
        telephoneList,
        // 面谈列表数据
        interviewList,
        // 其他列表数据
        otherList,
      },
    } = props;
    // 涨乐数据
    const zhangleData = filterData(zhangleList, 'value');
    // 短信数据
    const otherData = filterData(otherList, 'value');
    // 电话数据
    const telephoneData = filterData(telephoneList, 'value');
    // 面谈数据
    const interviewData = filterData(interviewList, 'value');
    // xAxis轴截止时间数据
    const deadlineTimeData = filterData(zhangleList, 'deadlineTime');
    // xAxis轴刻度标签的显示间隔, 超过30天，则横坐标改为按周展示
    const xAxisLabelInterval = getXAxisLabelInterval(deadlineTimeData.length);
    // tooltip 配置项
    const tooltipOtions = {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
      formatter(params) {
        const deadlineTime = params[0].name;
        const zhangleSeriesName = params[0].seriesName;
        const zhangleDataNumber = thousandFormat(params[0].value);
        const telephoneSeriesName = params[1].seriesName;
        const telephoneDataNumber = thousandFormat(params[1].value);
        const interviewSeriesName = params[2].seriesName;
        const interviewDataNumber = thousandFormat(params[2].value);
        const otherSeriesName = params[3].seriesName;
        const otherDataNumber = thousandFormat(params[3].value);
        const tips = `
          <div class="echartTooltipTable">
            ${deadlineTime}
            <div>${zhangleSeriesName}: ${zhangleDataNumber}</div>
            <div>${telephoneSeriesName}: ${telephoneDataNumber}</div>
            <div>${interviewSeriesName}: ${interviewDataNumber}</div>
            <div>${otherSeriesName}: ${otherDataNumber}</div>
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
          boundaryGap: false,
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
          axisTick: {
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
        },
        {
          name: other,
          type: 'line',
          data: otherData,
          ...other,
          ...series,
        },
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
                服务渠道变化趋势
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
