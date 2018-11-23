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
import _ from 'lodash';
import moment from 'moment';
import Tooltip from '../common/Tooltip';
import { SingleFilter, SingleFilterWithSearch } from 'lego-react-filter/src';
import Table from '../common/table';
import DateFilter from '../common/htFilter/dateFilter';
import {
  SERVICE_ORDER_FLOW_COLUMNS,
  DEFAULT_PAGE_SIZE,
  DATE_FORMATE_STR,
  DATE_FORMATE_STR_DETAIL,
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

  @autobind
  transformColumnsData(columns) {
    return _.map(columns, column => {
      let newColumn;
      switch(column.dataIndex) {
        case 'orderNumber':
          const renderNum = id => (
            <a>{id}</a>
          );
          newColumn = {
            ...column,
            render: renderNum,
          };
          break;
        case 'createTime':
          const renderFunc = date => {
            const timeStr = moment(date).format(DATE_FORMATE_STR);
            const timeStrDetail = moment(date).format(DATE_FORMATE_STR_DETAIL);
            return (
              <span>
                <Tooltip title={timeStrDetail}>{timeStr}</Tooltip>
              </span>
            );
          };
          newColumn = {
            ...column,
            render: renderFunc,
          };
          break;
        default:
          newColumn = { ...column };
      }
      return newColumn;
    });
  }

  render() {
    const {
      serviceOrderFlow: {
        list = [],
        page = {},
      },
    } = this.props;
    const {
      curPageNum = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      totalRecordNum = 1,
    } = page;
    const pagination = {
      current: curPageNum,
      pageSize,
      total: totalRecordNum,
    };

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
            pagination={pagination}
            dataSource={list}
            columns={this.transformColumnsData(SERVICE_ORDER_FLOW_COLUMNS)}
            className={styles.table}
            rowClassName={styles.tableRow}
          />
        </div>
      </div>
    );
  }
}
