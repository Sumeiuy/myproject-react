/*
 * @Author: zhangjun
 * @Descripter: 任务-客户分析报表
 * @Date: 2018-10-05 14:38:03
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-09 20:51:31
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
      color: ['#6fb7ec', '#4c70b3'],
      textStyle: {
        color: '#333',
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
          data:['客户人次','任务数'],
          right: '30px',
      },
      xAxis: [
          {
              type: 'category',
              data: ['8月1日','8月2日','8月3日','8月4日','8月5日','8月6日','8月7日','8月8日','8月9日','8月10日','8月11日','8月12日','8月13日','8月14日','8月15日','8月16日','8月17日','8月18日','8月19日','8月20日','8月21日','8月22日','8月23日','8月24日'],
              axisPointer: {
                  type: 'shadow',
              },
              axisLabel: {
                interval: 7,
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
              data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
              name:'任务数',
              type:'line',
              data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3, 2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
              smooth: true,
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
