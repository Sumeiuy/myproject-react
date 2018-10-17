/*
 * @Author: sunweibin
 * @Date: 2018-10-15 22:30:04
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-17 15:34:46
 * @description 客户360详情交易数据展示模块
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import MoneyCell from './MoneyCell';
import RateCell from './RateCell';
import { displayTransMoney } from '../customerDetailAccountInfo/utils';
import { calcSameTimeRate, convertRate } from './utils';

import styles from './summaryTransaction.less';

export default function SummaryTransaction(props) {
  const { data } = props;
  if (_.isEmpty(data)) {
    return null;
  }
  // 总资产
  const assetText = displayTransMoney(data.asset);
  // 年日均资产
  const yearAvgAssets = displayTransMoney(data.yearAvgAssets);
  // 年日均资产增长率
  const yearAvgAssetsRate = calcSameTimeRate(data.yearAvgAssets, data.lastYearAvgAssets);
  // 年收益率
  const yearMaxCost = convertRate(data.yearMaxCostRate);
  // 年收益率增长率
  const yearMaxCostRate = calcSameTimeRate(data.yearMaxCostRate, data.lastYearMaxCostRate);
  // 年股基交易量
  const yearGjAmt = displayTransMoney(data.yearGjAmt);
   // 年股基交易量增长率
  const yearGjAmtRate = calcSameTimeRate(data.yearGjAmt, data.lastYearGjAmt);
  // 净佣金
  const purRake = displayTransMoney(data.purRake);
  // 利息收入
  const netIncome = displayTransMoney(data.netIncome);
  // 天天发
  const ttfMtkVal = displayTransMoney(data.ttfMtkVal);
  // 资金余额
  const cashAmt = displayTransMoney(data.cashAmt);
  // 年产品销量
  const yearProdAmt = displayTransMoney(data.yearProdAmt);
  // 产品日均保有
  const yearProdHold = displayTransMoney(data.yearProdHold);
  // 归集率
  const gjlRate = convertRate(data.gjlRate);
  // 股基佣金率
  const minFee = convertRate(data.minFee);
  return (
    <div className={styles.wrap}>
      <MoneyCell title="总资产" content={assetText} />
      <RateCell title="年日均资产" content={yearAvgAssets} rate={yearAvgAssetsRate}/>
      <RateCell title="年收益率" content={yearMaxCost} rate={yearMaxCostRate}/>
      <RateCell title="年股基交易量" content={yearGjAmt} rate={yearGjAmtRate}/>
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
