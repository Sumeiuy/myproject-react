/*
 * @Author: yuanhaojie
 * @Date: 2018-11-20 10:31:29
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-20 20:17:43
 * @Description: 服务订单流水
 */

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import { SingleFilter, SingleFilterWithSearch } from 'lego-react-filter/src';
import Table from '../common/table';
import DateFilter from '../common/htFilter/dateFilter';
import { SERVICE_ORDER_FLOW_COLUMNS } from './config';
import styles from './productOrderFlow.less';

export default class ProductOrderFlow extends PureComponent {
  render() {
    return (
      <div className={styles.productOrderFlowWrap}>
        <div className={styles.header}>
          <div className={styles.filterItem}>
            <SingleFilterWithSearch
              filterName="服务产品"
              filterId="serviceProduct"
              // value={}
              // data={}
              // onChange={}
              placeholder="请输入服务产品"
            />
          </div>
          <div className={styles.filterItem}>
            <SingleFilter
              filterName="类型"
              filterId="serviceType"
              // data={}
              // value={}
              // onChange={}
            />
          </div>
          <div className={styles.filterItem}>
            <DateFilter
              filterName="创建日期"
              // initialStartDate={}
              // value={}
              // onChange={}
              disabledCurrentEnd={false}
            />
          </div>
        </div>
        <div className={styles.body}>
          <Table
            // dataSource={}
            columns={SERVICE_ORDER_FLOW_COLUMNS}
            className={styles.table}
          />
        </div>
      </div>
    );
  }
}
