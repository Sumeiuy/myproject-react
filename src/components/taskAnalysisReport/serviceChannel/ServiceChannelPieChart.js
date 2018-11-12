/*
 * @Author: zhangjun
 * @Descripter: 渠道占比分布
 * @Date: 2018-10-12 10:10:53
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-08 22:43:01
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import IECharts from '../../IECharts';
import ChartLegend from '../ChartLegend';
import { generalOptions, serviceChannelOptions } from '../config';

import styles from './serviceChannelPieChart.less';
import imgSrc from '../../chartRealTime/noChart.png';

const { textStyle, toolbox } = generalOptions;
const {
  color,
  legendOptions,
} = serviceChannelOptions;

const legendList = _.map(legendOptions, item => ({...item, type: 'square'}));

export default function ServiceChannelPieChart(props) {
    const {
      proportionList,
    } = props;
    // tooltip 配置项
    const tooltipOtions = {
      trigger: 'item',
      formatter(params) {
        const { name, value, percentage } = params.data;
        const tips = `
          <div class="echartTooltipTable">
            <span class="echartTooltipName">
              ${name}
            </span>
            （${value}、${percentage}%）
          </div>
        `;
        return tips;
      },
      backgroundColor: 'transparent',
      textStyle: {
        color: '#333',
        fontSize: 12,
      }
    };
    const options = {
      color,
      textStyle,
      toolbox,
      tooltip: tooltipOtions,
      series: [{
        type: 'pie',
        radius: ['40%', '60%'],
        itemStyle: {
          normal: {
            shadowBlur: 8,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
          emphasis: {
            shadowBlur: 8,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          }
        },
        label: {
          normal: {
            formatter(params) {
              const { name, value, percentage } = params.data;
              return `${name}（${value}、${percentage}%）`;
            },
          },
          emphasis: {
            show: false,
          },
        },
        data: proportionList,
      }],
    };
    return (
      <div className={styles.serviceChannelPieChartWrapper}>
        {
          (proportionList && proportionList.length > 0)
          ?
          (
            <div>
              <div className={styles.chartTitle}>
                服务渠道占比统计
              </div>
              <div className={styles.serviceChannelPieChart}>
                <div className={styles.serviceChannelPie}>
                  <IECharts
                    option={options}
                    resizable
                    style={{
                      height: '310px',
                    }}
                  />
                </div>
                <div className={styles.serviceChannelPieLegend}>
                  <ChartLegend
                    legendList={legendList}
                    className="pieLegend"
                  />
                </div>
              </div>
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

ServiceChannelPieChart.propTypes = {
  // 报表数据
  proportionList: PropTypes.array.isRequired,
};
