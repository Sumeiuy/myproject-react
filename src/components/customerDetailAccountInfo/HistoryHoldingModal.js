/*
 * @Author: sunweibin
 * @Date: 2018-11-05 13:31:51
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-09 10:31:08
 * @description 新版客户360详情的历史持仓的弹出层
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, Tabs, Radio, DatePicker, Table } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import cx from 'classnames';

import { data, number } from '../../helper';
import { jumpToProductDetailPage } from '../../utils/productCenter';
import logable, { logCommon, logPV } from '../../decorators/logable';
import Modal from '../common/biz/CommonModal';
import Pagination from '../common/Pagination';
import {
  STOCK_HISTORY_HOLDING_TABLE_SCROLL,
  STOCK_HISTORY_HOLDING_COLUMNS,
  PRODUCT_HISTORY_HOLDING_COLUMNS,
  OPTION_HISTORY_HOLDING_COLUMNS,
  OPTION_HISTORY_HOLDING_TABLE_SCROLL,
  PRODUCT_HISTORY_HOLDING_TABLE_SCROLL,
  HISTORY_HOLDING_TABS,
} from './config';

import styles from './historyHoldingModal.less';

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
// 默认查询日期T-1日
const DEFAULT_DATE = moment().subtract(1, 'days');
// 接口请求查询日期的格式
const DATE_FORMATE_API = 'YYYY-MM-DD';

export default class HistoryHoldingModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 关闭历史持仓弹出层
    onClose: PropTypes.func.isRequired,
    // 查询各个类型的历史持仓的api集合
    queryHistoryHolding: PropTypes.func.isRequired,
    // 证券持仓明细数据
    stockHistoryHolding: PropTypes.object.isRequired,
    // 产品持仓明细数据
    productHistoryHolding: PropTypes.object.isRequired,
    // 期权持仓明细数据
    optionHistoryHolding: PropTypes.object.isRequired,
  }

  static defaultProps = {
    holdingsData: {},
  }

  static contextTypes = {
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const defaultDeteString = DEFAULT_DATE.format(DATE_FORMATE_API);
    this.state = {
      // 当前激活的是哪个历史持仓Tab
      activeTabKey: 'stockHistoryHolding',
      // 账户类型Radio
      accountTypeRadio: 'all',
      // 证券账户的查询日期,初始日期是T-1日
      stockQueryDate: defaultDeteString,
      // 产品历史持仓的查询日期，初始日期T-1日
      productQueryDate: defaultDeteString,
      // 期权历史持仓的查询日期，初十日期T-1日
      optionQueryDate: defaultDeteString,
    };
  }

  componentDidMount() {
    // 初始化的时候，查询下3个历史持仓的明细数据,一遍切换Tab的时候，能够有数据显示
    this.queryStockHolding();
    this.queryProductHolding();
    this.queryOptionHolding();
  }

  // 判断证券历史持仓中的数据是否是股票类型
  // 而后端接口数据中只能根据产品类型code值的前缀是PA04时，才是股票
  @autobind
  judgeItemIsStockByTypeCode(typeCode) {
    return /^PA04/.test(typeCode);
  }

  // 查询证券历史持仓明细
  @autobind
  queryStockHolding(query = {}) {
    const { location: { query: { custId }} } = this.props;
    const { stockQueryDate } = this.state;
    // type 值用于到Home页面中区分调用哪个具体api接口
    this.props.queryHistoryHolding({
      type: 'stock',
      custId,
      pageSize: 10,
      accountType: 'all',
      pageNum: 1,
      date: stockQueryDate,
      ...query,
    });
  }

  // 查询产品历史持仓明细
  @autobind
  queryProductHolding(query) {
    const { location: { query: { custId } } } = this.props;
    const { productQueryDate } = this.state;
    // type 值用于到Home页面中区分调用哪个具体api接口
    this.props.queryHistoryHolding({
      type: 'product',
      custId,
      pageSize: 10,
      pageNum: 1,
      date: productQueryDate,
      ...query,
    });
  }

  // 查询期权历史持仓明细
  @autobind
  queryOptionHolding(query) {
    const { location: { query: { custId } } } = this.props;
    const { optionQueryDate } = this.state;
    // type 值用于到Home页面中区分调用哪个具体api接口
    this.props.queryHistoryHolding({
      type: 'option',
      custId,
      date: optionQueryDate,
      pageNum: 1,
      pageSize: 10,
      ...query,
    });
  }

  // 点击证券历史持仓明细中的名称或者代码跳转到策略中西下个股咨询>个股研报
  @autobind
  @logable({ type: 'Click', payload: { name: '跳转到个股咨询>个股研报', value: '$args[0].name'} })
  jumpToStockPage(record) {
    this.context.push({
      pathname: '/strategyCenter/stock',
      query: {
        keyword: record.code || '',
      },
    });
  }

  // 点击产品历史持仓明细中的产品名称、代码列跳转到产品详情
  @autobind
  @logable({ type: 'Click', payload: { name: '跳转到产品详情', value: '$args[0].name'} })
  hanleProductCellClick(record) {
    jumpToProductDetailPage({ type: record.firstTypeCode, code: record.code }, this.context.push);
  }

  // 修改数据金额所在的column
  @autobind
  updateMoneyColumn(column) {
    return {
      ...column,
      render(text, record) {
        if (_.isNull(text)) {
          return '-';
        }
        if (record.flag) {
          // 表示空数据
          return '';
        }
        return number.thousandFormat(text, false);
      },
    };
  }

  // 修改占比的单元格
  @autobind
  updateRateColumn(column) {
    return {
      ...column,
      render(text, record) {
        if (_.isNull(text)) {
          return '-';
        }
        if (record.flag) {
          // 表示空数据
          return '';
        }
        return number.convertRate(text);
      }
    };
  }

  // 需要给证券历史持仓下的信用账户，添加融字
  @autobind
  updateStockNameColumn(column) {
    return {
      ...column,
      render: (text, record) => {
        if (record.flag) {
          // 表示空数据
          return '';
        }
        // 因为证券历史持仓明细下点击名称，代码可以跳转到个股咨询页面，并且只有在股票的情况下才能跳转
        const isStock = this.judgeItemIsStockByTypeCode(record.typeCode || '');
        const nameCls = cx({
          [styles.clickAble]: isStock,
        });
        return (
          <div className={styles.nameCell}>
            <span className={nameCls}>{text}</span>
            {record.creditFlag ? (<span className={styles.rongIcon}>融</span>) : null }
          </div>
        );
      },
      onCell: (record) => {
        // 因为证券历史持仓明细下点击名称，代码可以跳转到个股咨询页面，并且只有在股票的情况下才能跳转
        const isStock = this.judgeItemIsStockByTypeCode(record.typeCode || '');
        if (isStock) {
          return {
            onClick: () => this.jumpToStockPage(record),
          };
        }
      }
    };
  }

  // 需要给证券历史持仓下的股票类型的产品可通过点击code列跳转到个股研报中，与名称列一致
  @autobind
  updateStockCodeColumn(column) {
    return {
      ...column,
      render: (text, record) => {
        if (record.flag) {
          // 表示空数据
          return '';
        }
        // 因为证券历史持仓明细下点击名称，代码可以跳转到个股咨询页面，并且只有在股票的情况下才能跳转
        const isStock = this.judgeItemIsStockByTypeCode(record.typeCode || '');
        const nameCls = cx({
          [styles.clickAble]: isStock,
        });
        return (<span className={nameCls}>{text}</span>);
      },
      onCell: (record) => {
        // 因为证券历史持仓明细下点击名称，代码可以跳转到个股咨询页面，并且只有在股票的情况下才能跳转
        const isStock = this.judgeItemIsStockByTypeCode(record.typeCode || '');
        if (isStock) {
          return {
            onClick: () => this.jumpToStockPage(record),
          };
        }
      }
    };
  }

  // 产品历史持仓项点击名称和代码列，需要跳转到产品详情页面中去
  @autobind
  updateProductNameAndCodeColumn(column) {
    return {
      ...column,
      render: (text, record) => {
        if (record.flag) {
          // 表示空数据
          return '';
        }
        return (<span className={styles.clickAble}>{text}</span>);
      },
      onCell: (record) => {
        return {
          onClick: () => this.hanleProductCellClick(record),
        };
      },
    };
  }

  // 修改证券历史持仓明细表格中各个column的显示
  @autobind
  getStockTableColumns(columns) {
    return _.map(columns, column => {
      const { dataIndex } = column;
      if (dataIndex === 'costPrice' || dataIndex === 'marketPrice' || dataIndex === 'profit') {
        // 针对数字金额类的column添加数字处理render
        return this.updateMoneyColumn(column);
      }
      if (dataIndex === 'holdPercent') {
        // 针对比率类型column添加百分比处理render
        return this.updateRateColumn(column);
      }
      if (dataIndex === 'name') {
        // 添加 融 图标，如果是信用账户
        return this.updateStockNameColumn(column);
      }
      if (dataIndex === 'code') {
        // 如果是股票的名称或者代码,需要能够跳转到个股咨询页面
        return this.updateStockCodeColumn(column);
      }
      return column;
    });
  }

  // 修改产品历史持仓的Table的column
  @autobind
  getProductTableColumns(columns) {
    return _.map(columns, column => {
      const { dataIndex } = column;
      if (dataIndex === 'costPrice' || dataIndex === 'marketValue' || dataIndex === 'totalProfit') {
        // 针对数字金额类的column添加数字处理render
        return this.updateMoneyColumn(column);
      }
      if (dataIndex === 'holdPercent' || dataIndex === 'yearRate') {
        // 针对比率类型column添加百分比处理render
        return this.updateRateColumn(column);
      }
      if (dataIndex === 'name' || dataIndex === 'code') {
        // 产品历史持仓点击名称或者代码列的时候，需要跳转到产品中心的产品详情页面
        return this.updateProductNameAndCodeColumn(column);
      }
      return column;
    });
  }

  // 修改期权历史持仓的Table的column
  @autobind
  getOptionTableColumns(columns) {
    return _.map(columns, column => {
      const { dataIndex } = column;
      // 针对数字金额类的column添加数字处理render
      if (dataIndex === 'costPrice' || dataIndex === 'newestPrice' || dataIndex === 'marketValue' || dataIndex === 'profit') {
        return this.updateMoneyColumn(column);
      }
      if (dataIndex === 'holdPercent') {
        // 针对比率类型column添加百分比处理render
        return this.updateRateColumn(column);
      }
      return column;
    });
  }

  // 将接口返回的分页器数据转换成分页器组件的props
  @autobind
  getPage(page = {}) {
    // 如果不足1页的数据，不显示分页器
    return {
      pageSize: 10,
      current: page.pageNum || 1,
      total: page.totalCount || 0,
      hideOnSinglePage: _.isUndefined(page.totalPage) || page.totalPage === 1
    };
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '关闭' } })
  handleModalClose() {
    this.props.onClose();
  }

  // 切换Tab时，因为在初始化的时候已经查询了3个历史持仓的数据，所以在Tab切换的时候就不在需要查询持仓数据
  // 只有变更查询日期、页码等参数再进行查询
  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey });
    // 需要记录切换日志
    logCommon({
      type: 'Click',
      payload: {
        name: '历史持仓Tab切换',
        value: HISTORY_HOLDING_TABS[activeTabKey],
      },
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '账户类型', value: '$args[0].target.value' } })
  handleAccountTypeRadioChange(e) {
    const { value } = e.target;
    const { stockQueryDate } = this.state;
    this.setState({ accountTypeRadio: value });
    // 因为切换账户类型的时候，需要从第一页开始查询
    this.queryStockHolding({
      pageNum: 1,
      accountType: value,
      date: stockQueryDate,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '证券历史持仓查询日期', value: '$args[1]'} })
  handleStockDateChange(date) {
    const stockQueryDate = date.format(DATE_FORMATE_API);
    // 切换证券历史持仓的查询日期,
    const { accountTypeRadio } = this.state;
    this.setState({ stockQueryDate });
    // 需要查询第一页的数据
    this.queryStockHolding({
      pageNum: 1,
      date: stockQueryDate,
      accountType: accountTypeRadio,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '产品历史持仓查询日期', value: '$args[1]'} })
  handleProductDateChange(date) {
    const productQueryDate = date.format(DATE_FORMATE_API);
    // 切换产品查询日期
    this.setState({ productQueryDate });
    // 需要查询第一页数据
    this.queryProductHolding({
      pageNum: 1,
      date: productQueryDate,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '期权历史持仓查询日期', value: '$args[1]'} })
  handleOptionDateChange(date) {
    const optionQueryDate = date.format(DATE_FORMATE_API);
    this.setState({ optionQueryDate });
    // 需要查询第一页的数据
    this.queryOptionHolding({
      pageNum: 1,
      date: optionQueryDate,
    });
  }

  // 切换证券历史持仓页码
  @autobind
  @logable({ type: 'Click', payload: { name: '切换证券历史持仓页码', value: '$args[0]'} })
  handleStockPageChange(pageNum) {
    const { accountTypeRadio, stockQueryDate } = this.state;
    this.queryStockHolding({
      pageNum,
      accountType: accountTypeRadio,
      date: stockQueryDate,
    });
  }

  // 切换产品历史持仓页码数据
  @autobind
  @logable({ type: 'Click', payload: { name: '切换产品历史持仓页码', value: '$args[0]'} })
  handleProductPageChange(pageNum) {
    const { productQueryDate } = this.state;
    this.queryProductHolding({
      pageNum,
      date: productQueryDate,
    });
  }

  // 切换期权历史持仓页码数据
  @autobind
  @logable({ type: 'Click', payload: { name: '切换期权历史持仓页码', value: '$args[0]'} })
  handleOptionPageChange(pageNum) {
    const { optionQueryDate } = this.state;
    this.queryProductHolding({
      pageNum,
      date: optionQueryDate,
    });
  }

  render() {
    const { activeTabKey, accountTypeRadio } = this.state;
    const { stockHistoryHolding, productHistoryHolding, optionHistoryHolding } = this.props;
    // 补足证券历史持仓数据
    const stockData = data.padEmptyDataForList(stockHistoryHolding.list);
    // 修改证券历史持仓Table 的 columns
    const stockColumns = this.getStockTableColumns(STOCK_HISTORY_HOLDING_COLUMNS);
    // 获取证券历史持仓表格的分页器信息
    const stockPage = this.getPage(stockHistoryHolding.page);
    // 补足产品历史持仓数据
    const productData = data.padEmptyDataForList(productHistoryHolding.list);
    // 修改产品持仓Table的 columns
    const productColumns = this.getProductTableColumns(PRODUCT_HISTORY_HOLDING_COLUMNS);
    // 获取产品历史持仓的分页器数据
    const productPage = this.getPage(productHistoryHolding.page);
    // 补足期权历史持仓数据
    const optionData = data.padEmptyDataForList(optionHistoryHolding.list);
    // 修改期权历史持仓的columns
    const optionColumns = this.getOptionTableColumns(OPTION_HISTORY_HOLDING_COLUMNS);
    // 获取期权历史持仓的分页器数据
    const optionPage = this.getPage(optionHistoryHolding.page);
    // 弹出层的自定义关闭按钮
    const closeBtn = [(
      <Button onClick={this.handleModalClose}>关闭</Button>
    )];

    return (
      <Modal
        visible
        size="large"
        modalKey="cust360DetailHistoryHoldingModal"
        closeModal={this.handleModalClose}
        title="历史持仓"
        selfBtnGroup={closeBtn}
      >
        <div className={styles.historyHoldingWrap}>
          <Tabs onChange={this.handleTabChange} activeKey={activeTabKey}>
            <TabPane tab="证券持仓明细" key="stockHistoryHolding">
              <div className={styles.tabPaneWrap}>
                <div className={styles.header}>
                  <div className={styles.accountTypeArea}>
                    <span className={styles.label}>账户类型:</span>
                    <RadioGroup onChange={this.handleAccountTypeRadioChange} value={accountTypeRadio}>
                      <Radio className={styles.accountTypeRadio} value="all">全部</Radio>
                      <Radio className={styles.accountTypeRadio} value="normal">普通</Radio>
                      <Radio className={styles.accountTypeRadio} value="credit">信用</Radio>
                    </RadioGroup>
                  </div>
                  <div className={styles.dateArea}>
                    <span className={styles.label}>查询日期:</span>
                    <DatePicker
                      onChange={this.handleStockDateChange}
                      defaultValue={DEFAULT_DATE}
                    />
                  </div>
                </div>
                <div className={styles.body}>
                  <Table
                    pagination={false}
                    dataSource={stockData}
                    columns={stockColumns}
                    className={styles.historyHoldingTable}
                    scroll={STOCK_HISTORY_HOLDING_TABLE_SCROLL}
                  />
                </div>
                <Pagination
                  {...stockPage}
                  onChange={this.handleStockPageChange}
                />
              </div>
            </TabPane>
            <TabPane tab="产品持仓明细" key="productHistoryHolding">
              <div className={styles.tabPaneWrap}>
                <div className={styles.header}>
                  <div className={styles.dateArea}>
                    <span className={styles.label}>查询日期:</span>
                    <DatePicker
                      onChange={this.handleProductDateChange}
                      defaultValue={DEFAULT_DATE}
                    />
                  </div>
                </div>
                <div className={styles.body}>
                  <Table
                    pagination={false}
                    dataSource={productData}
                    columns={productColumns}
                    className={styles.historyHoldingTable}
                    scroll={PRODUCT_HISTORY_HOLDING_TABLE_SCROLL}
                  />
                </div>
                <Pagination
                  {...productPage}
                  onChange={this.handleProductPageChange}
                />
              </div>
            </TabPane>
            <TabPane tab="期权持仓明细" key="optionHistoryHolding">
              <div className={styles.tabPaneWrap}>
                <div className={styles.header}>
                  <div className={styles.dateArea}>
                    <span className={styles.label}>查询日期:</span>
                    <DatePicker
                      onChange={this.handleOptionDateChange}
                      defaultValue={DEFAULT_DATE}
                    />
                  </div>
                </div>
                <div className={styles.body}>
                  <Table
                    pagination={false}
                    dataSource={optionData}
                    columns={optionColumns}
                    className={styles.historyHoldingTable}
                    scroll={OPTION_HISTORY_HOLDING_TABLE_SCROLL}
                  />
                </div>
                <Pagination
                  {...optionPage}
                  onChange={this.handleOptionPageChange}
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}
