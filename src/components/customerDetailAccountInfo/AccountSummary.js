/*
 * @Author: sunweibin
 * @Date: 2018-10-23 13:38:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-23 15:58:19
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
  const firstTransactionDate = _.get(data, 'acountRelative.firstTransactionDate');
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
  const thisYearYieldRate = _.get(data, 'assetsRelative.thisYearYieldRate');
  // 本年信用账户收益率(%)
  const thisYearCreditYieldRate = _.get(data, 'assetsRelative.thisYearCreditYieldRate');
  // 本年股票收益率(%)
  const thisYearStockYieldRate = _.get(data, 'assetsRelative.thisYearStockYieldRate');
  // 本年产品收益率(%)
  const thisYearProductYieldRate = _.get(data, 'assetsRelative.thisYearProductYieldRate');
  // 交易/销售相关
  // 股基交易量（年）
  const yearStockTransactionValue = _.get(data, 'transactionRelative.yearStockTransactionValue');
  // 股基交易量（月）
  const monthStockTransactionValue = _.get(data, 'transactionRelative.monthStockTransactionValue');
  // 信用交易量（年）
  const yearCreditTransactionValue = _.get(data, 'transactionRelative.yearCreditTransactionValue');
  // 信用交易量（月）
  const monthCreditTransactionValue = _.get(data, 'transactionRelative.monthCreditTransactionValue');
  // 产品销量（年）
  const yearProductSaleValue = _.get(data, 'transactionRelative.yearProductSaleValue');
  // 产品销量（月）
  const monthProductSaleValue = _.get(data, 'transactionRelative.monthProductSaleValue');
  // 收益凭证销量（年）
  const yearIncomeReceiptSaleValue = _.get(data, 'transactionRelative.yearIncomeReceiptSaleValue');
  // 收益凭证销量（月）
  const monthIncomeReceiptSaleValue = _.get(data, 'transactionRelative.monthIncomeReceiptSaleValue');
  // 收入贡献相关
  // 股基净佣金收入（年）
  const yearStockCommission = _.get(data, 'incomeRelative.yearStockCommission');
  // 股基净佣金收入（月）
  const monthStockCommission = _.get(data, 'incomeRelative.monthStockCommission');
  // 产品净手续费收入（年）
  const yearProductCharge = _.get(data, 'incomeRelative.yearProductCharge');
  // 产品净手续费收入（月）
  const monthProductCharge = _.get(data, 'incomeRelative.monthProductCharge');
  // 融资融券净利息收入（年）
  const yearMarginInterests = _.get(data, 'incomeRelative.yearMarginInterests');
  // 融资融券净利息收入（月）
  const monthMarginInterests = _.get(data, 'incomeRelative.monthMarginInterests');
  // 质押净利息收入（年）
  const yearPledgeInterests = _.get(data, 'incomeRelative.yearPledgeInterests');
  // 质押净利息收入（月）
  const monthPledgeInterests = _.get(data, 'incomeRelative.monthPledgeInterests');

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
          <AccountSummaryCell label="首次交易日期" type="DATE" content={firstTransactionDate} />
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
          <AccountSummaryCell label="本年收益率(%)" type="RATE" content={thisYearYieldRate} />
          <AccountSummaryCell label="本年信用账户收益率(%)" type="RATE" content={thisYearCreditYieldRate} />
          <AccountSummaryCell label="本年股票收益率(%)" type="RATE" content={thisYearStockYieldRate} />
          <AccountSummaryCell label="本年产品收益率(%)" type="RATE" content={thisYearProductYieldRate} />
        </div>
      </div>
      <div className={styles.summaryBlock}>
        <div className={styles.header}>
          <div className={styles.title}>交易/销售</div>
          <div className={styles.setting}><Icon type="setting" theme="outlined" /></div>
        </div>
        <div className={styles.body}>
          <AccountSummaryCell label="股基交易量（年）" content={yearStockTransactionValue} />
          <AccountSummaryCell label="股基交易量（月）" content={monthStockTransactionValue} />
          <AccountSummaryCell label="信用交易量（年）" content={yearCreditTransactionValue} />
          <AccountSummaryCell label="信用交易量（月）" content={monthCreditTransactionValue} />
          <AccountSummaryCell label="产品销量（年）" content={yearProductSaleValue} />
          <AccountSummaryCell label="产品销量（月）" content={monthProductSaleValue} />
          <AccountSummaryCell label="收益凭证销量（年）" content={yearIncomeReceiptSaleValue} />
          <AccountSummaryCell label="收益凭证销量（月）" content={monthIncomeReceiptSaleValue} />
        </div>
      </div>
      <div className={styles.summaryBlock}>
        <div className={styles.header}>
          <div className={styles.title}>收入贡献</div>
          <div className={styles.setting}><Icon type="setting" theme="outlined" /></div>
        </div>
        <div className={styles.body}>
          <AccountSummaryCell label="股基净佣金收入（年）" content={yearStockCommission} />
          <AccountSummaryCell label="股基净佣金收入（月）" content={monthStockCommission} />
          <AccountSummaryCell label="产品净手续费收入（年）" content={yearProductCharge} />
          <AccountSummaryCell label="产品净手续费收入（月）" content={monthProductCharge} />
          <AccountSummaryCell label="融资融券净利息收入（年）" content={yearMarginInterests} />
          <AccountSummaryCell label="融资融券净利息收入（月）" content={monthMarginInterests} />
          <AccountSummaryCell label="质押净利息收入（年）" content={yearPledgeInterests} />
          <AccountSummaryCell label="质押净利息收入（月）" content={monthPledgeInterests} />
        </div>
      </div>
    </div>
  );
}

AccountSummary.propTypes = {
  data: PropTypes.object.isRequired,
};
