/*
 * @Author: zuoguangzu
 * @Date: 2018-10-17 14:16:31
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-10-18 23:57:10
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import IECharts from '../../IECharts';
import ChartLegend from '../ChartLegend';
import { filterData } from '../utils';
import { number } from '../../../helper';

import styles from './serviceChannelsChangeChart.less';
import imgSrc from '../../chartRealTime/noChart.png';

const { thousandFormat } = number;
const legendList = [
  {
    color: '#f7ad33',
    name: '涨乐',
    type: 'line',
  },
  {
    color: '#4c70b3',
    name: '短信',
    type: 'line',
  },
  {
    color: '#67b8e1',
    name: '电话',
    type: 'line',
  },
  {
    color: '#cf4b4a',
    name: '面谈',
    type: 'line',
  }
];
export default function ServiceChannelsChangeChart(props) {
  const {
    eventReportList,
    eventName,
    eventReportList: {
      zhangle = [],
      shortMessage = [],
      phone = [],
      interview = [],
    }
  } = props;
  // 涨乐数据
  const zhangleData = filterData(zhangle, 'percentage');
  // 短信数据
  const shortMessageData = filterData(shortMessage, 'percentage');
  // 电话数据
  const phoneData = filterData(phone, 'percentage');
  // 面谈数据
  const interviewData = filterData(interview, 'percentage');
  // xAxis轴截止时间数据
  const deadlineTimeData = filterData(zhangle, 'deadlineTime');
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
      const thirdSeriesName = params[2].seriesName;
      const thirdDataNumber = thousandFormat(params[2].value);
      const fourSeriesName = params[3].seriesName;
      const fourDataNumber = thousandFormat(params[3].value);
      const tips = `
        <div>
          ${deadlineTime}
          <div>${firstSeriesName}: ${firstDataNumber}%</div>
          <div>${secondSeriesName}: ${secondDataNumber}%</div>
          <div>${thirdSeriesName}: ${thirdDataNumber}%</div>
          <div>${fourSeriesName}: ${fourDataNumber}%</div>
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
    color: ['#f7ad33', '#4c70b3', '#67b8e1', '#cf4b4a'],
    toolbox: {
      show: false,
    },
    tooltip: tooltipOtions,
    xAxis: [
      {
        type: 'category',
        data: deadlineTimeData,
        axisLabel: {
          interval: 0,
          margin: 20,
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          margin: 20,
        }
      },
    ],
    series: [
      {
        name: '涨乐',
        type: 'line',
        data: zhangleData,
        smooth: true,
      },
      {
        name: '短信',
        type: 'line',
        data: shortMessageData,
        smooth: true,
      },
      {
        name: '电话',
        type: 'line',
        data: phoneData,
        smooth: true,
      },
      {
        name: '面谈',
        type: 'line',
        data: interviewData,
        smooth: true,
      },
    ],
  };
  return (
    <div>
      {
        !_.isEmpty(eventReportList)
        ?
        (
          <div className={styles.serviceChannelsChangeChart}>
            <div className={styles.chartTitle}>
              <span>{ eventName }</span>服务渠道变化
            </div>
            <ChartLegend
              legendList={legendList}
              className='taskStatisticsChartLegend'
            />
            <IECharts
              option={options}
              resizable
              style={{
                height: '300px',
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

ServiceChannelsChangeChart.propTypes = {
  eventReportList: PropTypes.object.isRequired,
};

