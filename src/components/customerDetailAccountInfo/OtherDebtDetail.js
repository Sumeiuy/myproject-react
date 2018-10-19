/*
 * @Author: sunweibin
 * @Date: 2018-10-12 10:18:21
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-18 14:15:24
 * @description 小额贷、债券负债、股票质押的负债详情
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import DebtDetailItem from './DebtDetailItem';
import { displayMoney } from './utils';

import styles from './debtDetail.less';

export default function OtherDebtDetail(props) {
  const { title, data } = props;
  if (_.isEmpty(data)) {
    return null;
  }
  // 总金额
  const total = displayMoney(data.totalValue);
  // 当前总利息
  const currentTotalInterest = displayMoney(data.currentTotalInterest);
  const canBorrowValue = displayMoney(data.canBorrowValue);
  return (
    <div className={styles.detailContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.value}>{total}</div>
        </div>
      </div>
      <div className={styles.body}>
        <DebtDetailItem title="当前总利息" content={currentTotalInterest} />
        <DebtDetailItem title="还可借入" content={canBorrowValue} />
        <DebtDetailItem title="最近一笔到期日" content={data.latestDueDate} />
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
