/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情-订购客户
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-16 09:53:19
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import { Popover, Table } from 'antd';
import config from '../config';
import styles from './orderingCustomer.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const titleList = config.titleList.orderCust;
const { overlayStyle } = config;
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
    newTitleList[0].render = text => (
      <div className={styles.ellipsis} title={text}>
        {text}
      </div>
    );
    newTitleList[1].render = text => (
      <div className={styles.ellipsis} title={text}>
        {text}
      </div>
    );
    newTitleList[3].render = text => (
      this.renderPopover(text)
    );
    return newTitleList;
  }

  // 由于后端返回的列表数据存在id重复的情况，所以拼一个不会重复的rowKey用作渲染时的key
  @autobind
  getTransformList(list) {
    return list.map((item, index) => (
      {
        ...item,
        rowKey: `${item.customerId}${index}`,
      }
    ));
  }

  @autobind
  handlePaginationChange(page) {
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
        overlayStyle={overlayStyle}
      >
        <div className={styles.ellipsis}>
          {value}
        </div>
      </Popover>);
    } else {
      reactElement = '暂无';
    }
    return reactElement;
  }

  render() {
    const {
      data: {
        list = EMPTY_LIST,
        page = EMPTY_OBJECT,
      },
    } = this.props;
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
          dataSource={this.getTransformList(list)}
          pagination={PaginationOption}
          onChange={this.handlePaginationChange}
          rowKey={'rowKey'}
        />
      </div>
    );
  }
}
