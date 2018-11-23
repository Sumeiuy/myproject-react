/**
 * @Author: XuWenKang
 * @Description: 客户360-理财优惠券
 * @Date: 2018-11-06 16:17:28
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-23 14:21:19
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Filter from '../../../../components/customerDetailDiscount/Filter';
import DetailModal from '../../../../components/customerDetailDiscount/DetailModal';
import Table from '../../../../components/common/table';
import logable from '../../../../decorators/logable';
import { couponTitleList } from '../../../../components/customerDetailDiscount/config';

import styles from './home.less';
import telephoneNumberManage from '../../../../models/telephoneNumberManage';


const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};
const PAGE_SIZE = 10;


export default class DiscountCoupon extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 获取理财优惠券详情
    queryDiscountCouponDetail: PropTypes.func.isRequired,
    couponDetail: PropTypes.object.isRequired,
    // 获取理财优惠券列表
    queryDiscountCouponList: PropTypes.func.isRequired,
    couponListData: PropTypes.object.isRequired,
    // 获取理财优惠券使用状态列表
    queryCouponStatusList: PropTypes.func.isRequired,
    couponStatusList: PropTypes.array.isRequired,
    // 客户基本信息 从modals/customerDetail中取得
    customerBasicInfo: PropTypes.object.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      ticketId: '',
      status: '',
    };
  }

  componentDidMount() {
    const {
      location: {
        query: {
          custId,
        },
      },
      queryCouponStatusList,
    } = this.props;
    this.queryData(custId);
    queryCouponStatusList();
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        query: {
          custId: prevCustId,
        },
      },
    } = prevProps;
    const {
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    // url中custId发生变化时重新请求相关数据
    if (prevCustId !== custId) {
      this.queryData(custId);
    }
  }

  // 和custId相关的接口，初次调用和custId发生变化时调用，避免多次重复写，统一放到一个方法里
  @autobind
  queryData(custId) {
    const {
      queryDiscountCouponList,
    } = this.props;
    queryDiscountCouponList({
      custId,
      pageSize: PAGE_SIZE,
      pageNum: 1,
    });
  }

  @autobind
  handleFilterChange(data) {
    const {
      location: {
        query: {
          custId,
        },
      },
      queryDiscountCouponList,
    } = this.props;
    this.setState({
      [data.name]: data.value,
    }, () => {
      const {
        ticketId,
        status,
      } = this.state;
      queryDiscountCouponList({
        custId,
        pageSize: PAGE_SIZE,
        pageNum: 1,
        ticketId,
        status,
      });
    });
  }

  @autobind
  handleToggleModal(isShowModal) {
    this.setState({
      isShowModal,
    });
  }

  @autobind
  handleTableItemClick(dataItem) {
    const { ticketId } = dataItem;
    const {
      location: {
        query: {
          custId,
        },
      },
      queryDiscountCouponDetail,
    } = this.props;
    queryDiscountCouponDetail({
      ticketId,
      custId,
    }).then(() => {
      this.handleToggleModal(true);
    });
  }

  @autobind
  handlePaginationChange(pageNum) {
    const {
      ticketId,
      status,
    } = this.state;
    const {
      location: {
        query: {
          custId,
        },
      },
      queryDiscountCouponList,
    } = this.props;
    queryDiscountCouponList({
      custId,
      pageSize: PAGE_SIZE,
      pageNum,
      ticketId,
      status,
    });
  }

  @autobind
  getTitleList() {
    return couponTitleList.map(item => {
      if (item.dataIndex === 'ticketId') {
        return {
          ...item,
          render: (text, record) => (
            <span
              title={text}
              className={styles.ticketId}
              onClick={() => this.handleTableItemClick(record)}
            >{text}</span>
          )
        };
      }
      return {
        ...item,
        render: text => (
          <span title={text}>{text}</span>
        )
      };
    });
  }

  render() {
    const {
      isShowModal,
    } = this.state;
    const {
      couponStatusList,
      couponListData,
      couponDetail,
    } = this.props;
    const { list = EMPTY_ARRAY, page = EMPTY_OBJECT } = couponListData;
    const paginationData = {
      current: page.pageNum || 1,
      total: page.totalRecordNum || 0,
      pageSize: page.pageSize || 10,
      onChange: this.handlePaginationChange,
    };
    const pageinationProps = page.totalPageNum > 1 ? paginationData : false;
    return (
      <div className={styles.discountCouponBox}>
        <div className={styles.discountCouponContainer}>
          <Filter
            statusList={couponStatusList}
            onFilterChange={this.handleFilterChange}
          />
          <Table
            pagination={pageinationProps}
            dataSource={list}
            isNeedEmptyRow
            rowNumber={10}
            columns={this.getTitleList()}
            scroll={{ x: '1024px' }}
          />
        </div>
        <DetailModal
          data={couponDetail}
          visible={isShowModal}
          onToggleModal={this.handleToggleModal}
        />
      </div>
    );
  }
}
