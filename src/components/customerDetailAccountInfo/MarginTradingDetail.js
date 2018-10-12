/*
 * @Author: sunweibin
 * @Date: 2018-10-12 09:55:22
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-12 10:25:33
 * @description 融资融券明细
 */

import React from 'react';
import PropTypes from 'prop-types';

import styles from './debtDetail.less';

export default function MarginTradingDetail(props) {
  return (
    <div className={styles.detailContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.title}>融资融券</div>
          <div className={styles.value}>-23435.3</div>
          <div className={styles.checkLink}>查看合同明细</div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.column}>
          <div className={styles.item}>
            <span className={styles.label}>融资合约金额：</span>
            <span className={styles.value}>478,432.21</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>融资费用：</span>
            <span className={styles.value}>478,432.21</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>融券利息：</span>
            <span className={styles.value}>478,432.21</span>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.item}>
            <span className={styles.label}>融资利息：</span>
            <span className={styles.value}>478,432.21</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>融券合约金额：</span>
            <span className={styles.value}>478,432.21</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>其他费用：</span>
            <span className={styles.value}>478,432.21</span>
          </div>
        </div>
      </div>
    </div>
  );
}

MarginTradingDetail.propTypes = {
  data: PropTypes.object,
};
MarginTradingDetail.defaultProps = {
  data: {},
};

