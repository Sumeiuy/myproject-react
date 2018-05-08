/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情-订购客户
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-08 17:24:29
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import { Popover, Table } from 'antd';
// import Pagination from '../../common/Pagination';
import config from '../config';
import styles from './orderingCustomer.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const titleList = config.titleList.orderCust;
export default class HistoryReport extends PureComponent {
  static propTypes = {
    // 订购客户数据
    data: PropTypes.object.isRequired,
    // 翻页
    pageChange: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  @autobind
  getNewTitleList(list) {
    const newTitleList = [...list];
    newTitleList[3].render = text => (
      this.renderPopover(text)
    );
    return newTitleList;
  }

  @autobind
  handlePaginationChange(page) {
    console.log('handlePaginationChange', page);
    const { pageChange } = this.props;
    pageChange(page);
  }

  // 设置 popover
  @autobind
  renderPopover(value) {
    let reactElement = null;
    if (value) {
      reactElement = (<Popover
        placement="bottomLeft"
        content={value}
        trigger="hover"
        overlayStyle={{
          width: '240px',
          padding: '10px',
          wordBreak: 'break-all',
        }}
      >
        <div className={styles.ellipsis}>
          {value}
        </div>
      </Popover>);
    } else {
      reactElement = '标题：暂无';
    }
    return reactElement;
  }

  render() {
    const {
      data,
    } = this.props;
    const {
      list = EMPTY_LIST,
      page = EMPTY_OBJECT,
    } = data;
    const PaginationOption = {
      current: page.pageNum,
      total: page.totalCount,
      pageSize: page.pageSize,
      showTotal: total => `共 ${total} 条`,
    };
    const newTitleList = this.getNewTitleList(titleList);
    return (
      <div className={styles.orderingCustomerBox}>
        <div className={`${styles.headBox} clearfix`}>
          <h3>订购客户</h3>
        </div>
        <Table
          columns={newTitleList}
          dataSource={list}
          pagination={PaginationOption}
          onChange={this.handlePaginationChange}
        />
        {/* <Pagination {...PaginationOption} /> */}
      </div>
    );
  }
}
