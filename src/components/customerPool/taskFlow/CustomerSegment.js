/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 13:43:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-11 09:28:26
 */

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Select, Icon } from 'antd';
// import { autobind } from 'core-decorators';
// import classnames from 'classnames';
import _ from 'lodash';
// import CustRange from '../common/CustRange';
import styles from './customerSegment.less';

// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};

const Option = Select.Option;

const indicator = [
  {
    key: '客户性质',
    value: '客户性质',
  },
  {
    key: '选择指标',
    value: '选择指标',
  },
  {
    key: '总资产',
    value: '总资产',
  },
];

const type = [
  {
    key: '1',
    value: '且',
  },
  {
    key: '2',
    value: '或',
  },
];

export default class CustomerSegment extends PureComponent {
  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleTabChange(key) {
    console.log(key);
  }

  handleChange(value) {
    console.log(value);
  }

  renderOneGroupIndicatorSection() {
    return (
      <div className={styles.customerSegmentSection}>
        <div className={styles.conditionSection}>{type[0].value}</div>
        <div className={styles.conditionSection} />
        {this.renderOneSection()}
      </div>
    );
  }

  /**
   * 渲染指标列
   */
  renderOneSection() {
    return _.map(indicator, () =>
      <div className={styles.conditionSection}>
        <div className={styles.selectCondition}>
          <Select
            style={{ width: 60 }}
            defaultValue={1}
            onChange={this.handleChange}
            className={styles.indicator}
          >
            <Option key={1} value={1}>{1}</Option>
            <Option key={2} value={2}>{2}</Option>
            <Option key={3} value={3}>{3}</Option>
          </Select>
        </div>
        <div className={styles.selectCondition}>
          <Select
            style={{ width: 60 }}
            defaultValue={2}
            onChange={this.handleChange}
            className={styles.condition}
          >
            <Option key={1} value={1}>{1}</Option>
            <Option key={2} value={2}>{2}</Option>
            <Option key={3} value={3}>{3}</Option>
          </Select>
        </div>
        <div className={styles.selectCondition}>
          <Select
            style={{ width: 60 }}
            mode="multiple"
            defaultValue={['3']}
            onChange={this.handleChange}
            className={styles.value}
          >
            <Option key={1} value={1}>{1}</Option>
            <Option key={2} value={2}>{2}</Option>
            <Option key={3} value={3}>{3}</Option>
          </Select>
        </div>
        <div className={styles.delete}>
          <Icon type="close" className={styles.deleteIcon} />
        </div>
      </div>);
  }

  render() {
    return (
      <div className={styles.customerSegmentContainer}>
        {this.renderOneGroupIndicatorSection()}
      </div>
    );
  }
}
