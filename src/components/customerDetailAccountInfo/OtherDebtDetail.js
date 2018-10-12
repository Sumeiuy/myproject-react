/*
 * @Author: sunweibin
 * @Date: 2018-10-12 10:18:21
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-12 17:40:24
 * @description 小额贷、债券负债、股票质押的负债详情
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import DebtDetailItem from './DebtDetailItem';

import styles from './debtDetail.less';

export default function OtherDebtDetail(props) {
  const { title, data } = props;
  if (_.isEmpty(data)) {
    return null;
  }
  return (
    <div className={styles.detailContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.value}>-23435.3</div>
        </div>
      </div>
      <div className={styles.body}>
        <DebtDetailItem title="当前总利息" value="478,432.21" />
        <DebtDetailItem title="还可借入" value="478,432.21" />
        <DebtDetailItem title="最近一笔到期日" value="2018-09-23" />
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
