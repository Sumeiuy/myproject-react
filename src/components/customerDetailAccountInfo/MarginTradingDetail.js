/*
 * @Author: sunweibin
 * @Date: 2018-10-12 09:55:22
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-12 17:49:52
 * @description 融资融券明细
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import DebtDetailItem from './DebtDetailItem';

import styles from './debtDetail.less';

export default function MarginTradingDetail(props) {
  const { data } = props;
  if (_.isEmpty(data)) {
    return null;
  }
  // 融资合约金额
  const financeContractSum = data.financeContractSum;
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
        <DebtDetailItem title="融资合约金额" value={financeContractSum} />
        <DebtDetailItem title="融资费用" value="478,432.21" />
        <DebtDetailItem title="融券利息" value="478,432.21" />
        <DebtDetailItem title="融资利息" value="478,432.21" />
        <DebtDetailItem title="融券合约金额" value="478,432.21" />
        <DebtDetailItem title="其他费用" value="478,432.21" />
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

