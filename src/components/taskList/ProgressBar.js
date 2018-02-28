/**
 * @file ProgressBar.js
 * 创建者视图、执行者视图进度条
 * @author wangjunjun
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd';

import styles from './progressBar.less';

export default function ProgressBar({
  servicedCustomer,
  totalCustomer,
  ...restProps
}) {
  const servicedCustomerNum = Number(servicedCustomer);
  const totalCustomerNum = Number(totalCustomer);
  if (totalCustomerNum === 0 || isNaN(totalCustomerNum) || isNaN(servicedCustomerNum)) {
    return null;
  }
  const percent = 100 * (servicedCustomerNum / totalCustomerNum);
  return (
    <div className={styles.progress}>
      <div className={`${styles.progressText} progressText`}>
        <span className={styles.title}>进度:</span>&nbsp;
        <span className={`${styles.mark} activeMark`}>{servicedCustomer}</span>/{totalCustomer}
      </div>
      <Progress
        percent={percent}
        strokeWidth={3}
        {...restProps}
      />
    </div>
  );
}

ProgressBar.propTypes = {
  servicedCustomer: PropTypes.number.isRequired,
  totalCustomer: PropTypes.number.isRequired,
};
