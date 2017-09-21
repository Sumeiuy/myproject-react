/*
* @Description: 日期选择组件
* @Author: XuWenKang
* @Date:   2017-09-20 10:38:57
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-21 11:16:25
*/

import React, { PureComponent, PropTypes } from 'react';
import { DatePicker } from 'antd';
import { autobind } from 'core-decorators';

import styles from './index.less';

export default class CommonDatePicker extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object,
    placeholder: PropTypes.string,
    boxStyle: PropTypes.object,
  }

  static defaultProps = {
    value: null,
    placeholder: '',
    boxStyle: {},
  }

  @autobind
  handleChange(date, dateStr) {
    const { name, onChange } = this.props;
    onChange({ name, value: dateStr, date });
  }


  render() {
    const { value, placeholder, boxStyle } = this.props;
    return (
      <div
        className={styles.commonDatePicker}
        style={boxStyle}
      >
        <DatePicker
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
