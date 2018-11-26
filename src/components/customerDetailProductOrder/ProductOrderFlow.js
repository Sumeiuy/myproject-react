/*
 * @Author: yuanhaojie
 * @Date: 2018-11-20 10:31:29
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-26 13:55:38
 * @Description: 服务订单流水
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import Tooltip from '../common/Tooltip';
import { SingleFilter } from 'lego-react-filter/src';
import Table from '../common/table';
import DateFilter from '../common/htFilter/dateFilter';
import IfTableWrap from '../common/IfTableWrap';
import ProductOrderDetail from './ProductOrderDetail';
import {
  SERVICE_ORDER_FLOW_COLUMNS,
  DEFAULT_PAGE_SIZE,
  DATE_FORMATE_STR,
  DATE_FORMATE_STR_DETAIL,
} from './config';
import styles from './productOrderFlow.less';

// 默认查询日期半年
const DEFAULT_START_DATE = moment().subtract(6, 'months');
const DEFAULT_END_DATE = moment().subtract(1, 'day');
// 接口请求查询日期的格式
const DATE_FORMATE_API = 'YYYY-MM-DD';
const NODATA_HINT = '客户暂无服务订单信息';

export default class ProductOrderFlow extends PureComponent {
  static propsTypes = {
    productListBySearch: PropTypes.array.isRequired,
    serviceOrderFlow: PropTypes.object.isRequired,
    onProductOrderFlowChange: PropTypes.func.isRequired,
    serviceOrderDetail: PropTypes.object.isRequired,
    serviceProductList: PropTypes.array.isRequired,
    orderApproval: PropTypes.object.isRequired,
    otherCommissions: PropTypes.object.isRequired,
    queryServiceOrderDetail: PropTypes.func.isRequired,
    queryServiceProductList: PropTypes.func.isRequired,
    queryOrderApproval: PropTypes.func.isRequired,
    queryOtherCommissions: PropTypes.func.isRequired,
    queryJxGroupProduct: PropTypes.func.isRequired,
    attachmentList: PropTypes.array.isRequired,
    getAttachmentList: PropTypes.func.isRequired,
  };

  static contextTypes = {
    dict: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isProductOrderDetailShow: false,
      orderNumber: '', // 订单详情的编号
      serviceProductCode: '',
      serviceType: '',
      standardStartDate: DEFAULT_START_DATE.format(DATE_FORMATE_API),
      standardEndDate: DEFAULT_END_DATE.format(DATE_FORMATE_API),
    };
  }

  componentDidMount() {
    const {
      serviceProductCode,
      serviceType,
      standardStartDate,
      standardEndDate,
    } = this.state;
    this.props.onProductOrderFlowChange({
      curPageNum: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      serviceProductCode,
      serviceType,
      createTimeFrom: standardStartDate,
      createTimeTo: standardEndDate,
    });
  }

  @autobind
  handleSearchChanged(value) {
    if ( _.trim(value) !== '') {
      this.props.queryJxGroupProduct({
        keyword: value,
      });
    }
  }

  @autobind
  handleServiceProductChanged(value) {
  }

  @autobind
  handleServiceTypeChanged(e) {
    this.setState({
      serviceType: e.value,
    }, this.handleProductOrderFlowChange);
  }

  @autobind
  haneleDateChanged(e) {
    this.setState({
      standardStartDate: e.value[0],
      standardEndDate: e.value[1],
    }, this.handleProductOrderFlowChange);
  }

  @autobind
  handlePageChanged(changedPage) {
    this.handleProductOrderFlowChange(changedPage);
  }

  @autobind
  handleProductOrderFlowChange(page) {
    const {
      serviceProductCode,
      serviceType,
      standardStartDate,
      standardEndDate,
    } = this.state;
    let payload = {
      serviceProductCode,
      type: serviceType,
      createTimeFrom: standardStartDate,
      createTimeTo: standardEndDate,
      pageSize: DEFAULT_PAGE_SIZE,
      curPageNum: 1,
    };
    if (page) {
      payload = {
        ...payload,
        curPageNum: page.current,
      };
    }
    this.props.onProductOrderFlowChange(payload);
  }

  @autobind
  handleOrderNumberClicked(id) {
    this.setState({
      isProductOrderDetailShow: true,
      orderNumber: id,
    });
  }

  @autobind
  handleDetailModalClose() {
    this.setState({
      isProductOrderDetailShow: false,
      orderNumber: '',
    });
  }

  @autobind
  transformColumnsData(columns) {
    return _.map(columns, column => {
      let newColumn;
      switch(column.dataIndex) {
        case 'orderNumber':
          const renderNum = id => (
            <a onClick={() => this.handleOrderNumberClicked(id)}>{id}</a>
          );
          newColumn = {
            ...column,
            render: renderNum,
          };
          break;
        case 'createTime':
          const renderFunc = date => {
            const timeStr = moment(date).format(DATE_FORMATE_STR);
            const timeStrDetail = moment(date).format(DATE_FORMATE_STR_DETAIL);
            return (
              <span>
                <Tooltip title={timeStrDetail}>{timeStr}</Tooltip>
              </span>
            );
          };
          newColumn = {
            ...column,
            render: renderFunc,
          };
          break;
        default:
          newColumn = { ...column };
      }
      return newColumn;
    });
  }

  render() {
    const {
      serviceOrderFlow: {
        list = [],
        page = {},
      },
      productListBySearch = [],
      serviceOrderDetail,
      serviceProductList,
      orderApproval,
      otherCommissions,
      queryServiceOrderDetail,
      queryServiceProductList,
      queryOrderApproval,
      queryOtherCommissions,
      attachmentList,
      getAttachmentList
    } = this.props;
    const {
      isProductOrderDetailShow,
      orderNumber,
      serviceProductCode,
      serviceType,
      standardStartDate,
      standardEndDate,
    } = this.state;
    let {
      dict: {
        serviceOrderType,
      }
    } = this.context;
    const {
      curPageNum = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      totalRecordNum = 1,
    } = page;
    const pagination = {
      current: curPageNum,
      pageSize,
      total: totalRecordNum,
    };
    const isRender = list.length !== 0;

    return (
      <div className={styles.productOrderFlowWrap}>
        <div className={styles.header}>
          <div className={styles.filterItem}>
            <SingleFilter
              filterName="服务产品"
              filterId="serviceProduct"
              placeholder="请输入服务产品"
              showSearch
              needItemObj
              value={serviceProductCode}
              data={productListBySearch}
              onInputChange={this.handleSearchChanged}
              onChanged={this.handleServiceProductChanged}
              dropdownStyle={{
                maxHeight: 324,
                overflowY: 'auto',
                width: 252,
              }}
            />
          </div>
          <div className={styles.filterItem}>
            <SingleFilter
              filterName="类型"
              filterId="serviceType"
              data={serviceOrderType}
              value={serviceType}
              onChange={this.handleServiceTypeChanged}
            />
          </div>
          <div className={styles.filterItem}>
            <DateFilter
              filterName="创建日期"
              initialStartDate={DEFAULT_START_DATE}
              value={[standardStartDate,standardEndDate]}
              onChange={this.haneleDateChanged}
              disabledCurrentEnd={false}
            />
          </div>
        </div>
        <div className={styles.body}>
          <IfTableWrap isRender={isRender} text={NODATA_HINT}>
            <Table
              pagination={pagination}
              dataSource={list}
              columns={this.transformColumnsData(SERVICE_ORDER_FLOW_COLUMNS)}
              className={styles.table}
              rowClassName={styles.tableRow}
              onChange={this.handlePageChanged}
            />
          </IfTableWrap>
        </div>
        <ProductOrderDetail
          visible={isProductOrderDetailShow}
          orderNumber={orderNumber}
          onClose={this.handleDetailModalClose}
          serviceOrderDetail={serviceOrderDetail}
          serviceProductList={serviceProductList}
          orderApproval={orderApproval}
          otherCommissions={otherCommissions}
          queryServiceOrderDetail={queryServiceOrderDetail}
          queryServiceProductList={queryServiceProductList}
          queryOrderApproval={queryOrderApproval}
          queryOtherCommissions={queryOtherCommissions}
          attachmentList={attachmentList}
          getAttachmentList={getAttachmentList}
        />
      </div>
    );
  }
}
