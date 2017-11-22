/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PureComponent } from 'react';

import BasicInfo from './BasicInfo';
import TargetCustomer from './TargetCustomer';
import styles from './performerViewDetail.less';

export default class PerformerViewDetail extends PureComponent {
  render() {
    const basicProps = {};
    return (
      <div className={styles.performerViewDetail}>
        <p className={styles.taskTitle}>
          编号123456 名称名称名称名称: 状态
        </p>
        <BasicInfo {...basicProps} />
        <TargetCustomer />
      </div>
    );
  }
}
