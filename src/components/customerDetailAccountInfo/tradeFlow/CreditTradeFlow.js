/*
 * @Author: sunweibin
 * @Date: 2018-12-07 14:57:51
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-11 10:05:39
 * @description 交易流水信用账户历史记录
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Table } from 'antd';
import { SingleFilter, SingleFilterWithSearch } from 'lego-react-filter/src';

import logable from '../../../decorators/logable';
import { data, number } from '../../../helper';
import DateFilter from '../../common/htFilter/dateFilter';
import Pagination from '../../common/Pagination';
import IfTableWrap from '../../common/IfTableWrap';
import ToolTip from '../../common/Tooltip';
import { getPage, displayEmpty } from './utils';
import {
  DEFAULT_START_DATE,
  DEFAULT_END_DATE,
  DATE_FORMATE_API,
  CREDIT_TRADE_COLUMNS,
  CREDIT_SCROLL,
} from './config';
import { COMMON_DROPDOWN_STYLE } from '../config';

import styles from './tradeFlow.less';

export default class CreditTradeFlow extends PureComponent {
  static propTypes = {
    // 交易流水数据
    tradeFlow: PropTypes.object.isRequired,
    // 查询交易流水数据
    queryCreditTradeFlow: PropTypes.func.isRequired,
    // 查询产品代码下拉框选项列表
    queryProductCodeList: PropTypes.func.isRequired,
    // 业务类型下拉框选项
    busnTypeList: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);

    const startDate = DEFAULT_START_DATE.format(DATE_FORMATE_API);
    const endDate = DEFAULT_END_DATE.format(DATE_FORMATE_API);

    this.state = {
      // 查询的起始日期
      startDate,
      endDate,
      // 业务类型
      bussinessType: '',
      // 产品代码
      productCode: [],
      // 产品代码下拉框选项列表
      productCodeList: [],
    };

    // 获取信用账户交易流水表格的columns配置
    this.columns = this.getColumns(CREDIT_TRADE_COLUMNS);
  }

  componentDidMount() {
    // 初始化查询一把信用账户的数据
    this.queryCreditTradeFlow();
  }

  // 修改产品下拉选项
  @autobind
  getOptionItemValue({ value: { prdtCode, prdtName, prdtSortCode } }) {
    return this.renderOption(prdtCode, prdtName, prdtSortCode);
  }

  // 获取信用账户交易流水的Column配置
  @autobind
  getColumns(columns) {
    return _.map(columns, (column) => {
      const {
        isNumber,
        isAmount,
        dataIndex,
      } = column;
      if (isNumber || isAmount) {
        // 针对数量、数字金额进行特殊处理
        return this.updateMoneyColumn(column);
      }
      if (dataIndex === 'productName' || dataIndex === 'tradeChannel') {
        // 产品名称 | 交易渠道
        return this.updateWordColumn(column, 6);
      }
      if (dataIndex === 'productCode') {
        // 产品代码
        return this.updateWordColumn(column, 8);
      }
      if (dataIndex === 'bussinessType') {
        // 业务类别
        return this.updateWordColumn(column, 10);
      }
      return column;
    });
  }

  // 修改纯文本展示，超过length部分...并且悬浮显示全部信息
  @autobind
  updateWordColumn(column, length) {
    return {
      ...column,
      render(text, record) {
        if (_.isNull(text) || record.flag) {
          return displayEmpty(text, record);
        }
        const { isSubstr, value, origin } = data.dotdotdot(text, length);
        if (isSubstr) {
          return (
            <ToolTip title={origin}>{value}</ToolTip>
          );
        }
        return origin;
      },
    };
  }

  // 修改数据金额所在的column
  @autobind
  updateMoneyColumn(column) {
    const { isNumber, isAmount, ...restColumn } = column;
    return {
      ...restColumn,
      render(text, record) {
        if (_.isNull(text) || record.flag) {
          return this.displayEmpty(text, record);
        }
        // 比如可用数量，不需要保留两位小数
        if (isAmount) {
          return number.thousandFormat(text, false);
        }
        // 数字金额等需要保留2位小数
        if (isNumber) {
          return number.thousandFormat(number.toFixed(text), false);
        }
        return text;
      },
    };
  }

  // 查询信用账户交易流水历史
  @autobind
  queryCreditTradeFlow(pageNum = 1) {
    const query = _.omit(this.state, ['productCodeList']);
    this.props.queryCreditTradeFlow({
      ...query,
      pageSize: 10,
      pageNum,
    });
  }

  // 切换信用账户页码
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '切换信用账户页码',
      value: '$args[0]'
    },
  })
  handlePageChange(pageNum) {
    this.queryCreditTradeFlow(pageNum);
  }

  // 信用账户选择起止日期
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
      startDate,
      endDate,
    }, this.queryCreditTradeFlow);
  }

  // 信用账户选择业务类别
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '业务类别',
      value: '$args[0].value',
    },
  })
  handleBussinessTypeSelect(current) {
    this.setState({
      bussinessType: current.value
    }, this.queryCreditTradeFlow);
  }

  // 信用账户选择产品代码
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '产品代码',
      value: '$args[0].value.prdtCode',
    },
  })
  handleProductCodeSelect(current) {
    const { prdtCode, prdtName, prdtSortCode } = current.value;
    this.setState({
      productCode: [prdtCode, prdtName, prdtSortCode],
    }, this.queryCreditTradeFlow);
  }

  // 查询产品代码
  @autobind
  handleProductCodeSearch(value = '') {
    if (!_.isEmpty(value)) {
      this.props.queryProductCodeList({
        keyWord: value,
      }).then((productCodeList) => {
        this.setState({ productCodeList });
      });
    }
  }

  @autobind
  renderOption(prdtCode, prdtName, prdtSortCode) {
    const { productCode } = this.state;
    let displayName = `${prdtName}(${prdtSortCode})`;
    if (!prdtCode) {
      displayName = prdtName;
    }
    if (!prdtSortCode) {
      displayName = `${prdtName}(${productCode[2]})`;
    }
    return <span key={prdtCode} title={prdtName}>{displayName}</span>;
  }

  render() {
    const {
      startDate,
      endDate,
      bussinessType,
      productCode,
      productCodeList,
    } = this.state;
    const {
      busnTypeList,
      tradeFlow: {
        list = [],
        page = {},
      },
    } = this.props;
    // 获取分页器属性
    const pageProps = getPage(page);
    // 补足普通账户流水数据
    const creditData = data.padEmptyDataForList(list);

    return (
      <div className={styles.tabPaneWrap}>
        <div className={`${styles.header} clearfix`}>
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
              data={busnTypeList}
              placeholder="请输入业务类别"
              dropdownStyle={COMMON_DROPDOWN_STYLE}
              onChange={this.handleBussinessTypeSelect}
            />
          </div>
          <div className={styles.filterArea}>
            <SingleFilter
              filterName="产品代码"
              filterId="productCode"
              placeholder="请输入产品代码或产品名称"
              dropdownStyle={COMMON_DROPDOWN_STYLE}
              dataMap={['prdtCode', 'prdtName']}
              showSearch
              needItemObj
              useLabelInValue
              data={productCodeList}
              value={productCode}
              onInputChange={this.handleProductCodeSearch}
              onChange={this.handleProductCodeSelect}
              getOptionItemValue={this.getOptionItemValue}
            />
          </div>
        </div>
        <IfTableWrap
          isRender={!_.isEmpty(list)}
          text="暂无信用账户交易历史信息"
          effect="detailAccountInfo/queryCreditTradeFlow"
        >
          <div className={styles.body}>
            <Table
              pagination={false}
              dataSource={creditData}
              columns={this.columns}
              className={styles.tradeFlowTable}
              scroll={CREDIT_SCROLL}
            />
          </div>
          <Pagination
            {...pageProps}
            onChange={this.handlePageChange}
          />
        </IfTableWrap>
      </div>
    );
  }
}
