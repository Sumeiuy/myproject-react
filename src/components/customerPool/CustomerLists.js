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
    getCustIncome: PropTypes.func.isRequired,
    q: PropTypes.string,
    monthlyProfits: PropTypes.array.isRequired,
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
      getCustIncome,
      monthlyProfits,
    } = this.props;
    if (custList.length === 0) {
      return <div className="list-box"><NoData /></div>;
    }
    let current = 1;
    let pagesize = 10;
    let curTotal = 0;
    if (curPageNum) {
      current = Number(curPageNum);
    } else {
      current = Number(page.pageNo);
    }
    if (pageSize) {
      pagesize = Number(pageSize);
    } else {
      pagesize = Number(page.pageSize);
    }
    if (page.total) {
      curTotal = Number(page.total);
    }
    return (
      <div className="list-box">
        <div className="list-wrapper">
          {
            custList.map(
              item => <CustomerRow
                getCustIncome={getCustIncome}
                monthlyProfits={monthlyProfits}
                list={item}
                q={q}
                key={`${item.empId}-${item.custId}-${item.idNum}`}
              />,
            )
          }
        </div>
        <div className="list-pagination">
          <Pagination
            current={current}
            total={curTotal}
            pageSize={pagesize}
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
