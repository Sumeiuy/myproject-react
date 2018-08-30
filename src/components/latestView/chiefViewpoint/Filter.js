/**
 * @Author: XuWenKang
 * @Description: 首席观点列表页-筛选组件
 * @Date: 2018-06-19 13:58:32
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-30 15:59:43
 */

import React, { PureComponent } from 'react';
import { Input, Select } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { autobind } from 'core-decorators';
import DateRangePick from 'lego-react-date/src';
import logable from '../../../decorators/logable';
import config from '../config';
import styles from './filter.less';

const Search = Input.Search;
const Option = Select.Option;
const typeList = config.chiefViewpointType;
const directTypeList = config.directType;
const dateFormatStr = config.dateFormatStr;

const searchStyle = {
  width: 160,
  height: 30,
};
const selectStyle = {
  width: 155,
  height: 30,
};
export default class Filter extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    keyword: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    onFilter: PropTypes.func.isRequired,
    filterType: PropTypes.string,
  }

  static defaultProps = {
    type: '',
    keyword: '',
    startDate: '',
    endDate: '',
    filterType: config.viewpointFilterType,
  }

  @autobind
  getOptionList() {
    const { filterType } = this.props;
    if (filterType === config.viewpointFilterType) {
      return typeList.map(item => (
        <Option key={item.value} value={item.value}>{item.label}</Option>
      ));
    }
    return directTypeList.map(item => (
      <Option key={item.value} value={item.value}>{item.label}</Option>
    ));
  }

  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '报告日期',
      min: '$args[0]',
      max: '$args[1]',
    },
  })
  handleDateChange(startDate, endDate) {
    const { onFilter } = this.props;
    onFilter({
      startDate,
      endDate,
    });
  }

  @autobind
  disabledEndDate(startDate, endDate) {
    return endDate > moment();
  }

  render() {
    const {
      type,
      keyword,
      startDate,
      endDate,
      onFilter,
      filterType,
    } = this.props;
    const defaultDate = [
      _.isEmpty(startDate) ? null : moment(startDate, dateFormatStr),
      _.isEmpty(endDate) ? null : moment(endDate, dateFormatStr),
    ];
    return (
      <div className={styles.filterBox}>
        <div className={styles.inputBox}>
          <Search
            defaultValue={keyword}
            placeholder={
              filterType === config.viewpointFilterType ?
              '标题'
              :
              '行业/主题'
            }
            onSearch={value => onFilter({ keyword: value })}
            style={searchStyle}
            enterButton
          />
        </div>
        <div className={styles.selectBox}>
          <span className={styles.title}>{
            filterType === config.viewpointFilterType ?
            '类型'
            :
            '调整方向'
          }：</span>
          <Select
            style={selectStyle}
            defaultValue={type}
            onChange={value => onFilter({ type: value })}
          >
            {
              this.getOptionList()
            }
          </Select>
        </div>
        <div className={styles.dateBox}>
          <span className={styles.title}>{
            filterType === config.viewpointFilterType ?
            '报告日期'
            :
            '调整时间'
          }：</span>
          <DateRangePick
            filterName=""
            filterValue={defaultDate}
            onChange={date => this.handleDateChange(date.value[0], date.value[1])}
            disabledEnd={this.disabledEndDate}
          />
        </div>
      </div>
    );
  }
}
