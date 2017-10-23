/**
 * @file components/customerPool/list/TimeCycle.js
 *  时间周期组件
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Select } from 'antd';

import Icon from '../../common/Icon';

import styles from './timeCycle.less';

export default class TimeCycle extends PureComponent {
  static propTypes = {
    updateQueryState: PropTypes.func.isRequired,
    source: PropTypes.string.isRequired,
    cycle: PropTypes.array,
    selectValue: PropTypes.string,
  }

  static defaultProps = {
    selectValue: '',
    cycle: [],
  }

  @autobind
  handleChange(value) {
    const { updateQueryState } = this.props;
    updateQueryState({
      cycleSelect: value,
    });
  }

  render() {
    const {
      source,
      selectValue,
      cycle,
    } = this.props;
    let timeEle = null;
    if (_.includes(['custIndicator', 'numOfCustOpened'], source)) {
      timeEle = (
        <div className={styles.item}>
          <i className={styles.bd} />
          <Icon type="rili" />
          <Select
            style={{ width: 60 }}
            value={selectValue}
            onChange={this.handleChange}
            key="dateSelect"
          >
            {cycle.map(item =>
              <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
          </Select>
        </div>
      );
    }
    return (
      <div className={`custRange ${styles.timeCycle}`}>
        {timeEle}
      </div>
    );
  }
}
