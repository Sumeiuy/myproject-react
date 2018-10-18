/*
 * @Author: zhangjun
 * @Descripter: 头部筛选项
 * @Date: 2018-10-06 14:21:06
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-10-17 13:54:10
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
import SimilarAutoComplete from '../common/similarAutoComplete';

import styles from './reportFilter.less';

export default class ReportFilter extends PureComponent {
  static propTypes = {
    // 日期选择对应的filter对应名称
    dateFilterName: PropTypes.string.isRequired,
    // 筛选后调用的Function
    filterCallback: PropTypes.func,
    // 开始时间
    startTime: PropTypes.string.isRequired,
    // 结束时间
    endTime: PropTypes.string.isRequired,
    // 执行类型
    executeType: PropTypes.string,
    // 事件来源
    eventSource: PropTypes.string.isRequired,
    // 执行类型选项
    executeTypeOptions: PropTypes.array,
    // 事件类型选项
    eventTypeOptions: PropTypes.array,
    // 事件来源选项
    eventSourceOptions: PropTypes.array,
    //是否是事件分析报表
    isEventAnalysis: PropTypes.bool,
    // 事件搜索
    eventSearch: PropTypes.func,
    // 事件搜索数据
    eventSearchList: PropTypes.object,
  }

  static defaultProps = {
    filterCallback: _.noop,
    eventTypeOptions: [],
    executeTypeOptions,
    eventSourceOptions,
    isEventAnalysis: false,
    eventSearchList: {},
    eventSearch: _.noop,
  }

  // 选择任务触发时间
  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '任务触发时间',
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
    const { isEventAnalysis } = this.props;
    if (isEventAnalysis) {
      const { id, value: { value } } = option;
      this.handleEventSelectChange(id, value);
    }
    const { id, value: { value } } = option;
    this.handleSelectChange(id, value);
  }

  // 选择事件类型
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '事件类型',
      value: '$args[0].value.value',
    },
  })
  handleEventTypeChange(option) {
    const { id, value: { key } } = option;
    this.handleSelectChange(id, key);
  }

  // select改变
  @autobind
  handleSelectChange(key, v) {
    const { filterCallback } = this.props;
    filterCallback({
      [key]: v,
    });
  }

  // 事件分析表select改变
  @autobind
  handleEventSelectChange(key, v) {
    const { eventSelectChange } = this.props;
    eventSelectChange({
      [key]: v,
    });
  }

  // 设置不可选择的开始时间
  @autobind
  setDisabledStartTime(start) {
    // 最多选取过去90天的时间
    return start < moment().subtract(90, 'days') || start >= moment().startOf('day');
  }

  // 设置不可选择的结束时间
  @autobind
  setDisabledEndTime(start, end) {
    // 最多选取过去90天的时间
    return end < moment().subtract(90, 'days') || end >= moment().startOf('day');
  }

  // 事件搜索
  @autobind
  @logable({ type: 'Click', payload: { name: '事件搜索', value: '$args[0]' } })
  handleEventSearch(keyword) {
    if (_.isEmpty(keyword)) {
      return;
    }
    this.props.eventSearch({ keyword });
  }

  // 事件选择
  @autobind
  @logable({ type: 'Click', payload: { name: '事件选择', value: '$args[0]' } })
  handleSelectParticipant(newEvent) {
    // const { formData } = this.state;
    // if (_.isEmpty(newEvent)
    //   || _.get(formData, 'newEvent.eventCode') !== newEvent.eventCode) {
    //   this.setState({
    //     formData: {
    //       ...formData,
    //       event: newEvent,
    //     }
    //   });
    //   this.props.onChange({ event: newEvent });
    // }
  }

  render() {
    const {
      dateFilterName,
      startTime,
      endTime,
      executeType,
      eventSource,
      executeTypeOptions,
      eventTypeOptions,
      eventSourceOptions,
      isEventAnalysis,
      eventType,
      eventSearchList,
     } = this.props;
    const { eventList = [] } = eventSearchList;
    return (
      <div className={styles.reportFilter}>
        {
          isEventAnalysis?
          <SimilarAutoComplete
            placeholder="事件名"
            style={{ width: 230, height: 30 }}
            className={styles.searchEvent}
            optionList={eventList}
            onSearch={this.handleEventSearch}
            onSelect={this.handleSelectParticipant}
          /> : null
        }
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
        {
          isEventAnalysis?
          <SingleFilter
            filterName='事件类型'
            filterId='eventType'
            className='filter'
            type='single'
            dataMap={['key', 'value']}
            data={eventTypeOptions}
            value={eventType}
            onChange={this.handleEventTypeChange}
            needItemObj
          /> :
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
        }

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
