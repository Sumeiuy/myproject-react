/*
 * @Author: zhangjun
 * @Date: 2018-09-13 15:31:58
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-17 10:00:43
 * @description 投顾空间带进度的下拉选择
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Select, Progress } from 'antd';

import styles from './progressSelect.less';

const Option = Select.Option;

export default class ProgressSelect  extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
    ]),
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    data: [],
    value: '',
    width: '',
    disabled: false,
  }

  @autobind
  makeSelectOptions(data) {
    const options = _.map(data, item => {
      const label = `${item.siteName}${item.roomName}`;
      const value = item.roomNo;
      return (<Option key={value} value={value}>
          <span className={styles.label}>{label}</span>
          <div className={styles.progress}>
            <Progress percent={item.progressNumber}/>
          </div>
      </Option>);
    })
    return options;
  }

  @autobind
  handSelectChange(value) {
    const { data } = this.props;
    const option = _.find(data, item => item.roomNo === value);
    this.props.onChange(value, option);
  }

  render() {
    const { data, name, value, onChange, width, disabled, ...resetProps } = this.props;
    const options = this.makeSelectOptions(data);
    return (
      <div className={styles.progressSelect}>
        <Select
          value={value}
          onChange={this.handSelectChange}
          dropdownMatchSelectWidth={false}
          dropdownClassName={styles.progressSelectDropdown}
          disabled={disabled}
          placeholder="请选择"
          {...resetProps}
        >
          {options}
        </Select>
      </div>
    );
  }
}
