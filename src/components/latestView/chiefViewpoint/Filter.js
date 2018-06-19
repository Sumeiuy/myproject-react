/**
 * @Author: XuWenKang
 * @Description: 首席观点列表页-筛选组件
 * @Date: 2018-06-19 13:58:32
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-19 15:38:11
 */

import React, { PureComponent } from 'react';
import { Input, Select, DatePicker } from 'antd';
import { autobind } from 'core-decorators';
import styles from './filter.less';

const Search = Input.Search;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const searchStyle = {
  width: 160,
  height: 30,
};
const selectStyle = {
  width: 155,
  height: 30,
};
export default class Filter extends PureComponent {

  @autobind
  handleSearch(data) {
    console.log('search', data);
  }

  render() {
    return (
      <div className={styles.filterBox}>
        <div className={styles.inputBox}>
          <Search
            placeholder="标题"
            onSearch={value => this.handleSearch({ key: value })}
            style={searchStyle}
          />
        </div>
        <div className={styles.selectBox}>
          <span className={styles.title}>类型：</span>
          <Select style={selectStyle}>
            <Option value="">每周首席投顾观点</Option>
          </Select>
        </div>
        <div className={styles.dateBox}>
          <span className={styles.title}>报告日期：</span>
          <RangePicker />
        </div>
      </div>
    );
  }
}
