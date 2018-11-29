/*
 * @Author: zhangjun
 * @Date: 2018-11-22 14:49:12
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-27 13:30:37
 * @description 资产变动表格
 */
import React from 'react';
import PropTypes from 'prop-types';

import Table from '../../common/table';
import { number } from '../../../helper';
import styles from './assetChangeTable.less';

const { thousandFormat } = number;

export default function AssetChangeTable(props) {
  const assetChangeTableColumns = [
    {
      title: '期初资产 (万元)',
      dataIndex: 'initialAsset',
      render: text => (thousandFormat(text)),
      width: 180,
    },
    {
      title: '资金投入 (万元)',
      dataIndex: 'fundInvestment',
      render: text => (thousandFormat(text)),
    },
    {
      title: '资产转出 (万元)',
      dataIndex: 'assetTransfer',
      render: text => (thousandFormat(text)),
    },
    {
      title: '净流入资产 (万元)',
      dataIndex: 'netInflowAsset',
      render: text => (thousandFormat(text)),
    },
    {
      title: '投资收益 (万元)',
      dataIndex: 'investmentIncomeData',
      key: 'investmentIncomeData',
      render: (text, record) => {
        const { investmentIncome, periodYield } = record;
        // 投资收益的正负号
        const investmentIncomeSign = investmentIncome.substr(0, 1);
        // 投资收益数值, 去掉数值前面的正负号, 然后进行千分位转化
        const investmentIncomeData = thousandFormat(investmentIncome.substr(1));
        // 投资收益
        const finalInvestmentIncome = `${investmentIncomeSign}${investmentIncomeData}`;
        // 收益率
        const periodYieldData = `(${periodYield})`;
        return (
          <div className={styles.investmentIncomeWrapper}>
            <p className={styles.investmentIncome}>{finalInvestmentIncome}</p>
            <p className={styles.periodYield}>{periodYieldData}</p>
          </div>
        );
      }
    },
    {
      title: '期末资产 (万元)',
      dataIndex: 'termAsset',
      render: text => (thousandFormat(text)),
    },
  ];
  const { assetChangeList } = props;
  return (
    <div className={styles.assetChangeTable}>
      <Table
        columns={assetChangeTableColumns}
        dataSource={assetChangeList}
        pagination={false}
      />
    </div>
  );
}

AssetChangeTable.propTypes = {
  assetChangeList: PropTypes.array.isRequired,
};
