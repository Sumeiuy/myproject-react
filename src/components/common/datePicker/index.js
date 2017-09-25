/*
* @Description: 日期选择组件
* @Author: XuWenKang
* @Date:   2017-09-20 10:38:57
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-21 17:05:55
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import { autobind } from 'core-decorators';

import styles from './index.less';

export default class CommonDatePicker extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    placeholder: PropTypes.string,
    boxStyle: PropTypes.object,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    value: '',
    placeholder: '',
    boxStyle: {},
    disabled: false,
  }

  @autobind
  handleChange(date, dateStr) {
    const { name, onChange } = this.props;
    onChange({ name, value: dateStr, date });
  }


  render() {
    const { value, placeholder, boxStyle, disabled } = this.props;
    return (
      <div
        className={styles.commonDatePicker}
        style={boxStyle}
      >
        <DatePicker
          disabled={disabled}
          allowClear={false}
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
