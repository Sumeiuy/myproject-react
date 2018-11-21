/*
 * @Author: yuanhaojie
 * @Date: 2018-11-21 09:35:09
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-21 18:47:05
 * @Description: 交易订单流水
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import Table from '../common/table';
import Tooltip from '../common/Tooltip';
import {
  TRADE_ORDER_FLOW_COLUMNS,
  DATE_FORMATE_STR,
  DATE_FORMATE_STR_DETAIL,
  DEFAULT_PAGE_SIZE,
} from './config';
import styles from './tradeOrderFlow.less';

export default class TradeOrderFlow extends PureComponent {
  static propsType = {
    tradeOrderFlowData: PropTypes.object.isRequired,
    onTradeOrderFlowChange: PropTypes.func.isRequired,
  };

  @autobind
  handlePageChanged(changedPage) {
    const {
      current,
      pageSize,
    } = changedPage;
    this.props.onTradeOrderFlowChange(current, pageSize);
  }

  @autobind
  transformColumnsData(columns) {
    return _.map(columns, column => {
      let newColumn;
      switch(column.dataIndex) {
        case 'isRiskMatched':
        case 'isTimeMacthed':
        case 'isVarietyMatched':
          newColumn = {
            ...column,
            render: isBool => isBool ? '是' : '否',
          };
          break;
        case 'orderTime':
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
      tradeOrderFlowData: {
        list = [],
        page = {},
      },
    } = this.props;
    const {
      pageNum = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      totalCount = 1,
    } = page;
    const pagination = {
      current: pageNum,
      pageSize,
      total: totalCount,
    };

    return (
      <div className={styles.tradeOrderFlowWrap}>
        <Table
          pagination={pagination}
          dataSource={list}
          columns={this.transformColumnsData(TRADE_ORDER_FLOW_COLUMNS)}
          className={styles.table}
          rowClassName={styles.tableRow}
          onChange={this.handlePageChanged}
        />
      </div>
    );
  }
}
