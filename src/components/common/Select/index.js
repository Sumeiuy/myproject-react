/**
 * @file Select.js
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
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


  render() {
    const { data, name, value, onChange } = this.props;
    const getSelectOption = item => item.map(i =>
      <Option key={i.value}>{i.label}</Option>,
    );
    return (
      <div className={styles.commomSelect}>
        <Select
          placeholder="全部"
          value={value}
          onChange={key => onChange(name, key)}
          allowClear
          dropdownMatchSelectWidth={false}
        >
          {getSelectOption(data)}
        </Select>
      </div>
    );
  }
}
