/*
 * @Author: zuoguangzu
 * @Date: 2018-10-17 14:16:31
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-10-22 15:02:01
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import IECharts from '../../IECharts';
import ChartLegend from '../ChartLegend';
import { filterData } from '../utils';
import { number } from '../../../helper';
import { taskOption } from '../config';

import styles from './taskStatisticsChart.less';
import imgSrc from '../../chartRealTime/noChart.png';

const { thousandFormat } = number;
const { legendList,color,eventReportName,eventReportOption } = taskOption;
export default function TaskStatisticsChart(props) {
  const {
    eventReportList,
    eventName,
    eventReportList: {
      triggerTaskList = [],
      completedTaskList = [],
      coveredCustomersList = [],
      completedCustomersList = [],
      zhangleList = [],
      shortMessageList = [],
      phoneList = [],
      interviewList = [],
    }
  } = props;
  const dataKeys = _.keys(eventReportOption);
  const dataValues = _.values(eventReportOption);
  // 第一组数据
  const triggerTaskData = filterData(triggerTaskList, 'triggerTaskNumber');
  // 完成任务数数据
  const completedTaskData = filterData(completedTaskList, 'completedTaskNumber');
  // 覆盖客户数数据
  const coveredCustomersData = filterData(coveredCustomersList, 'coveredCustomersNumber');
  // 完成客户数数据
  const completedCustomersData = filterData(completedCustomersList, 'completedCustomersNumber');
  // 涨乐数据
  const zhangleData = filterData(zhangleList, 'percentage');
  // 短信数据
  const shortMessageData = filterData(shortMessageList, 'percentage');
  // 电话数据
  const phoneData = filterData(phoneList, 'percentage');
  // 面谈数据
  const interviewData = filterData(interviewList, 'percentage');
  // xAxis轴截止时间数据
  const deadlineTimeData = filterData(triggerTaskList, 'deadlineTime');

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
    color: color,
    toolbox: {
      show: false,
    },
    tooltip: tooltipOtions,
    xAxis: [
      {
        type: 'category',
        data: deadlineTimeData,
        boundaryGap: false,
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
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#979797',
            type: 'dotted',
          }
        }
      },
    ],
    series: [
      {
        name: '已触发任务数',
        type: 'line',
        data: triggerTaskData,
        smooth: true,
        symbol: 'none',
      },
      {
        name: '已完成任务数',
        type: 'line',
        data: completedTaskData,
        smooth: true,
        symbol: 'none',
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
              { eventName }{ eventReportName }
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

