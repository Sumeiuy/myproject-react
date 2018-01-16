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
        进度:&nbsp;<span className={styles.mark}>{servicedCustomer}</span>/{totalCustomer}
      </div>
      <Progress
        percent={percent}
        strokeWidth="3px"
        {...restProps}
      />
    </div>
  );
}

ProgressBar.propTypes = {
  servicedCustomer: PropTypes.number.isRequired,
  totalCustomer: PropTypes.number.isRequired,
};
