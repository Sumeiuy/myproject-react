/*
 * @Author: zhangjun
 * @Descripter: 报表头部筛选项
 * @Date: 2018-10-06 14:21:06
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-18 10:13:46
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import SingleFilter from 'lego-react-filter/src';
import DateRangePick from 'lego-react-date/src';

import logable from '../../decorators/logable';
import { defaultStartTime, defaultEndTime, executeTypeOptions, eventSourceOptions } from './config';

import styles from './reportFilter.less';


export default class ReportFilter extends PureComponent {
  static propTypes = {
    // 日期选择对应的filter对应名称
    dateFilterName: PropTypes.string.isRequired,
    // 筛选后调用的Function
    filterCallback: PropTypes.func,
  }

  static defaultProps = {
    filterCallback: _.noop,
  }

  // 选择任务触发时间
  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '$props.dateFilterName',
      min: '$args[0].value[0]',
      max: '$args[0].value[1]',
    },
  })
  handleDateChange(date) {
    const { value } = date;
    if (!_.isEmpty(value)) {
      this.props.filterCallback({
        startTime: value[0],
        endTime: value[1],
      });
    }
  }

  // 选择执行类型
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '执行类型',
      value: '$args[0].value.value',
    },
  })
  handleExecuteTypeChange(option) {
    const { id, value: { value } } = option;
    this.handleSelectChange(id, value);
  }

  // 选择事件来源
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '事件来源',
      value: '$args[0].value.value',
    },
  })
  handleEventSourceChange(option) {
    const { id, value: { value } } = option;
    this.handleSelectChange(id, value);
  }

  // select改变
  @autobind
  handleSelectChange(key, v) {
    const { filterCallback } = this.props;
    filterCallback({
      [key]: v,
    });
  }

  // 设置不可选择的开始时间
  @autobind
  setDisabledStartTime(start) {
    // 最多选取过去90天的时间
    return start < moment().subtract(91, 'days') || start >= moment().startOf('day');
  }

  // 设置不可选择的结束时间
  @autobind
  setDisabledEndTime(start, end) {
    // 最多选取过去90天的时间
    return end < moment().subtract(91, 'days') || end >= moment().startOf('day');
  }

  render() {
    const {
      dateFilterName,
      startTime,
      endTime,
      executeType,
      eventSource,
     } = this.props;
    return (
      <div className={styles.reportFilter}>
        <DateRangePick
          type='date'
          filterId='filterDate'
          className={styles.filter}
          filterName={dateFilterName}
          value={[startTime, endTime]}
          filterValue={[defaultStartTime, defaultEndTime]}
          onChange={this.handleDateChange}
          disabledStart={this.setDisabledStartTime}
          disabledEnd={this.setDisabledEndTime}
        />
        <SingleFilter
          filterName='执行类型'
          filterId='executeType'
          className='filter'
          type='single'
          dataMap={['value', 'label']}
          data={executeTypeOptions}
          value={executeType}
          onChange={this.handleExecuteTypeChange}
          needItemObj
        />
        <SingleFilter
          filterName='事件来源'
          filterId='eventSource'
          className='filter'
          type='single'
          dataMap={['value', 'label']}
          data={eventSourceOptions}
          value={eventSource}
          onChange={this.handleEventSourceChange}
          needItemObj
        />
      </div>
    );
  }
}
