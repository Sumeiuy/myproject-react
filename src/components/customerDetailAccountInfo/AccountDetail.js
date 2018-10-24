/*
 * @Author: sunweibin
 * @Date: 2018-10-23 17:18:23
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-23 17:50:55
 * @description 账户详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

import {
  FUND_ACCOUNT_TABLE_COLUMNS,
  STOCK_ACCOUNT_TABLE_COLUMNS,
} from './accountDetailConfig';

import styles from './accountDetail.less';

export default class AccountDetail extends PureComponent {
  static propTypes = {
    // 账户类型
    type: PropTypes.oneOf(['Normal', 'Credit', 'Option']),
    // 资金账户
    fundAccount: PropTypes.array,
    // 证券账户
    stockAccount: PropTypes.array,
    // 账户变动
    accountChange: PropTypes.array,
  }

  static defaultProps = {
    fundAccount: [],
    stockAccount: [],
    accountChange: [],
  }

  render() {
    return (
      <div className={styles.accountDetailWrap}>
        <div className={styles.accountBlock}>
          <div className={styles.header}>
            <div className={styles.title}>资金账户</div>
          </div>
          <div className={styles.accountTable}>
            <Table
              className={styles.tableBorder}
              columns={FUND_ACCOUNT_TABLE_COLUMNS}
            />
          </div>
        </div>
        <div className={styles.accountBlock}>
          <div className={styles.header}>
            <div className={styles.title}>证券账户</div>
          </div>
          <div className={styles.accountTable}>
            <Table
              className={styles.tableBorder}
              columns={STOCK_ACCOUNT_TABLE_COLUMNS}
            />
          </div>
        </div>
      </div>
    );
  }
}
