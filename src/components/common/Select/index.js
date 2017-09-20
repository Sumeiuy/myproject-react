/**
 * @file Select.js
 * @author honggaunqging
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Select } from 'antd';
import styles from './index.less';

const Option = Select.Option;
export default class CommonSelect extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  static defaultProps = {
    value: '全部',
  }

  @autobind
  makeSelectOptions(data) {
    const options = [];
    data.forEach((item) => {
      if (item.show) {
        options.push(<Option key={item.value} value={item.value}>{item.label}</Option>);
      }
    });
    return options;
  }


  render() {
    const { data, name, value, onChange } = this.props;
    const options = this.makeSelectOptions(data);
    return (
      <div className={styles.commomSelect}>
        <Select
          placeholder="全部"
          value={value}
          onChange={key => onChange(name, key)}
          dropdownMatchSelectWidth={false}
        >
          {options}
        </Select>
      </div>
    );
  }
}
