/*
 * @Author: zhangjun
 * @Date: 2018-11-20 14:32:56
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-03 21:21:28
 * @description 统计期间
 */

import React from 'react';
import { endDateOfLastMonth, lastYearDataOfLastMonth } from './config';

import styles from './countPeriod.less';

const COUNT_PERIOD = `${lastYearDataOfLastMonth}-${endDateOfLastMonth}(一年期)`;

export default function CountPeriod() {
  return (
    <div className={styles.countPeriod}>
      <span className={styles.label}>
        统计期间：
      </span>
      <span className={styles.value}>
        {COUNT_PERIOD}
      </span>
    </div>
  );
}
