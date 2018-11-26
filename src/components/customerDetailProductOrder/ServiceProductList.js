/*
 * @Author: yuanhaojie
 * @Date: 2018-11-23 09:51:00
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-26 20:26:45
 * @Description: 服务订单流水详情-服务产品
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Table from '../common/table';
import {
  SERVICE_PRODUCT_LIST_COLUMNS,
} from './config';
import styles from './serviceProductList.less';

function transformColumnsData(columns) {
  return _.map(columns, column => {
    let newColumn;
    switch(column.dataIndex) {
      case 'matchRisk':
      case 'matchTime':
      case 'matchInvestmentBrand':
        newColumn = {
          ...column,
          render: isBool => isBool ? '是' : '否',
        };
        break;
      default:
        newColumn = { ...column };
    }
    return newColumn;
  });
}

export default function ServiceProductList(props) {
  return (
    <div className={styles.productListWrap}>
      <Table
        pagination={false}
        dataSource={props.serviceProductList}
        columns={transformColumnsData(SERVICE_PRODUCT_LIST_COLUMNS)}
        className={styles.table}
        indentSize="0px"
      />
    </div>
  );
}

ServiceProductList.propTypes = {
  serviceProductList: PropTypes.array.isRequired,
};
