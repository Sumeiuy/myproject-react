/**
 * @file invest/CustRangeForList.js
 *  客户范围组件
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { Pagination } from 'antd';

import NoData from './NoData';
import CustomerRow from './CustomerRow';

export default class CustomerLists extends PureComponent {
  static propTypes = {
    page: PropTypes.object.isRequired,
    custList: PropTypes.array.isRequired,
    curPageNum: PropTypes.string,
    pageSize: PropTypes.string,
    onPageChange: PropTypes.func.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    q: PropTypes.string,
  }

  static defaultProps = {
    pageSize: null,
    curPageNum: null,
    q: '',
  }

  render() {
    const {
      q,
      page,
      custList,
      curPageNum,
      pageSize,
      onPageChange,
      onSizeChange,
    } = this.props;
    if (custList.length === 0) {
      return <div className="list-box"><NoData /></div>;
    }
    return (
      <div className="list-box">
        <div className="list-wrapper">
          {
            custList.map(item => <CustomerRow list={item} q={q} key={item.empId} />)
          }
        </div>
        <div className="list-pagination">
          <Pagination
            current={curPageNum || page.pageNo}
            total={page.total}
            pageSize={pageSize || page.pageSize}
            onChange={onPageChange}
            size="small"
            showSizeChanger
            showTotal={total => `共${total}项`}
            onShowSizeChange={onSizeChange}
          />
        </div>
      </div>
    );
  }
}
