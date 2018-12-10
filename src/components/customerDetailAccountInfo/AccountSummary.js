/*
 * @Author: sunweibin
 * @Date: 2018-10-23 13:38:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-10 13:38:11
 * @desription 账户概览
 */
import React from 'react';
import PropTypes from 'prop-types';

import AccountSummaryBlock from './AccountSummaryBlock';

import styles from './accountSummary.less';

export default function AccountSummary(props) {
  const { data } = props;

  return (
    <div className={styles.summaryWrap}>
      <AccountSummaryBlock title="账户信息" summaryData={data.acountRelative} />
      <AccountSummaryBlock title="权限开通" summaryData={data.permissionOpen} showDesc={false} />
      <AccountSummaryBlock title="资产/收益" summaryData={data.assetsRelative} />
      <AccountSummaryBlock title="交易/销售" summaryData={data.transactionRelative} />
      <AccountSummaryBlock title="收入贡献" summaryData={data.incomeRelative} />
    </div>
  );
}

AccountSummary.propTypes = {
  data: PropTypes.object.isRequired,
};
