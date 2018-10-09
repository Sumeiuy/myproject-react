/*
 * @Author: zhangjun
 * @Descripter: 任务-客户分析报表
 * @Date: 2018-10-05 14:38:03
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-08 21:57:21
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import IECharts from '../IECharts';
import ReportTitle from './ReportTitle';
import ReportFilter from './ReportFilter';

import styles from './taskCustomerReport.less';

export default class TaskCustomerReport extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  @autobind
  handlefilterCallback(obj) {
    // 1.将值写入Url
    const { replace } = this.context;
    const { location } = this.props;
    const { query, pathname } = location;
    // 清空掉消息提醒页面带过来的 id
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        ...obj,
      },
    });
  }

  render() {
    const { location } = this.props;
    const options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        feature: {
          dataView: {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar']},
          restore: {show: true},
          saveAsImage: {show: true}
        }
      },
      legend: {
        data:['客户人次','任务数']
      },
      xAxis: [
        {
          type: 'time',
          data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
              formatter: '{value}'
          }
        },
        {
          type: 'value',
          min: 0,
          max: 25,
          interval: 5,
          axisLabel: {
              formatter: '{value}'
          }
        }
      ],
      series: [
        {
          name:'客户人次',
          type:'bar',
          data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
          name:'任务数',
          type:'line',
          yAxisIndex: 1,
          data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
      ]
  };
    return (
      <div className={styles.taskCustomerReport}>
        <ReportTitle title='每日触发任务及覆盖客户数' />
        <ReportFilter
          location={location}
          dateFilterName='任务触发时间'
          filterCallback={this.handlefilterCallback}
        />
        <IECharts
          option={options}
          resizable
          style={{
            height: '350px',
          }}
        />
      </div>
    );
  }
}
