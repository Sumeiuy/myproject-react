/*
 * @Author: sunweibin
 * @Date: 2018-12-06 17:29:40
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-11 11:57:15
 * @description 交易流水中的普通账户历史交易Tab组件
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Table } from 'antd';
import { SingleFilter, SingleFilterWithSearch } from 'lego-react-filter/src';
import TreeFilter from 'lego-tree-filter/src';

import { data, number } from '../../../helper';
import ToolTip from '../../common/Tooltip';
import Pagination from '../../common/Pagination';
import IfTableWrap from '../../common/IfTableWrap';
import logable from '../../../decorators/logable';
import DateFilter from '../../common/htFilter/dateFilter';
import {
  DEFAULT_START_DATE,
  DEFAULT_END_DATE,
  DATE_FORMATE_API,
  NORMAL_SCROLL,
  NORMAL_TRADE_COLUMNS,
} from './config';
import { COMMON_DROPDOWN_STYLE } from '../config';
import { getPage, displayEmpty } from './utils';

import styles from './tradeFlow.less';

export default class NormalTradeFlow extends PureComponent {
  static propTypes = {
    // 查询交易流水数据
    queryStandardTradeFlow: PropTypes.func.isRequired,
    // 查询产品代码下拉框选项列表
    queryProductCodeList: PropTypes.func.isRequired,
    // 业务类型下拉框选项
    busnTypeList: PropTypes.array.isRequired,
    // 全产品目录下拉框选项
    productCatalogTree: PropTypes.array.isRequired,
    // 交易流水数据
    tradeFlow: PropTypes.object.isRequired,
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
      productCode: ['', '', ''],
      // 全产品目录
      allProductMenu: '',
      // 产品代码下来框选项
      productCodeList: [],
    };

    // 获取普通账户交易流水表格的columns配置
    this.columns = this.getColumns(NORMAL_TRADE_COLUMNS);
  }

  componentDidMount() {
    // 初始化的时候，需要查询下普通账户下的默认数据
    this.queryStandardTradeFlow();
  }

  // 获取普通账户交易流水的Column配置
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

  // 修改产品下拉选项
  @autobind
  getOptionItemValue({ value: { prdtCode, prdtName, prdtSortCode } }) {
    return this.renderOption(prdtCode, prdtName, prdtSortCode);
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
          return displayEmpty(text, record);
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

  // 查询普通账户交易流水
  @autobind
  queryStandardTradeFlow(pageNum = 1) {
    const query = _.omit(this.state, ['productCodeList']);
    this.props.queryStandardTradeFlow({
      ...query,
      pageSize: 10,
      pageNum,
    });
  }

  // 普通账户选择起止日期
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '查询日期',
      value: '$args[0].value',
    },
  })
  handleDateRangeChange(date) {
    const [startDate, endDate] = date.value;
    this.setState({
      startDate,
      endDate,
    }, this.queryStandardTradeFlow);
  }

  // 普通账户选择业务类别
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '业务类别',
      value: '$args[0].value',
    },
  })
  handleBusnTypeSelect(current) {
    const { value } = current;
    this.setState({
      bussinessType: value,
    }, this.queryStandardTradeFlow);
  }

  // 普通账户选择产品代码
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
    }, this.queryStandardTradeFlow);
  }

  // 选择全产品目录
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '全产品目录树',
      value: '$args[0]',
    },
  })
  handleAllProductMenuSelect(current) {
    const allProductMenu = current.join(',');
    this.setState({
      allProductMenu,
    }, this.queryStandardTradeFlow);
  }

  // 切换普通账户页码
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '切换普通账户页码',
      value: '$args[0]'
    },
  })
  handlePageChange(pageNum) {
    this.queryStandardTradeFlow(pageNum);
  }

  // 根据关键字，查询产品代码
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
      productCatalogTree,
      tradeFlow: {
        list = [],
        page = {},
      },
    } = this.props;
    // 获取分页器属性
    const pageProps = getPage(page);
    // 补足普通账户流水数据
    const standardData = data.padEmptyDataForList(list);

    return (
      <div className={styles.tabPaneWrap}>
        <div className={`${styles.header} clearfix`}>
          <div className={styles.filterArea}>
            <DateFilter
              filterName="查询日期"
              disabledCurrentEnd={false}
              initialStartDate={DEFAULT_START_DATE}
              value={[startDate, endDate]}
              onChange={this.handleDateRangeChange}
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
              onChange={this.handleBusnTypeSelect}
            />
          </div>
          <div className={`${styles.filterArea} ${styles.filterSpecial}`}>
            <SingleFilter
              filterName="产品代码"
              filterId="productCode"
              placeholder="请输入产品代码或产品名称"
              dropdownStyle={COMMON_DROPDOWN_STYLE}
              dataMap={['prdtCode', 'prdtName']}
              needItemObj
              showSearch
              useLabelInValue
              data={productCodeList}
              value={productCode}
              onInputChange={this.handleProductCodeSearch}
              onChange={this.handleProductCodeSelect}
              getOptionItemValue={this.getOptionItemValue}
            />
          </div>
          <div className={`${styles.filterArea} ${styles.lastFilter}`}>
            <TreeFilter
              multiple
              showSearch
              treeCheckable
              filterName="全产品目录"
              filterId="allProductMenuTree"
              dropdownStyle={{ zIndex: 1000 }}
              dropdownClassName={styles.allProductMenuTree}
              treeData={productCatalogTree}
              onChange={this.handleFilterTree}
            />
          </div>
        </div>
        <IfTableWrap
          isRender={!_.isEmpty(list)}
          text="暂无普通账户交易历史信息"
          effect="detailAccountInfo/queryStandardTradeFlow"
        >
          <div className={styles.body}>
            <Table
              pagination={false}
              dataSource={standardData}
              columns={this.columns}
              className={styles.tradeFlowTable}
              scroll={NORMAL_SCROLL}
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
