/*
 * @Author: yuanhaojie
 * @Date: 2018-11-20 10:31:29
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-30 10:54:17
 * @Description: 服务订单流水
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import { SingleFilter } from 'lego-react-filter/src';
import logable from '../../decorators/logable';
import Tooltip from '../common/Tooltip';
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

const NODATA_HINT = '客户暂无服务订单信息';

export default class ProductOrderFlow extends PureComponent {
  static propsTypes = {
    productListBySearch: PropTypes.array.isRequired,
    serviceOrderFlow: PropTypes.object.isRequired,
    onProductOrderFlowChange: PropTypes.func.isRequired,
    serviceOrderDetail: PropTypes.object.isRequired,
    serviceProductList: PropTypes.array.isRequired,
    orderApproval: PropTypes.object.isRequired,
    queryServiceOrderDetail: PropTypes.func.isRequired,
    queryServiceProductList: PropTypes.func.isRequired,
    queryOrderApproval: PropTypes.func.isRequired,
    queryServiceProductBySearch: PropTypes.func.isRequired,
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
      createTimeFrom: '',
      createTimeTo: '',
    };
  }

  componentDidMount() {
    const {
      serviceProductCode,
      serviceType,
      createTimeFrom,
      createTimeTo,
    } = this.state;
    this.props.onProductOrderFlowChange({
      curPageNum: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      serviceProductCode,
      serviceType,
      createTimeFrom,
      createTimeTo,
    });
  }

  @autobind
  handleSearchChanged(value) {
    if (_.trim(value) !== '') {
      this.props.queryServiceProductBySearch({
        keyword: value,
      });
    }
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '服务订单流水服务产品选择',
      value: '$args[0].value',
    },
  })
  handleServiceProductChanged(e) {
    this.setState({
      serviceProductCode: e.value.prodId,
    }, this.handleProductOrderFlowChange);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '服务订单流水类型选择',
      value: '$args[0].value',
    },
  })
  handleServiceTypeChanged(e) {
    this.setState({
      serviceType: e.value,
    }, this.handleProductOrderFlowChange);
  }

  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '服务订单流水日期选择',
      value: '$args[0].value',
    },
  })
  haneleDateChanged(e) {
    this.setState({
      createTimeFrom: e.value[0],
      createTimeTo: e.value[1],
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
      createTimeFrom,
      createTimeTo,
    } = this.state;
    let payload = {
      serviceProductCode,
      type: serviceType,
      createTimeFrom,
      createTimeTo,
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
  @logable({ type: 'ViewItem', payload: { name: '点击服务订单编号', value: '$args[0]' } })
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
    return _.map(columns, (column) => {
      let newColumn;
      switch (column.dataIndex) {
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
          const renderFunc = (date) => {
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
        case 'executiveCondition':
          newColumn = {
            ...column,
            render: content => (
              <span>
                {
                  _.isEmpty(content)
                    ? '--'
                    : <Tooltip title={content}>{content}</Tooltip>
                }
              </span>
            ),
          };
          break;
        default:
          newColumn = {
            ...column,
            render: content => (
              <span>
                {_.isEmpty(content) ? '--' : content}
              </span>
            ),
          };
      }
      return newColumn;
    });
  }

  @autobind
  addNoLimitType(dict) {
    return _.union(
      [
        {
          key: '',
          value: '不限',
        },
      ],
      dict,
    );
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
      queryServiceOrderDetail,
      queryServiceProductList,
      queryOrderApproval,
      attachmentList,
      getAttachmentList
    } = this.props;
    const {
      isProductOrderDetailShow,
      orderNumber,
      serviceProductCode,
      serviceType,
      createTimeFrom,
      createTimeTo,
    } = this.state;
    const {
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
              dataMap={['prodId', 'prodName']}
              value={serviceProductCode}
              data={_.uniqBy(productListBySearch, 'prodId')}
              onInputChange={this.handleSearchChanged}
              onChange={this.handleServiceProductChanged}
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
              data={this.addNoLimitType(serviceOrderType)}
              value={serviceType}
              onChange={this.handleServiceTypeChanged}
            />
          </div>
          <div className={styles.filterItem}>
            <DateFilter
              filterName="创建日期"
              value={[createTimeFrom, createTimeTo]}
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
          queryServiceOrderDetail={queryServiceOrderDetail}
          queryServiceProductList={queryServiceProductList}
          queryOrderApproval={queryOrderApproval}
          attachmentList={attachmentList}
          getAttachmentList={getAttachmentList}
        />
      </div>
    );
  }
}
