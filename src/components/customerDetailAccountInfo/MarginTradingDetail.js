/*
 * @Author: sunweibin
 * @Date: 2018-10-12 09:55:22
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-15 12:33:25
 * @description 融资融券明细
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import DebtDetailItem from './DebtDetailItem';
import { displayDebtMony } from './utils';

import styles from './debtDetail.less';

export default function MarginTradingDetail(props) {
  const { data } = props;
  if (_.isEmpty(data)) {
    return null;
  }
  // 总金额
  const totalValue = displayDebtMony(data.totalValue);
  // 融资合约金额
  const financeContractSum = displayDebtMony(data.financeContractSum);
  // 融资费用
  const financeCost = displayDebtMony(data.financeCost);
  // 融券利息
  const marriageInterest = displayDebtMony(data.marriageInterest);
  // 融券合约金额
  const marriageContractSum = displayDebtMony(data.marriageContractSum);
  // 融资利息
  const financeInterest = displayDebtMony(data.financeInterest);
  // 其他费用
  const otherCost = displayDebtMony(data.otherCost);
  return (
    <div className={styles.detailContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.title}>融资融券</div>
          <div className={styles.value}>{totalValue}</div>
          <div className={styles.checkLink}>查看合同明细</div>
        </div>
      </div>
      <div className={styles.body}>
        <DebtDetailItem title="融资合约金额" content={financeContractSum} />
        <DebtDetailItem title="融资费用" content={financeCost} />
        <DebtDetailItem title="融券利息" content={marriageInterest} />
        <DebtDetailItem title="融资利息" content={financeInterest} />
        <DebtDetailItem title="融券合约金额" content={marriageContractSum} />
        <DebtDetailItem title="其他费用" content={otherCost} />
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

