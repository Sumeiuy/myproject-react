/*
 * @Author: zuoguangzu
 * @Date: 2018-10-17 14:16:31
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-10-23 20:12:32
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import IECharts from '../../IECharts';
import ChartLegend from '../ChartLegend';
import { number } from '../../../helper';

import styles from './eventAnalysisChart.less';
import imgSrc from '../../chartRealTime/noChart.png';

const { thousandFormat } = number;
export default function EventAnalysisChart(props) {
  //firstData指三个图表的第一个数据，secondData指第二个数据
  const {
    eventReportList,
    eventName,
    config,
    firstData,
    secondData,
    deadlineTimeData,
    reportType,
    thirdData,
    fourData,
  } = props;
  //legendList图例数据，color颜色，eventReportName图表名称，series图表数据，eventDataName图表数据名称
  const { legendList,color,eventReportName,series,eventDataName } = config;
  //firstName图表的提示框第一条数据名字，secondName是第二条名字
  let firstName = '';
  let secondName = '';
  let thirdName = '';
  let fourName = '';
  let seriesData = [];
  switch(reportType) {
    case 'task':
      const { triggerTaskName,completedTaskName } = eventDataName;
      firstName = triggerTaskName;
      secondName = completedTaskName;
      seriesData = [
        {
          name: firstName,
          data: firstData,
          ...series,
        },
        {
          name: secondName,
          data: secondData,
          ...series,
        },
      ];
      break;
    case 'customer':
      const { coveredCustomerName,completedCustomerName } = eventDataName;
      firstName = coveredCustomerName;
      secondName = completedCustomerName;
      seriesData = [
        {
          name: firstName,
          data: firstData,
          ...series,
        },
        {
          name: secondName,
          data: secondData,
          ...series,
        },
      ];
      break;
      case 'serviceChannels':
        const { zhangle,phone,interview,other } = eventDataName;
        firstName = zhangle;
        secondName = phone;
        thirdName = interview;
        fourName = other;
        seriesData = [
          {
            name: firstName,
            data: firstData,
            ...series,
          },
          {
            name: secondName,
            data: secondData,
            ...series,
          },
          {
            name: thirdName,
            data: thirdData,
            ...series,
          },
          {
            name: fourName,
            data: fourData,
            ...series,
          },
        ];
        break;
      default:
        break;
  }

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
      // 任务分析和客户分析报表有两条数据，服务渠道分析有四条数据判断是否是服务渠道分析
      if(params[2]) {
        const thirdSeriesName = params[2].seriesName;
        const thirdDataNumber = thousandFormat(params[2].value);
        const fourSeriesName = params[3].seriesName;
        const fourDataNumber = thousandFormat(params[3].value);
        const tips = `
          <div>
            ${deadlineTime}
            <div>${firstSeriesName}: ${firstDataNumber}</div>
            <div>${secondSeriesName}: ${secondDataNumber}</div>
            <div>${thirdSeriesName}: ${thirdDataNumber}</div>
            <div>${fourSeriesName}: ${fourDataNumber}</div>
          </div>
        `;
        return tips;
      }else{
        const tips = `
          <div>
            ${deadlineTime}
            <div>${firstSeriesName}: ${firstDataNumber}</div>
            <div>${secondSeriesName}: ${secondDataNumber}</div>
          </div>
        `;
        return tips;
      }
    },
    backgroundColor: 'rgba(2, 22, 55, .8)',
    padding: [12, 10, 12, 10],
    extraCssText:
      `box-shadow: 0 2px 4px 0 rgba(0,0,0,0.30);
        border-radius: 3px 3px 3px 0 0 3px 0 0 0;`,
  };
  const options = {
    color,
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
    series: seriesData,
  };
  return (
    <div>
      {
        !_.isEmpty(eventReportList)
        ?
        (
          <div className={styles.eventAnalysisChart}>
            <div className={styles.chartTitle}>
              { eventName }{ eventReportName }
            </div>
            <ChartLegend
              legendList={legendList}
              className='eventAnalysisChartLegend'
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

EventAnalysisChart.propTypes = {
  eventReportList: PropTypes.object.isRequired,
  eventName: PropTypes.string.isRequired,
  firstData: PropTypes.array.isRequired,
  secondData: PropTypes.array.isRequired,
  deadlineTimeData: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  reportType: PropTypes.string.isRequired,
  thirdData: PropTypes.array,
  fourData: PropTypes.array,
};

EventAnalysisChart.defaultProps = {
  thirdData:[],
  fourData:[],
};

