/*
 * @Author: zuoguangzu
 * @Date: 2018-10-17 14:16:31
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-10-18 18:00:17
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import IECharts from '../../IECharts';
import ChartLegend from '../ChartLegend';
import { filterData } from '../utils';
import { number } from '../../../helper';

import styles from './taskStatisticsChart.less';
import imgSrc from '../../chartRealTime/noChart.png';

const { thousandFormat } = number;
const legendList = [
  {
    color: '#f7ad33',
    name: '触发任务数',
    type: 'line',
  },
  {
    color: '#4c70b3',
    name: '剩余任务数',
    type: 'line',
  }
];
export default function TaskStatisticsChart(props) {
  const {
    eventReportList,
    eventName,
    eventReportList: {
      triggerTask = [],
      completedTask = [],
    }
  } = props;
  // 触发任务数数据
  const triggerTaskData = filterData(triggerTask, 'triggerTaskNumber');
  // 完成任务数数据
  const completedTaskData = filterData(completedTask, 'completedTaskNumber');
  // xAxis轴截止时间数据
  const deadlineTimeData = filterData(triggerTask, 'deadlineTime');
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
        <div>
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
    color: ['#f7ad33', '#4c70b3'],
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
        name: '已触发任务数',
        type: 'line',
        data: triggerTaskData,
        smooth: true,
      },
      {
        name: '已完成任务数',
        type: 'line',
        data: completedTaskData,
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
          <div className={styles.taskStatisticsChart}>
            <div className={styles.chartTitle}>
                <span>{ eventName }</span>任务统计
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

TaskStatisticsChart.propTypes = {
  eventReportList: PropTypes.object.isRequired,
  eventName: PropTypes.string.isRequired,
};

