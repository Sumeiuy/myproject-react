/*
 * @Author: zhangjun
 * @Descripter: 报表头部筛选项
 * @Date: 2018-10-06 14:21:06
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-10-26 15:15:43
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import classnames from 'classnames';
import SingleFilter from 'lego-react-filter/src';
import DateRangePick from 'lego-react-date/src';
import { AutoComplete  } from 'antd';

import logable from '../../decorators/logable';
import { defaultStartTime, defaultEndTime, executeTypeOptions, eventSourceOptions } from './config';
import SimilarAutoComplete from '../common/similarAutoComplete';

import styles from './reportFilter.less';

const Option = AutoComplete.Option;

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
    // 事件名称
    eventName: PropTypes.string,
  }

  static defaultProps = {
    filterCallback: _.noop,
    eventTypeOptions: [],
    executeTypeOptions,
    eventSourceOptions,
    isEventAnalysis: false,
    eventSearchList: {},
    eventSearch: _.noop,
    eventName: '',
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
    const { isEventAnalysis } = this.props;
    const { id, value: { value } } = option;
    if (isEventAnalysis) {
      this.handleEventSelectChange(id, value);
    }
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
    this.props.filterCallback({
      [key]: v,
    });
  }

  // 事件分析表select改变
  @autobind
  handleEventSelectChange(key, v) {
    this.props.eventSelectChange({
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
  handleEventNameSelect(option) {
    const { eventName: prevEventName } = this.props;
    const { eventName } = option;
    if (eventName !== prevEventName) {
      this.handleSelectChange('eventName', eventName);
    }
  }

  // 渲染事件名
  @autobind
  renderEventNameAutoCompleteOption(event) {
    // 渲染事件名下拉列表的选项DOM
    const { eventCode, eventName } = event;
    return (
      <Option key={eventCode} value={eventName} >
        <span className={styles.eventAutoCompleteOptionValue} title={eventName}>{eventName}</span>
      </Option>
    );
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
      eventName,
     } = this.props;
    // 事件类型中字典里面没有不限，新增不限
    const newEventTypeOptions = [{key: '不限', value: '不限'}, ...eventTypeOptions];
    const { eventList = [] } = eventSearchList;
    const dateRangePicker = classnames({
      [styles.filter]: true,
      [styles.dateRangePickFilter]: true,
    });
    return (
      <div className={styles.reportFilter}>
        {
          isEventAnalysis
          ?
            <SimilarAutoComplete
              placeholder="事件名"
              style={{ width: 230, height: 30 ,marginRight: 30}}
              className={styles.searchEvent}
              optionList={eventList}
              optionKey="eventCode"
              defaultValue={eventName}
              onSearch={this.handleEventSearch}
              onSelect={this.handleEventNameSelect}
              renderOptionNode={this.renderEventNameAutoCompleteOption}
            />
          : null
        }
        <DateRangePick
          type='date'
          filterId='filterDate'
          className={dateRangePicker}
          filterName={dateFilterName}
          value={[startTime, endTime]}
          filterValue={[defaultStartTime, defaultEndTime]}
          onChange={this.handleDateChange}
          disabledStart={this.setDisabledStartTime}
          disabledEnd={this.setDisabledEndTime}
        />
        {
          !isEventAnalysis
          ?
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
          : null
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
        {
          isEventAnalysis
          ?
            <SingleFilter
              filterName='事件类型'
              filterId='eventType'
              className='filter'
              type='single'
              dataMap={['key', 'value']}
              data={newEventTypeOptions}
              value={eventType}
              onChange={this.handleEventTypeChange}
              needItemObj
            />
          : null
        }
      </div>
    );
  }
}
