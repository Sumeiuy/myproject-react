/*
 * @Author: zuoguangzu
 * @Date: 2018-12-04 14:03:58
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-12-10 17:46:56
 * @description 个股收益明细表格
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Table from '../../common/table';
import Icon from '../../common/Icon';
import {
  ACCUMULATED_PROFIT,
  STOCKPERIOD_UPDOWN,
  SHAREHOLDING_YIELD,
} from '../config';
import styles from './incomeDetailTable.less';


// 改变股票期间涨跌和持股收益率返回值
function changeReturnValue(value) {
  if (value >= 0) {
    return `+${value}%`;
  }
  return `${value}%`;
}

// 获取表格列
function getColumns() {
  // 个股收益明细表格列
  const incomeDetailTableColumns = [
    {
      dataIndex: 'stockName',
      width: 300,
    },
    {
      title: ACCUMULATED_PROFIT,
      dataIndex: 'accumulatedProfit',
      width: 550,
    },
    {
      title: STOCKPERIOD_UPDOWN,
      dataIndex: 'stockPeriodUpDown',
      render: (item) => {
        const stockPeriodUpDown = classnames({
          [styles.stockPeriodUp]: item >= 0,
          [styles.stockPeriodDown]: item < 0,
        });
        return (
          <span className={stockPeriodUpDown}>
            {changeReturnValue(item)}
            <Icon className={styles.upDownIcon} type={item >= 0 ? 'zhang' : 'die'} />
          </span>
        );
      },
    },
    {
      title: SHAREHOLDING_YIELD,
      dataIndex: 'shareHoldingYield',
      render: (item) => {
        const shareHoldingYieldUpDown = classnames({
          [styles.shareHoldingYieldUp]: item >= 0,
          [styles.shareHoldingYieldDown]: item < 0,
        });
        return (
          <span className={shareHoldingYieldUpDown}>
            {changeReturnValue(item)}
            <Icon className={styles.upDownIcon} type={item >= 0 ? 'zhang' : 'die'} />
          </span>
        );
      },
    },
  ];
  return incomeDetailTableColumns;
}

export default function IncomeDetailTable(props) {
  const { IncomeTableData } = props;
  return (
    <div className={styles.attributionTable}>
      <Table
        columns={getColumns()}
        dataSource={IncomeTableData}
        pagination={false}
      />
    </div>
  );
}

IncomeDetailTable.propTypes = {
  IncomeTableData: PropTypes.array.isRequired,
};
