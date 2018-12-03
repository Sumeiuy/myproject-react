/*
 * @Author: xuxiaoqin
 * @Date: 2018-01-03 14:00:18
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-09 15:37:33
 * 公用的Table,继承antd的Table组件，重写Pagination组件引用
 */

import React from 'react';
import { Table } from 'antd';
import classNames from 'classnames';
import Pagination from '../Pagination';

export default class ExtendedTable extends Table {
  renderPagination(paginationPosition) {
    // 强制不需要分页
    if (!this.hasPagination()) {
      return null;
    }
    let size = 'default';
    const { pagination } = this.state;
    if (pagination.size) {
      size = pagination.size;
    } else if (this.props.size === 'middle' || this.props.size === 'small') {
      size = 'small';
    }

    const position = pagination.position || 'bottom';
    const total = pagination.total || this.getLocalData().length;
    return (total > 0 && (position === paginationPosition || position === 'both')) ? (
      <Pagination
        key={`pagination-${paginationPosition}`}
        {...pagination}
        className={classNames(pagination.className, `${this.props.prefixCls}-pagination`)}
        onChange={this.handlePageChange}
        total={total}
        size={size}
        current={this.getMaxCurrent(total)}
        onShowSizeChange={this.handleShowSizeChange}
        useClearStyle
      />
    ) : null;
  }
}
