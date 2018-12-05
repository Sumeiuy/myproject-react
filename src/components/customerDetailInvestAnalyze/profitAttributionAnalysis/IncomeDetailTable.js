/*
 * @Author: zuoguangzu
 * @Date: 2018-12-04 14:03:58
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-12-05 10:42:54
 * @description 个股收益明细表格
 */

import React from 'react';
import PropTypes from 'prop-types';
import Table from '../../common/table';
import { incomeDetailTableColumns } from '../config';
import styles from './attributionTable.less';

export default function IncomeDetailTable(props) {
  const { incomeDetailData } = props;
  const {
    stockInfo,
  } = incomeDetailData;
  return (
    <div className={styles.attributionTable}>
      <Table
        columns={incomeDetailTableColumns}
        dataSource={stockInfo}
        pagination={false}
      />
    </div>
  );
}

IncomeDetailTable.propTypes = {
  incomeDetailData: PropTypes.object.isRequired,
};
