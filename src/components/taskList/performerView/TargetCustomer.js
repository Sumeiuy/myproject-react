/**
 * @fileOverview components/customerPool/TargetCustomer.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的目标客户
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Pagination, Row, Col } from 'antd';

import LabelInfo from './LabelInfo';
import Select from '../../common/Select';
import TargetCustomerRow from './TargetCustomerRow';

import styles from './targetCustomer.less';

// const EMPTY_LIST = [];

export default class TargetCustomer extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    page: PropTypes.object.isRequired,
  }

  @autobind
  handleStateChange() {

  }

  @autobind
  handlePageChange(pageNo) {
    const {
      replace,
      location: {
        pathname,
        query,
      },
    } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        pageNo,
      },
    });
  }

  @autobind
  handleSizeChange(current, pageSize) {
    const {
      replace,
      location: {
        pathname,
        query,
      },
    } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        pageSize,
        pageNo: 1,
      },
    });
  }

  @autobind
  handleRowClick({ id }) {
    console.log('click id>>>', id);
  }

  renderList() {
    const { list } = this.props;
    return list.map(o => <TargetCustomerRow
      key={o.custId}
      item={o}
      onClick={this.handleRowClick}
    />);
  }

  render() {
    const {
      page,
      location: {
        query: {
          pageNo = 1,
          pageSize = 10,
        },
      },
    } = this.props;
    const curPageNo = pageNo || page.pageNo;
    const curPageSize = pageSize || page.pageSize;
    const stateData = [{
      value: '',
      label: '全部',
      show: true,
    }, {
      value: '01',
      label: '处理中',
      show: true,
    }, {
      value: '02',
      label: '已完成',
      show: true,
    }, {
      value: '03',
      label: '待处理',
      show: true,
    }];
    return (
      <div className={styles.targetCustomer}>
        <LabelInfo value="目标客户" />
        <div className={styles.listControl}>
          <div className={styles.stateWidget}>
            <span className={styles.label}>状态:</span>
            <Select
              name="targetCustomerState"
              value={'全部客户'}
              data={stateData}
              onChange={this.handleStateChange}
            />
          </div>
          <div className={styles.total}>共 <span>{page.totalCount}</span> 位客户</div>
          <div className={styles.pagination}>
            <Pagination
              size="small"
              current={+curPageNo}
              total={+page.totalCount}
              pageSize={+curPageSize}
              showSizeChanger
              onChange={this.handlePageChange}
              onShowSizeChange={this.handleSizeChange}
            />
          </div>
        </div>
        <div className={styles.listBox}>
          <Row>
            <Col span={9}>
              <div className={styles.list}>
                { this.renderList() }
              </div>
            </Col>
            <Col span={15}></Col>
          </Row>
        </div>
      </div>
    );
  }
}
