/*
 * @Author: zhangjun
 * @Descripter: 渠道变化趋势
 * @Date: 2018-10-12 15:30:10
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-12 17:15:25
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import IECharts from '../../IECharts';
import { generalOptions, serviceChannelOptions } from '../config';
import { number } from '../../../helper';
import { filterData } from '../utils';

import styles from './serviceChannelLineChart.less';
import imgSrc from '../../chartRealTime/noChart.png';

const { thousandFormat } = number;
const { yAxisSplitLine, textStyle, toolbox, gridOptions } = generalOptions;
const { color,
  legendData: {
    zhangle,
    message,
    telephone,
    interview,
  },
  series,
} = serviceChannelOptions;

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
    // title 配置项
    const title = {
      text: '渠道变化趋势',
      textStyle: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'normal',
      },
      padding: [0, 0, 0, 20],
    };
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
      title,
      grid: gridOptions,
      tooltip: tooltipOtions,
      legend: {
          data:[zhangle, message, telephone, interview],
          right: '20px',
      },
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
          name: message,
          type: 'line',
          data: messageData,
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
            <IECharts
              option={options}
              resizable
              style={{
                height: '350px',
              }}
            />
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
