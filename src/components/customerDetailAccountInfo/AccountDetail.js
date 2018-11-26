/*
 * @Author: sunweibin
 * @Date: 2018-10-23 17:18:23
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-31 17:39:47
 * @description 账户详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';

import {
  FUND_ACCOUNT_TABLE_COLUMNS,
  STOCK_ACCOUNT_TABLE_COLUMNS,
  ACCOUNT_CHANGE_TABLE_COLUMNS
} from './accountDetailConfig';
import { supplyEmptyRow } from './utils';
import logable from '../../decorators/logable';
import { number } from '../../helper';
import DateFilter from '../common/htFilter/dateFilter';
import { SingleFilterWithSearch } from 'lego-react-filter/src';
import styles from './accountDetail.less';
import Pagination from '../common/Pagination';
import IfTableWrap from '../common/IfTableWrap';

// 默认查询日期半年
const DEFAULT_START_DATE = moment().subtract(6, 'months');
const DEFAULT_END_DATE = moment().subtract(1, 'day');
// 接口请求查询日期的格式
const DATE_FORMATE_API = 'YYYY-MM-DD';
const NODATA_HINT = '暂无账户变动信息';
const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default class AccountDetail extends PureComponent {
  static propTypes = {
    // 资金账户
    fundAccount: PropTypes.array,
    // 证券账户
    stockAccount: PropTypes.array,
    // 经纪客户Id
    custId: PropTypes.string,
    // 业务类别
    busnTypeDict: PropTypes.object.isRequired,
    // 账户类型
    type: PropTypes.string.isRequired,
    // 查询账户变动
    queryAccountChange: PropTypes.func.isRequired,
    // 账户变动
    accountChangeRes: PropTypes.object.isRequired,
  }

  static defaultProps = {
    fundAccount: [],
    stockAccount: [],
  }

  constructor(props) {
    super(props);
    const defaultStartDateString = DEFAULT_START_DATE.format(DATE_FORMATE_API);
    const defaultEndDateString = DEFAULT_END_DATE.format(DATE_FORMATE_API);
    this.state = {
      startDate: defaultStartDateString, // 开始时间
      endDate: defaultEndDateString,// 结束时间
      bussinessType: '',// 选择的业务类别
      pageNum: 1,
    };
  }

  componentDidMount() {
    this.getAccountChange();
  };

  // 获取账户变动数据
  @autobind
  getAccountChange(params) {
    const {
      type,
      custId,
      queryAccountChange,
    } = this.props;
    const {
      bussinessType,
      startDate,
      endDate,
      pageNum,
    } = this.state;
    queryAccountChange ({
       custId,
       startDate,
       endDate,
       bussinessType,
       pageNum,
       pageSize: 10,
       accountType: _.lowerCase(type),
       ...params
    });
  }

  // 对表格中的number类型的数据进行处理
  @autobind
  getStockTableColumns(columns) {
    return _.map(columns, column => {
      const { dataIndex } = column;
      if (dataIndex === 'accountValue' || dataIndex === 'singleFeeIncome') {
        return {
          ...column,
          className: styles.moneyCell,
          render(text) {
            if (_.isUndefined(text) || _.isNull(text)) {
              return '';
            }
            return number.thousandFormat(text, false);
          },
        };
      }
      return column;
    });
  }

  // 选择起止日期
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '查询日期',
      value: '$args[0].value',
    },
  })
  handleDateChange(date) {
    const [startDate, endDate] = date.value;
    this.setState({
      startDate: startDate,
      endDate: endDate,
    });
    this.getAccountChange({
      startDate: startDate,
      endDate: endDate,
    });
  }

  // 选择业务类别
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '业务类别',
      value: '$args[0].value',
    },
  })
  handleFilterBussinessType(current) {
    this.setState({ bussinessType: current.value });
    this.getAccountChange({
      bussinessType: current.value,
    });
  }

  // 切换账户变动页码刷新表格数据
  @autobind
  @logable({ type: 'Click',
payload: { name: '切换账户变动页码',
value: '$args[0]'} })
  handlePageChange(pageNum) {
    this.setState( {pageNum});
    this.getAccountChange({
      pageNum,
    });
  }

   // 将接口返回的分页器数据转换成分页器组件的props
   @autobind
   getPage(page = {}) {
     return {
       pageSize: 10,
       current: page.pageNum || 1,
       total: page.totalCount || 0,
     };
   }

  render() {
    const {
      fundAccount,
      stockAccount,
      busnTypeDict,
      accountChangeRes: {
        list = EMPTY_LIST,
        page = EMPTY_OBJECT,
      },
    } = this.props;
    const {
      startDate,
      endDate,
      bussinessType,
    } = this.state;
    // 获取分页的页数
    const isRender = !_.isEmpty(list);
    const accountChangePage = this.getPage(page);
    // 补足空白行后的资金账户数据
    const newFundAccount = supplyEmptyRow(fundAccount);
    // 补足空白行后的证券账户
    const newStockAccount = supplyEmptyRow(stockAccount);
    // 修改证券账户表格的columns
    const stockAccountColumns = this.getStockTableColumns(STOCK_ACCOUNT_TABLE_COLUMNS);
    // 修改账户变动中表格columns
    const accountChangeColumns = this.getStockTableColumns(ACCOUNT_CHANGE_TABLE_COLUMNS);

    return (
      <div className={styles.accountDetailWrap}>
        <div className={styles.accountBlock}>
          <div className={styles.header}>
            <div className={styles.title}>资金账户</div>
          </div>
          <div className={styles.accountTable}>
            <Table
              pagination={false}
              className={styles.tableBorder}
              dataSource={newFundAccount}
              columns={FUND_ACCOUNT_TABLE_COLUMNS}
            />
          </div>
        </div>
        <div className={styles.accountBlock}>
          <div className={styles.header}>
            <div className={styles.title}>证券账户</div>
          </div>
          <div className={styles.accountTable}>
            <Table
              pagination={false}
              className={styles.tableBorder}
              dataSource={newStockAccount}
              columns={stockAccountColumns}
            />
          </div>
        </div>
        <div className={styles.accountBlock}>
          <div className={styles.header}>
            <div className={styles.title}>账户变动</div>
          </div>
          <div className={styles.filterTab}>
            <div className={styles.filterArea}>
              <DateFilter
                filterName="查询日期"
                initialStartDate={DEFAULT_START_DATE}
                value={[startDate, endDate]}
                onChange={this.handleDateChange}
                disabledCurrentEnd={false}
              />
            </div>
            <div className={styles.filterArea}>
              <SingleFilterWithSearch
                filterName="业务类别"
                filterId="bussinessType"
                value={bussinessType}
                data={busnTypeDict.list}
                placeholder="请输入业务类别"
                dropdownStyle={{
                  maxHeight: 324,
                  overflowY: 'auto',
                  width: 252,
                }}
                onChange={this.handleFilterBussinessType}
              />
            </div>
          </div>
          <IfTableWrap isRender={isRender} text={NODATA_HINT}>
            <div className={styles.accountTable}>
              <Table
                pagination={false}
                className={styles.tableBorder}
                dataSource={list}
                columns={accountChangeColumns}
              />
            </div>
            <Pagination
              {...accountChangePage}
              onChange={this.handlePageChange}
            />
          </IfTableWrap>
        </div>
      </div>
    );
  }
}
