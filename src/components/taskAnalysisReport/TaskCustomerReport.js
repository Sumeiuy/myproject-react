/*
 * @Author: zhangjun
 * @Descripter: 任务-客户分析报表
 * @Date: 2018-10-05 14:38:03
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-11 09:20:38
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import IECharts from '../IECharts';
import ReportTitle from './ReportTitle';
import ReportFilter from './ReportFilter';
import { defaultStartTime, defaultEndTime, taskCustomerOptions, gridOptions, CUSTOMEER_NUMBER_NAME, TASK_NUMBER_NAME } from './config';
import { emp, number } from '../../helper';
import { filterData } from './utils';

import styles from './taskCustomerReport.less';

const { thousandFormat } = number;
const { color, textStyle, toolbox, yAxisSplitLine } = taskCustomerOptions;

export default class TaskCustomerReport extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 任务-客户报表
    taskCustomerList: PropTypes.array.isRequired,
    // 获取任务-客户报表
    getTaskCustomer: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 任务触发开始时间
      startTime: defaultStartTime,
      // 任务触发结束时间
      endTime: defaultEndTime,
      // 执行类型
      executeType: '',
      // 事件来源
      eventSource: '',
    };
  }

  componentDidMount() {
    const { startTime, endTime } = this.state;
    // 获取任务-客户报表
    this.getTaskCustomer({
      startTime,
      endTime,
    });
  }

  // 获取任务-客户报表
  @autobind
  getTaskCustomer(query) {
    this.props.getTaskCustomer({
      ...query,
      orgId: emp.getOrgId(),
    });
  }

  // 头部筛选回调函数
  @autobind
  handlefilterCallback(obj) {
    this.setState({
      ...obj,
    }, () => {
      const query = this.state;
      this.getTaskCustomer(query);
    });
  }

  render() {
    const {
      location,
      taskCustomerList,
    } = this.props;
    const {
      startTime,
      endTime,
      executeType,
      eventSource,
    } = this.state;
    // 客户人次数据
    const customerNumberData = filterData(taskCustomerList, 'customerNumber');
    // 客户人次最大值
    const customerNumberMax =  Math.max.apply(null, customerNumberData);
    // 任务数数据
    const taskNumberData = filterData(taskCustomerList, 'taskNumber');
    // 任务数最大值
    const taskNumberMax =  Math.max.apply(null, taskNumberData);
    // 任务数间隔
    // xAxis轴触发时间数据
    const triggerTimeData = filterData(taskCustomerList, 'triggerTime');
    // xAxis轴刻度标签的显示间隔, 超过30天，则横坐标改为按周展示
    const xAxisLabelInterval = triggerTimeData.length > 30 ? 6 : 0;
    // tooltip 配置项
    const tooltipOtions = {
      trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter(params) {
          const triggerTime = params[0].name;
          const customerSeriesName = params[0].seriesName;
          const customerNumber = thousandFormat(params[0].value);
          const taskSeriesName = params[1].seriesName;
          const taskNumber = thousandFormat(params[1].value);
          const tips = `
            <div class="echartTooltipTable">
              ${triggerTime}
              <div>${customerSeriesName}: ${customerNumber}</div>
              <div>${taskSeriesName}: ${taskNumber}</div>
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
      legend: {
          data:[CUSTOMEER_NUMBER_NAME, TASK_NUMBER_NAME],
          right: '20px',
      },
      xAxis: [
        {
          type: 'category',
          data: triggerTimeData,
          axisPointer: {
              type: 'shadow',
          },
          axisLabel: {
            interval: xAxisLabelInterval,
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: customerNumberMax,
          axisLine: {
            show: false,
          },
          splitLine: yAxisSplitLine,
        },
        {
          type: 'value',
          min: 0,
          max: taskNumberMax,
          axisLine: {
            show: false,
          },
          splitLine: yAxisSplitLine,
        }
      ],
      series: [
        {
          name: CUSTOMEER_NUMBER_NAME,
          type: 'bar',
          data: customerNumberData,
        },
        {
          name: TASK_NUMBER_NAME,
          type: 'line',
          yAxisIndex: 1,
          data: taskNumberData,
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
          startTime={startTime}
          endTime={endTime}
          executeType={executeType}
          eventSource={eventSource}
          filterCallback={this.handlefilterCallback}
        />
        <div className={styles.taskCustomerChart}>
          <IECharts
            option={options}
            resizable
            style={{
              height: '350px',
            }}
          />
        </div>
      </div>
    );
  }
}
