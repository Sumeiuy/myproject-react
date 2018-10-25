/*
 * @Author: sunweibin
 * @Date: 2018-10-15 22:30:04
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-24 16:52:45
 * @description 客户360详情交易数据展示模块
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import MoneyCell from './MoneyCell';
import RateCell from './RateCell';
import { displayMoney } from '../customerDetailAccountInfo/utils';
import { number } from '../../helper';

import styles from './summaryTransaction.less';

export default function SummaryTransaction(props) {
  const { data } = props;
  if (_.isEmpty(data)) {
    return null;
  }
  // 总资产
  const assetText = displayMoney(data.asset);
  // 净佣金
  const purRake = displayMoney(data.purRake);
  // 利息收入
  const netIncome = displayMoney(data.netIncome);
  // 天天发
  const ttfMtkVal = displayMoney(data.ttfMtkVal);
  // 资金余额
  const cashAmt = displayMoney(data.cashAmt);
  // 年产品销量
  const yearProdAmt = displayMoney(data.yearProdAmt);
  // 产品日均保有
  const yearProdHold = displayMoney(data.yearProdHold);
  // 归集率
  const gjlRate = number.convertRate(data.gjlRate);
  // 股基佣金率,此值是千分比
  const minFee = number.convertPermillage(data.minFee);
  return (
    <div className={styles.wrap}>
      <MoneyCell title="总资产" content={assetText} />
      <RateCell title="年日均资产" current={data.yearAvgAssets} last={data.lastYearAvgAssets} />
      <RateCell title="年收益率" current={data.yearMaxCostRate} last={data.lastYearMaxCostRate} isMoney={false} />
      <RateCell title="年股基交易量" current={data.yearGjAmt} last={data.lastYearGjAmt} />
      <MoneyCell title="净佣金" content={purRake} />
      <MoneyCell title="利息收入" content={netIncome} />
      <MoneyCell title="年产品销量" content={yearProdAmt} />
      <MoneyCell title="产品日均保有" content={yearProdHold} />
      <MoneyCell title="天天发" content={ttfMtkVal} />
      <MoneyCell title="资金余额" content={cashAmt} />
      <MoneyCell title="归集率" content={gjlRate} />
      <MoneyCell title="股基佣金率" content={minFee} />
    </div>
  );
}

SummaryTransaction.propTypes = {
  data: PropTypes.object,
};
SummaryTransaction.defaultProps = {
  data: {},
};
