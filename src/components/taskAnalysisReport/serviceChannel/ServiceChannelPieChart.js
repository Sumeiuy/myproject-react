/*
 * @Author: zhangjun
 * @Descripter: 渠道占比分布
 * @Date: 2018-10-12 10:10:53
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-12 17:22:04
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import IECharts from '../../IECharts';
import { generalOptions, serviceChannelOptions } from '../config';

import styles from './serviceChannelPieChart.less';
import imgSrc from '../../chartRealTime/noChart.png';

const { textStyle, toolbox } = generalOptions;
const { color } = serviceChannelOptions;

export default function ServiceChannelPieChart(props) {
    const {
      proportionList,
    } = props;
    // title 配置项
    const title = {
      text: '渠道占比分布',
      textStyle: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'normal',
      },
      padding: [0, 0, 0, 20],
    };
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
    // legend 配置项
    const legend = (proportionList && proportionList.length > 0)
      ? {
        data:[
          {
            name: proportionList[0].name,
            icon: 'rect',
          },
          {
            name: proportionList[1].name,
            icon: 'rect',
          },
          {
            name: proportionList[2].name,
            icon: 'rect',
          },
          {
            name: proportionList[3].name,
            icon: 'rect',
          }
        ],
        orient: 'vertical',
        right: '80px',
        bottom: '70px',
      } : {};
    const options = {
      color,
      textStyle,
      toolbox,
      title,
      tooltip: tooltipOtions,
      legend,
      series: [{
        type: 'pie',
        radius: ['50%', '70%'],
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          },
        },
        data: proportionList,
      }],
    };
    return (
      <div className={styles.serviceChannelPieChart}>
        {
          (proportionList && proportionList.length > 0)
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

ServiceChannelPieChart.propTypes = {
  // 报表数据
  proportionList: PropTypes.array.isRequired,
};
