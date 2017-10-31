/**
 * @file components/customerPool/list/TimeCycle.js
 *  时间周期组件
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
    if (!_.includes(['custIndicator', 'numOfCustOpened'], source)) {
      return null;
    }
    return (
      <div className={`custRange ${styles.timeCycle}`}>
        <div className={styles.item}>
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
      </div>
    );
  }
}
