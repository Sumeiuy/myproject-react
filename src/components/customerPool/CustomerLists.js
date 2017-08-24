/**
 * @file invest/CustRangeForList.js
 *  客户范围组件
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Pagination, Checkbox } from 'antd';

import NoData from './NoData';
import CustomerRow from './CustomerRow';

import styles from './customerLists.less';

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
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    pageSize: null,
    curPageNum: null,
    q: '',
  }

  @autobind
  handleSingleSelect(id) {
    console.log('id = ', id);
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
      location,
    } = this.props;
    if (!custList.length) {
      return <div className="list-box"><NoData /></div>;
    }
    // current: 默认第一页
    // pageSize: 默认每页大小10
    // curTotal: 当前列表数据总数
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
        <div className={styles.selectAllBox}>
          <div className="selectAll">
            <Checkbox>全选</Checkbox>
            <span className="hint">自动选择所有符合条件的客户</span>
          </div>
        </div>
        <div className="list-wrapper">
          {
            custList.map(
              item => <CustomerRow
                location={location}
                getCustIncome={getCustIncome}
                monthlyProfits={monthlyProfits}
                listItem={item}
                q={q}
                onChange={this.handleSingleSelect}
                key={`${item.empId}-${item.custId}-${item.idNum}-${item.telephone}-${item.asset}`}
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
          <Checkbox className={styles.selectAllTwo}>全选</Checkbox>
        </div>
      </div>
    );
  }
}
