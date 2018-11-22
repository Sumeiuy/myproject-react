/*
 * @Author: yuanhaojie
 * @Date: 2018-11-20 10:31:29
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-22 19:29:03
 * @Description: 服务订单流水
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { SingleFilter, SingleFilterWithSearch } from 'lego-react-filter/src';
import Table from '../common/table';
import DateFilter from '../common/htFilter/dateFilter';
import {
  SERVICE_ORDER_FLOW_COLUMNS,
  DEFAULT_PAGE_SIZE,
} from './config';
import styles from './productOrderFlow.less';

export default class ProductOrderFlow extends PureComponent {
  static propsTypes = {
    productListBySearch: PropTypes.array.isRequired,
    serviceOrderFlow: PropTypes.object.isRequired,
    onProductOrderFlowChange: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.onProductOrderFlowChange({
      curPageNum: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  }

  @autobind
  handleSearchChanged(value) {
  }

  render() {
    // const {
    //   productListBySearch,
    //   serviceOrderFlow,
    // } = this.props;

    return (
      <div className={styles.productOrderFlowWrap}>
        <div className={styles.header}>
          <div className={styles.filterItem}>
            <SingleFilterWithSearch
              filterName="服务产品"
              filterId="serviceProduct"
              // value={''}
              // data={productListBySearch}
              onChange={this.handleSearchChanged}
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
            // dataSource={serviceOrderFlow}
            columns={SERVICE_ORDER_FLOW_COLUMNS}
            className={styles.table}
          />
        </div>
      </div>
    );
  }
}
