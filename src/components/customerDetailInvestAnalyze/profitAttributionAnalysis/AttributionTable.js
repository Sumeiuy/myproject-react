/*
 * @Author: zhangjun
 * @Date: 2018-11-27 16:07:31
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-07 09:27:41
 * @description 归因表格
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Table from '../../common/table';
import { attributionTableColumns, ATTRIBUTION_INVEST_STYLE_LIST } from '../config';
import styles from './attributionTable.less';

export default function AttributionTable(props) {
  const { attributionResult } = props;
  // 归因表格的第一列数据是前端配置的数据，所以需要把第一列的数据和后端返回的数据合并起来
  const dataSource = _.map(attributionResult, (item, index) => {
    const type = ATTRIBUTION_INVEST_STYLE_LIST[index];
    return {
      ...item,
      type,
    };
  });
  return (
    <div className={styles.attributionTable}>
      <div className={styles.title}>统计期 Brinson 归因结果</div>
      <Table
        columns={attributionTableColumns}
        dataSource={dataSource}
        pagination={false}
      />
    </div>
  );
}

AttributionTable.propTypes = {
  // brinson归因结果
  attributionResult: PropTypes.array.isRequired,
};
