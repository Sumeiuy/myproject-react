/*
 * @Description: 积分兑换产品历史查询报表
 * @Author: zhangjunli
 * @Date: 2018-4-10 13:47:16
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { Form, Input, Button, Table } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import DateRangePicker from '../../components/common/dateRangePicker';
import Pagination from '../../components/common/Pagination';
import withRouter from '../../decorators/withRouter';
import styles from './home.less';

const FormItem = Form.Item;
const create = Form.create;
const dateFormat = 'YYYY/MM/DD';
const defaultParam = {
  pageNum: 1,
  productCode: '',
  brokerNumber: '',
  startTime: '',
  endTime: '',
};

function formatString(str) {
  return _.isEmpty(str) ? '--' : str;
}

function columns() {
  return [{
    title: '经纪客户号',
    key: 'brokerNumber',
    dataIndex: 'brokerNumber',
    width: '10%',
    render: item => (<span>{formatString(item)}</span>),
  }, {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    width: '7%',
    render: item => (<span>{formatString(item)}</span>),
  }, {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '10%',
    render: item => (
      <div
        title={formatString(item)}
      >{formatString(item)}</div>
    ),
  }, {
    title: '兑换数量',
    dataIndex: 'exchangeNum',
    key: 'exchangeNum',
    width: '6%',
    render: item => (<span>{formatString(item)}</span>),
  }, {
    title: '兑换日期',
    dataIndex: 'exchangeDate',
    key: 'exchangeDate',
    width: '8%',
    render: item => (<span>{moment(item).format('YYYY-MM-DD') || '--'}</span>),
  }, {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: '8%',
    render: item => (<span>{formatString(item)}</span>),
  }, {
    title: '服务营业部',
    dataIndex: 'orgName',
    key: 'orgName',
    width: '12%',
    render: item => (
      <div
        title={formatString(item)}
      >
        {formatString(item)}
      </div>
    ),
  }];
}

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  exchangeData: state.pointsExchange.exchangeData,
});

const mapDispatchToProps = {
  getExchangeList: fetchDataFunction(true, 'pointsExchange/getExchangeHistory'),
};

@create()
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Home extends Component {
  static propTypes = {
    exchangeData: PropTypes.object,
    form: PropTypes.object.isRequired,
    getExchangeList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    exchangeData: {},
  }

  constructor(props) {
    super(props);
    this.state = defaultParam;
  }

  // 发送请求
  componentDidMount() {
    this.props.getExchangeList(defaultParam);
  }

  // 只能选择最近3个月的
  @autobind
  setDisableRange(date) {
    return (date <= moment().subtract(3, 'months')
   || date > moment()) && date.format('YY-MM-DD') !== moment().format('YY-MM-DD');
  }

  // DateRangePicker 组件，不支持value属性，故不能用 Form 组件的 getFieldDecorator，需要单独处理选中和清除事件
  @autobind
  handleCreateDateChange(date) {
    const { startDate, endDate } = date;
    const startTime = _.isEmpty(startDate) ? '' : startDate.format(dateFormat);
    const endTime = _.isEmpty(endDate) ? '' : endDate.format(dateFormat);
    this.setState({
      startTime,
      endTime,
    });
  }

  @autobind
  handlePageChange(page) {
    const { getExchangeList } = this.props;
    this.setState(
      { pageNum: page },
      () => {
        getExchangeList({
          ...this.state,
          pageNum: page,
        });
      },
    );
  }

  @autobind
  handleSearch(e) {
    e.preventDefault();
    const { getExchangeList } = this.props;
    const { startTime, endTime } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { productCode = '', brokerNumber = '' } = values;
        const fieldValue = {
          productCode: _.isEmpty(productCode) ? '' : _.trim(productCode),
          brokerNumber: _.isEmpty(brokerNumber) ? '' : _.trim(brokerNumber),
          pageNum: 1,
          startTime,
          endTime,
        };
        this.setState(
          { productCode, brokerNumber, pageNum: 1 },
          () => {
            getExchangeList({ ...fieldValue });
          },
        );
      }
    });
  }

  @autobind
  drpWraperRef(input) {
    this.datePickRef = input;
  }

  @autobind
  handleReset() {
    this.props.form.resetFields();
    this.datePickRef.clearAllDate();
    this.setState({ ...defaultParam });
    // 发送请求，重置表格数据
    this.props.getExchangeList(defaultParam);
  }

  render() {
    const { exchangeList, page = {} } = this.props.exchangeData || {};
    const { totalRecordNum = 1 } = page;
    const { getFieldDecorator } = this.props.form;
    const { pageNum = 1 } = this.state;
    const paganationOption = {
      current: pageNum,
      pageSize: 10,
      total: _.toNumber(totalRecordNum) || 1,
      onChange: this.handlePageChange,
    };
    return (
      <div className={styles.exchangeContainer}>
        <div className={styles.exchangeContent}>
          <div className={styles.headContainer}>
            <div className={styles.headLine}>积分兑换产品历史查询报表</div>
          </div>
          <Form className={styles.form} layout="inline" onSubmit={this.handleSearch}>
            <div className={styles.filterBox}>
              <div className={styles.filter}>
                <FormItem label={'产品代码'}>
                  {getFieldDecorator('productCode')(<Input className={styles.input} />)}
                </FormItem>
              </div>
              <div className={styles.filter}>
                <FormItem label={'经纪客户号'}>
                  {getFieldDecorator('brokerNumber')(<Input className={styles.input} />)}
                </FormItem>
              </div>
              <div className={styles.filter}>
                <FormItem label="兑换时间">
                  <DateRangePicker
                    ref={this.drpWraperRef}
                    disabledRange={this.setDisableRange}
                    onChange={this.handleCreateDateChange}
                  />
                </FormItem>
              </div>
              <div className={styles.buttonBox}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.btn}
                >查询</Button>
                <Button
                  onClick={this.handleReset}
                  className={styles.btn}
                >重置</Button>
              </div>
            </div>
          </Form>
          <Table
            rowKey={'rowId'}
            columns={columns()}
            dataSource={exchangeList}
            pagination={false}
            className={styles.pointsExchangeTable}
          />
          <Pagination {...paganationOption} />
        </div>
      </div>
    );
  }
}

