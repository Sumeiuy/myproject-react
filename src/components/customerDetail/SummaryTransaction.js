/*
 * @Author: sunweibin
 * @Date: 2018-10-15 22:30:04
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-12 17:43:59
 * @description 客户360详情交易数据展示模块
 */
import React from 'react';
import PropTypes from 'prop-types';

import Cell from './Cell';
import styles from './summaryTransaction.less';

export default function SummaryTransaction(props, context) {
  const { data, custRowId } = props;
  const { custBasic: { custNature } } = context;
  // 跳转到股基佣金率详情页面
  const jumpToGJDetial = () => {
    const url = `/customerCenter/360/${custNature}/toCommission?rowId=${custRowId}`;
    // 新版直接使用push
    context.push({
      pathname: '/fsp/customerCenter/toCommission',
      state: {
        url,
      }
    });
  };

  // 股基佣金率详情入口
  const gjlRateDetailIcon = (<span onClick={jumpToGJDetial} className={styles.detail}>详情</span>);

  return (
    <div className={styles.wrap}>
      <Cell title="总资产" indicator={data.asset} />
      <Cell title="年日均资产" indicator={data.yearAvgAssets} compareTip />
      <Cell
        title="年收益率"
        indicator={data.yearMaxCostRate}
        compareTip
        valueType="percent"
      />
      <Cell
        title="年股基交易量"
        indicator={data.yearGjAmt}
        compareTip
      />
      <Cell title="净佣金" indicator={data.purRake} />
      <Cell title="利息收入" indicator={data.netIncome} />
      <Cell title="年产品销量" indicator={data.yearProdAmt} />
      <Cell title="产品日均保有" indicator={data.yearProdHold} />
      <Cell title="天天发" indicator={data.ttfMtkVal} />
      <Cell title="资金余额" indicator={data.cashAmt} />
      <Cell title="归集率" indicator={data.gjlRate} valueType="percent" />
      <Cell
        title="股基佣金率"
        indicator={data.minFee}
        valueType="permillage"
        titleExtra={gjlRateDetailIcon}
      />
    </div>
  );
}

SummaryTransaction.propTypes = {
  // 客户的RowId
  custRowId: PropTypes.string.isRequired,
  // 交易数据
  data: PropTypes.object,
};
SummaryTransaction.contextTypes = {
  custBasic: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
};
SummaryTransaction.defaultProps = {
  data: {},
};
