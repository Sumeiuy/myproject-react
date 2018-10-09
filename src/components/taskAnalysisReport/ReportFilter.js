/*
 * @Author: zhangjun
 * @Descripter: 头部筛选项
 * @Date: 2018-10-06 14:21:06
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-08 22:44:23
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import HtFilter from '../common/htFilter';
import { executeTypeOptions, eventSourceOptions } from './config';

import styles from './reportFilter.less';

export default class ReportFilter extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 日期选择对应的filter对应名称
    dateFilterName: PropTypes.string.isRequired,
    // 筛选后调用的Function
    filterCallback: PropTypes.func,
  }

  static defaultProps = {
    filterCallback: _.noop,
  }

  @autobind
  handleDateChange(date) {
    const { value } = date;
    if (!_.isEmpty(value)) {
      this.props.filterCallback({
        startDate: value[0],
        endDate: value[1],
      });
    }
  }

  @autobind
  handleExecuteTypeChange(option) {
    const { id, value: { value } } = option;
    this.handleSelectChange(id, value);
  }

  @autobind
  handleEventSourceChange(option) {
    const { id, value: { value } } = option;
    this.handleSelectChange(id, value);
  }

  @autobind
  handleSelectChange(key, v) {
    this.setState({
      [key]: v,
    });
    const { filterCallback } = this.props;
    filterCallback({
      [key]: v,
    });
  }

  render() {
    const {
      dateFilterName,
      location: {
        query: {
          executeType,
          eventSource,
          startTime,
          endTime,
        },
      },
     } = this.props;
    return (
      <div className={styles.reportFilter}>
        <HtFilter
          type='date'
          filterId='filterDate'
          className='filter'
          filterName={dateFilterName}
          value={[startTime, endTime]}
          onChange={this.handleDateChange}
        />
        <HtFilter
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
        <HtFilter
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
