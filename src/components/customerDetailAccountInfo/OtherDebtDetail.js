/*
 * @Author: sunweibin
 * @Date: 2018-10-12 10:18:21
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-12 10:25:36
 * @description 小额贷、债券负债、股票质押的负债详情
 */

import React from 'react';
import PropTypes from 'prop-types';

import styles from './debtDetail.less';

export default function OtherDebtDetail(props) {
  const { title } = props;
  return (
    <div className={styles.detailContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.value}>-23435.3</div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.column}>
          <div className={styles.item}>
            <span className={styles.label}>当前总利息：</span>
            <span className={styles.value}>478,432.21</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>最近一笔到期日：</span>
            <span className={styles.value}>2018-09-23</span>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.item}>
            <span className={styles.label}>还可借入：</span>
            <span className={styles.value}>478,432.21</span>
          </div>
        </div>
      </div>
    </div>
  );
}

OtherDebtDetail.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object,
};
OtherDebtDetail.defaultProps = {
  data: {},
};
