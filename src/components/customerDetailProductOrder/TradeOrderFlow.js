/*
 * @Author: yuanhaojie
 * @Date: 2018-11-21 09:35:09
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-28 13:16:24
 * @Description: 交易订单流水
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import Table from '../common/table';
import Tooltip from '../common/Tooltip';
import IfTableWrap from '../common/IfTableWrap';
import {
  TRADE_ORDER_FLOW_COLUMNS,
  DATE_FORMATE_STR,
  DATE_FORMATE_STR_DETAIL,
  DEFAULT_PAGE_SIZE,
} from './config';
import styles from './tradeOrderFlow.less';

const NODATA_HINT = '客户暂无交易订单信息';

export default class TradeOrderFlow extends PureComponent {
  static propsType = {
    tradeOrderFlowData: PropTypes.object.isRequired,
    onTradeOrderFlowChange: PropTypes.func.isRequired,
  };

  componentDidMount() {
    // 获取初始数据
    this.props.onTradeOrderFlowChange(1, DEFAULT_PAGE_SIZE);
  }

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
        case 'riskMatched':
        case 'timeMacthed':
        case 'varietyMatched':
          newColumn = {
            ...column,
            render: isBool => isBool ? '是' : '否',
          };
          break;
        case 'productName':
        case 'confirmationType':
          newColumn = {
            ...column,
            render: content => (
              <span>
                {
                  _.isEmpty(content)
                  ? '--'
                  : <Tooltip title={content}>{content}</Tooltip>
                }
              </span>
            )
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
          newColumn = {
            ...column,
            render: content => (
              <span>{_.isEmpty(content) && !_.isNumber(content) ? '--' : content}</span>
            )
          };
      }
      return newColumn;
    });
  }

  render() {
    const {
      tradeOrderFlowData: {
        custTradeOrderDTOList = [],
        pageDTO = {},
      },
    } = this.props;
    const {
      pageNum = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      totalCount = 1,
    } = pageDTO;
    const pagination = {
      current: pageNum,
      pageSize,
      total: totalCount,
    };
    const isRender = custTradeOrderDTOList.length !== 0;

    return (
      <div className={styles.tradeOrderFlowWrap}>
        <IfTableWrap isRender={isRender} text={NODATA_HINT}>
          <Table
            pagination={pagination}
            dataSource={custTradeOrderDTOList}
            columns={this.transformColumnsData(TRADE_ORDER_FLOW_COLUMNS)}
            rowKey="orderTime"
            className={styles.table}
            rowClassName={styles.tableRow}
            onChange={this.handlePageChanged}
          />
        </IfTableWrap>
      </div>
    );
  }
}
