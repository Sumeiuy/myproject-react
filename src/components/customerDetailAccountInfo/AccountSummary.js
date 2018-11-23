/*
 * @Author: sunweibin
 * @Date: 2018-10-23 13:38:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-19 09:18:20
 * @desription 账户概览
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import _ from 'lodash';

import AccountSummaryCell from './AccountSummaryCell';

import styles from './accountSummary.less';

export default function AccountSummary(props) {
  const { data } = props;
  // 账户信息相关
  // 激活日期
  const activationDate = _.get(data, 'acountRelative.activationDate');
  // 账户状态
  const accountStatus = _.get(data, 'acountRelative.accountStatus');
  // 首次交易日期
  const firstTradeDate = _.get(data, 'acountRelative.firstTradeDate');
  // 首次交易日期
  const infoCompletionRate = _.get(data, 'acountRelative.infoCompletionRate');
  // 资产/收益相关
  // 总资产
  const totalAssets = _.get(data, 'assetsRelative.totalAssets');
  // 资金余额
  const fundBalance = _.get(data, 'assetsRelative.fundBalance');
  // 资产峰值
  const assetsPeak = _.get(data, 'assetsRelative.assetsPeak');
  // 年日均资产
  const yearDailyAssets = _.get(data, 'assetsRelative.yearDailyAssets');
  // 本年收益率(%)
  const yearProfitRate = _.get(data, 'assetsRelative.yearProfitRate');
  // 交易/销售相关
  // 股基交易量(年)
  const yearStockTradeAmt = _.get(data, 'transactionRelative.yearStockTradeAmt');
  // 股基交易量(月)
  const monthStockTradeAmt = _.get(data, 'transactionRelative.monthStockTradeAmt');
  // 信用交易量(年)
  const yearCreditTradeAmt = _.get(data, 'transactionRelative.yearCreditTradeAmt');
  // 信用交易量(月)
  const monthCreditTradeAmt = _.get(data, 'transactionRelative.monthCreditTradeAmt');
  // 产品销量(年)
  const yearProductSaleAmt = _.get(data, 'transactionRelative.yearProductSaleAmt');
  // 产品销量(月)
  const monthProductSaleAmt = _.get(data, 'transactionRelative.monthProductSaleAmt');
  // 收益凭证销量(年)
  const yearIncomeReceiptSaleAmt = _.get(data, 'transactionRelative.yearIncomeReceiptSaleAmt');
  // 收益凭证销量(月)
  const monthIncomeReceiptSaleAmt = _.get(data, 'transactionRelative.monthIncomeReceiptSaleAmt');
  // 收入贡献相关
  // 股基净佣金收入(年)
  const yearStockBrokerage = _.get(data, 'incomeRelative.yearStockBrokerage');
  // 股基净佣金收入(月)
  const monthStockBrokerage = _.get(data, 'incomeRelative.monthStockBrokerage');
  // 产品净手续费收入(年)
  const yearProductFee = _.get(data, 'incomeRelative.yearProductFee');
  // 产品净手续费收入(月)
  const monthProductFee = _.get(data, 'incomeRelative.monthProductFee');
  // 融资融券净利息收入(年)
  const yearMarginFruits = _.get(data, 'incomeRelative.yearMarginFruits');
  // 融资融券净利息收入(月)
  const monthMarginFruits = _.get(data, 'incomeRelative.monthMarginFruits');
  // 质押净利息收入(年)
  const yearPledgeFruits = _.get(data, 'incomeRelative.yearPledgeFruits');
  // 质押净利息收入(月)
  const monthPledgeFruits = _.get(data, 'incomeRelative.monthPledgeFruits');

  return (
    <div className={styles.summaryWrap}>
      <div className={styles.summaryBlock}>
        <div className={styles.header}>
          <div className={styles.title}>账户信息</div>
          <div className={styles.setting}><Icon type="setting" theme="outlined" /></div>
        </div>
        <div className={styles.body}>
          <AccountSummaryCell label="激活日期" type="DATE" content={activationDate} />
          <AccountSummaryCell label="账户状态" type="STRING" content={accountStatus} />
          <AccountSummaryCell label="首次交易日期" type="DATE" content={firstTradeDate} />
          <AccountSummaryCell label="信息完善率" type="RATE" content={infoCompletionRate} />
        </div>
      </div>
      <div className={styles.summaryBlock}>
        <div className={styles.header}>
          <div className={styles.title}>资产/收益</div>
          <div className={styles.setting}><Icon type="setting" theme="outlined" /></div>
        </div>
        <div className={styles.body}>
          <AccountSummaryCell label="总资产" content={totalAssets} />
          <AccountSummaryCell label="资金余额" content={fundBalance} />
          <AccountSummaryCell label="资产峰值" content={assetsPeak} />
          <AccountSummaryCell label="年日均资产" content={yearDailyAssets} />
          <AccountSummaryCell label="本年收益率(%)" type="RATE" content={yearProfitRate} />
        </div>
      </div>
      <div className={styles.summaryBlock}>
        <div className={styles.header}>
          <div className={styles.title}>交易/销售</div>
          <div className={styles.setting}><Icon type="setting" theme="outlined" /></div>
        </div>
        <div className={styles.body}>
          <AccountSummaryCell label="股基交易量(年)" content={yearStockTradeAmt} />
          <AccountSummaryCell label="股基交易量(月)" content={monthStockTradeAmt} />
          <AccountSummaryCell label="信用交易量(年)" content={yearCreditTradeAmt} />
          <AccountSummaryCell label="信用交易量(月)" content={monthCreditTradeAmt} />
          <AccountSummaryCell label="产品销量(年)" content={yearProductSaleAmt} />
          <AccountSummaryCell label="产品销量(月)" content={monthProductSaleAmt} />
          <AccountSummaryCell label="收益凭证销量(年)" content={yearIncomeReceiptSaleAmt} />
          <AccountSummaryCell label="收益凭证销量(月)" content={monthIncomeReceiptSaleAmt} />
        </div>
      </div>
      <div className={styles.summaryBlock}>
        <div className={styles.header}>
          <div className={styles.title}>收入贡献</div>
          <div className={styles.setting}><Icon type="setting" theme="outlined" /></div>
        </div>
        <div className={styles.body}>
          <AccountSummaryCell label="股基净佣金收入(年)" content={yearStockBrokerage} />
          <AccountSummaryCell label="股基净佣金收入(月)" content={monthStockBrokerage} />
          <AccountSummaryCell label="产品净手续费收入(年)" content={yearProductFee} />
          <AccountSummaryCell label="产品净手续费收入(月)" content={monthProductFee} />
          <AccountSummaryCell label="融资融券净利息收入(年)" content={yearMarginFruits} />
          <AccountSummaryCell label="融资融券净利息收入(月)" content={monthMarginFruits} />
          <AccountSummaryCell label="质押净利息收入(年)" content={yearPledgeFruits} />
          <AccountSummaryCell label="质押净利息收入(月)" content={monthPledgeFruits} />
        </div>
      </div>
    </div>
  );
}

AccountSummary.propTypes = {
  data: PropTypes.object.isRequired,
};
