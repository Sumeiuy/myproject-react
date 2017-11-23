/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的目标客户
 */

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import LabelInfo from './LabelInfo';
import Select from '../../common/Select';

import styles from './targetCustomer.less';

export default class TargetCustomer extends PureComponent {

  @autobind
  handleStateChange() {

  }

  render() {
    const stateData = [{
      value: '',
      label: '全部',
      show: true,
    }, {
      value: '01',
      label: '处理中',
      show: true,
    }, {
      value: '02',
      label: '已完成',
      show: true,
    }, {
      value: '03',
      label: '待处理',
      show: true,
    }];
    return (
      <div className={styles.targetCustomer}>
        <LabelInfo value="目标客户" />
        <div className={styles.listControl}>
          <div className={styles.stateWidget}>
            <span className={styles.label}>状态:</span>
            <Select
              name="targetCustomerState"
              value={'全部客户'}
              data={stateData}
              onChange={this.handleStateChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
