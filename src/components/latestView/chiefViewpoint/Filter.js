/**
 * @Author: XuWenKang
 * @Description: 首席观点列表页-筛选组件
 * @Date: 2018-06-19 13:58:32
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-21 16:31:01
 */

import React, { PureComponent } from 'react';
import { Input, Select, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { autobind } from 'core-decorators';
// import DateRangePicker from '../../common/dateRangePicker';
import config from '../config';
import styles from './filter.less';

const Search = Input.Search;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const typeList = config.chiefViewpointType;
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
  }

  static defaultProps = {
    type: '',
    keyword: '',
    startDate: '',
    endDate: '',
  }

  @autobind
  getOptionList() {
    return typeList.map(item => (
      <Option key={item.value} value={item.value}>{item.label}</Option>
    ));
  }

  @autobind
  handleDateChange(moments, dateStrs) {
    const { onFilter } = this.props;
    onFilter({
      startDate: dateStrs[0],
      endDate: dateStrs[1],
    });
  }

  render() {
    const {
      type,
      keyword,
      startDate,
      endDate,
      onFilter,
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
            placeholder="标题"
            onSearch={value => onFilter({ keyword: value })}
            style={searchStyle}
            enterButton
          />
        </div>
        <div className={styles.selectBox}>
          <span className={styles.title}>类型：</span>
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
          <span className={styles.title}>报告日期：</span>
          <RangePicker
            defaultValue={defaultDate}
            format={dateFormatStr}
            onChange={this.handleDateChange}
            disabledDate={current => current > moment()}
          />
        </div>
      </div>
    );
  }
}
