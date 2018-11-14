/*
 * @Author: zhangjun
 * @Descripter: 报表头部筛选项
 * @Date: 2018-10-06 14:21:06
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-11-14 20:02:55
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import SingleFilter from 'lego-react-filter/src';
import DateRangePick from 'lego-react-date/src';
import { Input } from 'antd';
import moment from 'moment';

import logable from '../../../decorators/logable';
import { defaultStartTime, defaultEndTime } from './config';

import styles from './todoFilter.less';

export default class TodoFilter extends PureComponent {
  static propTypes = {
    // 筛选后调用的Function
    filterCallback: PropTypes.func,
    // 开始时间
    startTime: PropTypes.string.isRequired,
    // 结束时间
    endTime: PropTypes.string.isRequired,
    // 任务搜索
    onSearch: PropTypes.func.isRequired,
    // 是否是审批列表
    isApprove: PropTypes.bool,
    // 类型数据
    typeData: PropTypes.array,
    // 类型
    type: PropTypes.array,
    // 发起人数据
    initiatorData: PropTypes.array,
    // 发起人
    initiator: PropTypes.array,
    // 发起人下拉筛选
    InitiatorCallback: PropTypes.func,
    // 下拉框输入
    InputChange: PropTypes.func,
  }

  static defaultProps = {
    filterCallback: _.noop,
    isApprove: false,
    InitiatorCallback: _.noop,
    InputChange: _.noop,
    type: [],
    initiator: [],
    typeData: [],
    initiatorData: [],
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

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '任务名称',
      value: '$args[0]',
    },
  })
  handleTaskSearch(value) {
    this.props.onSearch(value);
  }

  // 类型下拉框change
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '类型',
      value: '$args[0].value.value',
    },
  })
  handleTypeChange(option) {
    const {
      value: {
        label,
        value,
      }
    } = option;
    this.handleSelectChange({value, label});
  }

  // 发起人下拉框change
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '发起人',
      value: '$args[0].value.value',
    },
  })
  handleInitiatorChange(option) {
    const {
      value: {
        name,
        key,
      }
    } = option;
    this.handleSelectChange(name, key);
  }

  // select改变
  @autobind
  handleSelectChange(obj) {
    this.props.filterCallback(obj);
  }

  // 类型输入查询
  @autobind
  handleTypeInputChange(value) {
    this.props.InputChange(value);
  }

  // 发起人输入查询
  @autobind
  handleInitiatorInputChange(value) {
    this.props.InputChange(value);
  }

  render() {
    const {
      startTime,
      endTime,
      isApprove,
      typeData,
      type,
      initiatorData,
      initiator
     } = this.props;
     const dateRangePicker = classnames([styles.filter, styles.dateRangePickFilter]);
    return (
      <div className={styles.reportFilter}>
        <div className="search-box">
          <Input.Search
            className="search-input"
            placeholder="任务名称"
            onSearch={this.handleTaskSearch}
            enterButton
          />
        </div>
        <SingleFilter
          filterName='类型'
          filterId="category"
          className="filter"
          dataMap={['key', 'value']}
          data={typeData}
          value={type}
          onChange={this.handleTypeChange}
          showSearch
          placeholder="业务类型"
          needItemObj
          onInputChange={this.handleTypeInputChange}
        />
        {
          isApprove ?
            <SingleFilter
              filterName="发起人"
              filterId="originator"
              className="filter"
              dataMap={['key', 'name']}
              data={initiatorData}
              value={initiator}
              onChange={this.handleInitiatorChange}
              needItemObj
              placeholder="员工工号/员工姓名"
              showSearch
              onInputChange={this.handleInitiatorInputChange}
            />
            :
            null
        }
        <DateRangePick
          type="date"
          filterId="filterDate"
          filterName="申请时间"
          className={dateRangePicker}
          value={[startTime, endTime]}
          filterValue={[defaultStartTime, defaultEndTime]}
          onChange={this.handleDateChange}
          disabledStart={this.setDisabledStartTime}
          disabledEnd={this.setDisabledEndTime}
        />
      </div>
    );
  }
}
