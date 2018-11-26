/*
 * @Author: yuanhaojie
 * @Date: 2018-11-23 09:51:00
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-26 12:58:06
 * @Description: 服务订单流水详情-服务产品
 */

import React from 'react';
import PropTypes from 'prop-types';
import Table from '../common/table'; 
import {
  SERVICE_PRODUCT_LIST_COLUMNS,
} from './config';
import styles from './serviceProductList.less';

export default function ServiceProductList(props) {
  return (
    <div className={styles.productListWrap}>
      <Table
        dataSource={props.serviceProductList}
        columns={SERVICE_PRODUCT_LIST_COLUMNS}
        className={styles.table}
      />
    </div>
  );
}

ServiceProductList.propTypes = {
  serviceProductList: PropTypes.array.isRequired,
};
