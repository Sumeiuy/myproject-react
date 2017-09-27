/**
 *@file customerPool/CustomerGrouplist
 *客户分组列表
 *@author zhuyanwen
 * */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { withRouter } from 'dva/router';
import { Table } from 'antd';

@withRouter
export default class CustomerGrouplist extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    cusgroupPage: PropTypes.object.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    rowSelection: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
    locationPage: PropTypes.object.isRequired,
  }
  @autobind
  handleChange(nextPage, currentPageSize) {
    this.props.onPageChange({
      nextPage,
      currentPageSize,
    });
  }
  render() {
    const { data, columns, cusgroupPage, onSizeChange,
        rowSelection, className, locationPage } = this.props;
    return (
      <Table
        className={className}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={{
          total: cusgroupPage.totalRecordNum,
          pageSize: +locationPage.curPageSize || cusgroupPage.pageSize,
          current: +locationPage.curPageNum || cusgroupPage.curPageNum,
          size: 'small',
          onChange: this.handleChange,
          showTotal: () => (`共${cusgroupPage.totalRecordNum}项`),
          showSizeChanger: true,
          onShowSizeChange: onSizeChange,
        }}
      />
    );
  }

}
