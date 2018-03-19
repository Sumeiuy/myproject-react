/*
 * @Author: xuxiaoqin
 * @Date: 2018-01-03 14:00:18
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-03-16 17:19:11
 * 公用的Table,继承antd的Table组件，重写Pagination组件
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
// import _ from 'lodash';
import classNames from 'classnames';
import Pagination from '../Pagination';
// import { autobind } from 'core-decorators';

const EMPTY_OBJECT = {};

export default class CommonTable extends Table {

  static propTypes = {
    // 表格的props
    tableProps: PropTypes.object,
  }

  static defaultProps = {
    tableProps: EMPTY_OBJECT,
  }

  renderPagination(paginationPosition) {
    // 强制不需要分页
    if (!this.hasPagination()) {
      return null;
    }

    let size = 'default';
    const { pagination } = this.state;
    if (pagination.size) {
      size = pagination.size;
    } else if (String(this.props.size) === 'middle' || String(this.props.size) === 'small') {
      size = 'small';
    }

    const position = pagination.position || 'bottom';
    const total = pagination.total || this.getLocalData().length;

    return (total > 0 && (position === paginationPosition || position === 'both')) ? (
      <div className={this.props.paginationClass}>
        <Pagination
          paginationKey={`pagination-${paginationPosition}`}
          {...pagination}
          wrapClassName={classNames(pagination.className, `${this.props.prefixCls}-pagination`)}
          onChange={this.handlePageChange}
          total={total}
          size={size}
          current={this.getMaxCurrent(total)}
          onShowSizeChange={this.handleShowSizeChange}
        />
      </div>
    ) : null;
  }

  render() {
    return (
      <Table
        {...this.props}
      />
    );
  }
}
