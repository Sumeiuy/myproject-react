/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情-订购客户
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-05 15:49:11
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import { Popover, Table } from 'antd';
import {
  titleList as titleListConfig,
  overlayStyle,
  sourceType,
} from '../config';
import styles from './orderingCustomer.less';
import logable from '../../../decorators/logable';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const titleList = titleListConfig.orderCust;
export default class OrderingCustomer extends PureComponent {
  static propTypes = {
    // 当前组合code
    combinationCode: PropTypes.string,
    // 订购客户数据
    data: PropTypes.object.isRequired,
    // 翻页
    pageChange: PropTypes.func.isRequired,
    // 组合数据，用于跳转到客户列表页面
    combinationData: PropTypes.object,
    // 打开持仓查客户页面
    openCustomerListPage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    combinationCode: '',
    combinationData: EMPTY_OBJECT,
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
  @logable({ type: 'Click', payload: { name: '页码切换', value: '$args[0].current' } })
  handlePaginationChange(page) {
    const { pageChange } = this.props;
    pageChange(page);
  }

  // 设置 popover
  @autobind
  renderPopover(value) {
    let reactElement = null;
    if (value) {
      reactElement = (
        <Popover
          placement="bottomLeft"
          content={value}
          trigger="hover"
          overlayStyle={overlayStyle}
        >
          <div className={styles.ellipsis}>
            {value}
          </div>
        </Popover>
      );
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
      openCustomerListPage,
      combinationData,
      combinationCode,
    } = this.props;
    const PaginationOption = {
      current: page.pageNum || 1,
      total: page.totalCount || 0,
      pageSize: page.pageSize || 5,
    };
    const newTitleList = this.getNewTitleList(titleList);
    const openPayload = {
      name: combinationData.composeName,
      code: combinationData.productCode,
      source: sourceType.combination,
      combinationCode,
    };
    return (
      <div className={styles.orderingCustomerBox}>
        <div className={`${styles.headBox} clearfix`}>
          <h3>订购客户</h3>
          <a onClick={() => openCustomerListPage(openPayload)}>进入客户列表</a>
        </div>
        <Table
          columns={newTitleList}
          dataSource={this.getTransformList(list)}
          pagination={PaginationOption}
          onChange={this.handlePaginationChange}
          rowKey="rowKey"
        />
      </div>
    );
  }
}
