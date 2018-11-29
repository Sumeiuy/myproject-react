/*
 * @Author: zhangjun
 * @Date: 2018-11-27 16:07:31
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-28 11:12:54
 * @description 归因表格
 */
import React from 'react';
import PropTypes from 'prop-types';
import Table from '../../common/table';
import { attributionTableColumns } from '../config';
import styles from './attributionTable.less';

export default function AttributionTable(props) {
  const { attributionResult } = props;
  return (
    <div className={styles.attributionTable}>
      <div className={styles.title}>统计期 Brinson 归因结果</div>
      <Table
        columns={attributionTableColumns}
        dataSource={attributionResult}
        pagination={false}
      />
    </div>
  );
}

AttributionTable.propTypes = {
  // brinson归因结果
  attributionResult: PropTypes.array.isRequired,
};
