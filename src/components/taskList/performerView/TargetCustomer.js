/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的目标客户
 */

import React, { PureComponent } from 'react';

import LabelInfo from './LabelInfo';

import styles from './targetCustomer.less';

export default class TargetCustomer extends PureComponent {
  render() {
    return (
      <div className={styles.targetCustomer}>
        <LabelInfo value="目标客户" />
        TargetCustomer
      </div>
    );
  }
}
