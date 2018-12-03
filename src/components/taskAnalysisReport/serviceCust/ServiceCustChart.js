/*
 * @Author: zhangjun
 * @Descripter: 服务客户折线图
 * @Date: 2018-10-11 13:18:12
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-19 12:03:18
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import IECharts from '../../IECharts';
import ChartLegend from '../ChartLegend';
import { generalOptions, chartLineOptions } from '../config';
import { number } from '../../../helper';
import { filterData } from '../utils';

import styles from './serviceCustChart.less';
import imgSrc from '../../chartRealTime/noChart.png';

const { thousandFormat } = number;
const { yAxisSplitLine, textStyle, toolbox } = generalOptions;
const { color, series, gridOptions } = chartLineOptions;

export default function ServiceCustChart(props) {
  const {
    reportList,
    serviceCustOptions,
    legendList,
  } = props;
  const dataKeys = _.keys(serviceCustOptions);
  const dataValues = _.values(serviceCustOptions);
  // 第一组数据
  const firstData = filterData(reportList, dataKeys[0]);
  // 第二组数据
  const secondData = filterData(reportList, dataKeys[1]);
  // xAxis轴截止时间数据
  const deadlineTimeData = filterData(reportList, 'deadlineTime');
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
        name: dataValues[0],
        type: 'line',
        data: firstData,
        ...series,
      },
      {
        name: dataValues[1],
        type: 'line',
        data: secondData,
        ...series,
      }
    ]
  };
  return (
    <div className={styles.serviceCustChart}>
      {
          (reportList && reportList.length > 0)
            ? (
              <div>
                <ChartLegend
                  legendList={legendList}
                  className="lineLegend"
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
            : (
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
  reportList: PropTypes.array.isRequired,
  // 配置项
  serviceCustOptions: PropTypes.object.isRequired,
  // 图例配置项
  legendList: PropTypes.array.isRequired,
};
