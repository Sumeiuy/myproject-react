/*
 * @Author: yuanhaojie
 * @Date: 2018-11-23 09:51:00
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-28 15:39:13
 * @Description: 服务订单流水详情-服务产品
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Table from '../common/table';
import Tooltip from '../common/Tooltip';
import { isNull } from '../../helper/check';
import {
  SERVICE_PRODUCT_LIST_COLUMNS,
} from './config';
import styles from './serviceProductList.less';

function transformColumnsData(columns) {
  return _.map(columns, (column) => {
    let newColumn;
    switch (column.dataIndex) {
      case 'matchRisk':
      case 'matchTime':
      case 'matchInvestmentBrand':
        newColumn = {
          ...column,
          render: isBool => (isBool ? '是' : '否'),
        };
        break;
      case 'productName':
        newColumn = {
          ...column,
          render: text => (
            <Tooltip title={text}>{text}</Tooltip>
          ),
        };
        break;
      default:
        newColumn = {
          ...column,
          render: text => <span>{isNull(text) ? '--' : text}</span>
        };
    }
    return newColumn;
  });
}

// 检查children为空数组的情况
function checkChildren(list) {
  return _.map(list, item => ({
    ...item,
    children: _.isEmpty(item.children) ? null : checkChildren(item.children),
  }));
}

export default function ServiceProductList(props) {
  return (
    <div className={styles.productListWrap}>
      <Table
        pagination={false}
        dataSource={checkChildren(props.serviceProductList)}
        columns={transformColumnsData(SERVICE_PRODUCT_LIST_COLUMNS)}
        className={styles.table}
        rowKey="productCode"
        indentSize={0}
      />
    </div>
  );
}

ServiceProductList.propTypes = {
  serviceProductList: PropTypes.array.isRequired,
};
