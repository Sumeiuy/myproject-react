/*
 * @Author: liqianwen
 * @Date: 2018-11-07 13:31:51
 * @Last Modified by: liqianwen
 * @Last Modified time: 2018-11-15 13:04:50
 * @description 新版客户360详情的交易流水的弹出层
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, Tabs, Table } from 'antd';
import moment from 'moment';
import _ from 'lodash';

import { data, number } from '../../helper';
import logable, { logCommon } from '../../decorators/logable';
import Modal from '../common/biz/CommonModal';
import DateFilter from '../common/htFilter/dateFilter';
import { SingleFilter, SingleFilterWithSearch } from 'lego-react-filter/src';
import TreeFilter from 'lego-tree-filter/src';
import Pagination from '../common/Pagination';
import {
  STANDARD_TRADE_FLOW_COLUMNS,
  CREDIT_TRADE_FLOW_COLUMNS,
  OPTION_TRADE_FLOW_COLUMNS,
  STANDARD_TRADE_FLOW_TABLE_SCROLL,
  CREDIT_TRADE_FLOW_TABLE_SCROLL,
  OPTION_TRADE_FLOW_TABLE_SCROLL,
  TRADE_FLOW_TABS,
} from './config';

import styles from './tradeFlowModal.less';

const TabPane = Tabs.TabPane;

// 默认查询日期半年
const DEFAULT_START_DATE = moment().subtract(6, 'months');
const DEFAULT_END_DATE = moment().subtract(1, 'day');
// 接口请求查询日期的格式
const DATE_FORMATE_API = 'YYYY-MM-DD';

export default class TradeFlowModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 关闭弹出层
    onClose: PropTypes.func.isRequired,
    // 查询交易流水的api集合函数
    querytradeFlow: PropTypes.func.isRequired,
    // 业务类别
    busnTypeDict: PropTypes.object.isRequired,
    // 产品代码
    finProductList: PropTypes.object.isRequired,
    // 全产品目录
    productCatalogTree: PropTypes.object.isRequired,
    // 普通账户交易流水
    standardTradeFlowRes: PropTypes.object.isRequired,
    // 信用账户交易流水
    creditTradeFlowRes: PropTypes.object.isRequired,
    // 期权账户交易流水
    optionTradeFlowRes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const defaultStartDateString = DEFAULT_START_DATE.format(DATE_FORMATE_API);
    const defaultEndDateString = DEFAULT_END_DATE.format(DATE_FORMATE_API);
    this.state = {
      // 当前激活的交易流水
      activeTabKey: 'standardAccountTrade',
      standardStartDate: defaultStartDateString,
      standardEndDate: defaultEndDateString,
      creditStartDate: defaultStartDateString,
      creditEndDate: defaultEndDateString,
      optionStartDate: defaultStartDateString,
      optionEndDate: defaultEndDateString,
      // 普通账户
      currentStandBusnTypeValue: '', // 选择的业务类别
      currentStandPrdtValue: '',  // 选择的产品代码
      currentAllPrdtMenuValue: '',  // 选择的产品代码,
      // 信用账户
      currentCreditBusnTypeValue: '', // 选择的业务类别
      currentCreditPrdtValue: '',  // 选择的产品代码
      // 期权账户
      currentOptionPrdtValue: '',  // 选择的产品代码
    };
  }

  componentDidMount() {
    this.queryBusnTypeDict({ accountType: 'normal' });
    this.queryProductCatalogTree();
    this.queryStandardTradeFlow();
  }

  // 查询业务类型
  @autobind
  queryBusnTypeDict(params = {}) {
    const { location: { query: { custId }} } = this.props;
    // type 值用于到Home页面中区分调用哪个具体api接口
      this.props.querytradeFlow({
        type: 'busnType',
        custId,
        queryType: 'tradeFlow',
        ...params
      });
  }

  // 查询产品代码
  @autobind
  queryFinProductList(value='') {
    const { location: { query: { custId } } } = this.props;
    if (!_.isEmpty(value)) {
      this.props.querytradeFlow({
        type: 'finProduct',
        custId,
        keyWord: value,
      });
    }
  }

  // 查询全产品目录树
  @autobind
  queryProductCatalogTree() {
    const { location: { query: { custId } } } = this.props;
    // type 值用于到Home页面中区分调用哪个具体api接口
    this.props.querytradeFlow({
      type: 'productTree',
      custId,
    });
  }

  // 查询普通账户交易流水
  @autobind
  queryStandardTradeFlow(params) {
    const { location: { query: { custId } } } = this.props;
    const {
      standardStartDate,
      standardEndDate,
      currentStandBusnTypeValue,
      currentStandPrdtValue,
      currentAllPrdtMenuValue
    } = this.state;
    // type 值用于到Home页面中区分调用哪个具体api接口
    this.props.querytradeFlow({
      type: 'standard',
      custId,
      startDate: standardStartDate,
      endDate: standardEndDate,
      bussinessType: currentStandBusnTypeValue,
      productCode: currentStandPrdtValue,
      allProductMenu: currentAllPrdtMenuValue,
      pageSize: 10,
      pageNum: 1,
      ...params,
    });
  }

  // 查询信用账户交易流水
  @autobind
  queryCreditTradeFlow(params) {
    const { location: { query: { custId } } } = this.props;
    const {
      creditStartDate,
      creditEndDate,
      currentCreditPrdtValue,
      currentCreditBusnTypeValue,
    } = this.state;
    // type 值用于到Home页面中区分调用哪个具体api接口
    this.props.querytradeFlow({
      type: 'credit',
      custId,
      startDate: creditStartDate,
      endDate: creditEndDate,
      bussinessType: currentCreditBusnTypeValue,
      productCode: currentCreditPrdtValue,
      pageNum: 1,
      pageSize: 10,
      ...params,
    });
  }

  // 查询期权账户交易流水
  @autobind
  queryOptionTradeFlow(params) {
    const { location: { query: { custId } } } = this.props;
    const {
      optionStartDate,
      optionEndDate,
      currentOptionPrdtValue,
    } = this.state;
    // type 值用于到Home页面中区分调用哪个具体api接口
    this.props.querytradeFlow({
      type: 'option',
      custId,
      startDate: optionStartDate,
      endDate: optionEndDate,
      productCode: currentOptionPrdtValue,
      pageNum: 1,
      pageSize: 10,
      ...params,
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

  @autobind
  @logable({ type: 'Click', payload: { name: '关闭' } })
  handleModalClose() {
    this.props.onClose();
  }

  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey });
    // 需要记录切换日志
    logCommon({
      type: 'Click',
      payload: {
        name: '交易流水Tab切换',
        value: TRADE_FLOW_TABS[activeTabKey],
      },
    });
    // 切换tab页时调用方法刷数据
    if (activeTabKey === 'standardAccountTrade') {
      this.queryBusnTypeDict({ accountType: 'normal' });
      this.queryStandardTradeFlow();
    } else if (activeTabKey === 'creditAccountTrade') {
      this.queryBusnTypeDict({ accountType: 'credit' });
      this.queryCreditTradeFlow();
    } else {
      this.queryOptionTradeFlow();
    }
  }

  // 切换普通账户页码
  @autobind
  @logable({ type: 'Click', payload: { name: '切换普通账户页码', value: '$args[0]'} })
  handleStandardPageChange(pageNum) {
    this.queryStandardTradeFlow({
      pageNum,
    });
  }

  // 切换信用账户页码
  @autobind
  @logable({ type: 'Click', payload: { name: '切换信用账户页码', value: '$args[0]'} })
  handleCreditPageChange(pageNum) {
    this.queryCreditTradeFlow({
      pageNum,
    });
  }

  // 切换期权账户页码
  @autobind
  @logable({ type: 'Click', payload: { name: '切换期权账户页码', value: '$args[0]'} })
  handleOptionPageChange(pageNum) {
    this.queryOptionTradeFlow({
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
  handleChangeStandardDate(date) {
    this.setState({
      standardStartDate: date.value[0],
      standardEndDate: date.value[1],
    });
    this.queryStandardTradeFlow({
      startDate: date.value[0],
      endDate: date.value[1],
    });
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
  handleChangeCreditDate(date) {
    this.setState({
      creditStartDate: date.value[0],
      creditEndDate: date.value[1],
    });
    this.queryCreditTradeFlow({
      startDate: date.value[0],
      endDate: date.value[1],
    });
  }

  // 期权账户选择起止日期
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '查询日期',
      value: '$args[0].value',
    },
  })
  handleChangeOptionDate(date) {
    this.setState({
      optionStartDate: date.value[0],
      optionEndDate: date.value[1],
    });
    this.queryOptionTradeFlow({
      startDate: date.value[0],
      endDate: date.value[1],
    });
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
  handleFilterStandardBussinessType(current) {
    this.setState({ currentStandBusnTypeValue: current.value });
      this.queryStandardTradeFlow({
        bussinessType: current.value,
      });
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
  handleFilterCreditBussinessType(current) {
    this.setState({ currentCreditBusnTypeValue: current.value });
      this.queryCreditTradeFlow({
        bussinessType: current.value,
      });
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
  handleFilterStandardPrdt(current) {
    this.setState({ currentStandPrdtValue: current.value.prdtCode });
    this.queryStandardTradeFlow({
      productCode: current.value.prdtCode,
    });
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
  handleFilterCreditPrdt(current) {
    this.setState({ currentCreditPrdtValue: current.value.prdtCode });
    this.queryCreditTradeFlow({
      productCode: current.value.prdtCode,
    });
  }

  // 期权账户选择产品代码
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '产品代码',
      value: '$args[0].value.prdtCode',
    },
  })
  handleFilterOptionPrdt(current) {
    this.setState({ currentOptionPrdtValue: current.value.prdtCode });
    this.queryOptionTradeFlow({
      productCode: current.value.prdtCode,
    });
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
  handleFilterTree(current) {
    this.setState({ currentAllPrdtMenuValue: current.join(',') });
    this.queryStandardTradeFlow({
      allProductMenu: current.join(','),
    });
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
        return number.thousandFormat(number.toFixed(text), false);
      },
    };
  }

  // 修改数量所在的column
  @autobind
  updateNumberColumn(column) {
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

  // 修改普通账户部分列的显示
  @autobind
  getStandardTradeColumns(columns) {
    return _.map(columns, column => {
      const { dataIndex } = column;
      if (dataIndex === 'dealPrice'
        || dataIndex === 'dealMoney'
        || dataIndex === 'commission'
        || dataIndex === 'realCommission'
        || dataIndex === 'stampTax'
        || dataIndex === 'riskMoney' ) {
        // 针对数字金额类的column添加数字处理render
        return this.updateMoneyColumn(column);
      }
      if (dataIndex === 'dealNumber') {
        // 针对数量类的column添加数字处理render
        return this.updateNumberColumn(column);
      }
      return column;
    });
  }
  // 修改信用账户部分列的显示
  @autobind
  getCreditTradeColumns(columns) {
    return _.map(columns, column => {
      const { dataIndex } = column;
      if (dataIndex === 'dealPrice'
        || dataIndex === 'dealMoney'
        || dataIndex === 'commission'
        || dataIndex === 'realCommission'
        || dataIndex === 'stampTax' ) {
        // 针对数字金额类的column添加数字处理render
        return this.updateMoneyColumn(column);
      }
      if (dataIndex === 'dealNumber') {
        // 针对数量类的column添加数字处理render
        return this.updateNumberColumn(column);
      }
      return column;
    });
  }
  // 修改期权账户部分列的显示
  @autobind
  getOptionTradeColumns(columns) {
    return _.map(columns, column => {
      const { dataIndex } = column;
      if (dataIndex === 'dealPrice'
        || dataIndex === 'dealMoney'
        || dataIndex === 'commission'
        || dataIndex === 'realCommission'
        || dataIndex === 'oneLevelBrokerage'
        || dataIndex === 'otherCost' ) {
        // 针对数字金额类的column添加数字处理render
        return this.updateMoneyColumn(column);
      }
      if (dataIndex === 'dealNumber') {
        // 针对数量类的column添加数字处理render
        return this.updateNumberColumn(column);
      }
      return column;
    });
  }

  render() {
    const {
      activeTabKey,
      standardStartDate,
      standardEndDate,
      currentStandBusnTypeValue,
      currentStandPrdtValue,
      creditStartDate,
      creditEndDate,
      currentCreditBusnTypeValue,
      currentCreditPrdtValue,
      optionStartDate,
      optionEndDate,
      currentOptionPrdtValue,
    } = this.state;
    const {
      busnTypeDict,
      finProductList,
      productCatalogTree,
      standardTradeFlowRes,
      creditTradeFlowRes,
      optionTradeFlowRes,
    } = this.props;
    // 补足普通账户流水数据
    const standardData = data.padEmptyDataForList(standardTradeFlowRes.list);
    // 修改普通账户Table 的 columns
    const standardTradeColumns = this.getStandardTradeColumns(STANDARD_TRADE_FLOW_COLUMNS);
    // 获取普通账户表格的分页器信息
    const standardPage = this.getPage(standardTradeFlowRes.page);
    const creditData = data.padEmptyDataForList(creditTradeFlowRes.list);
    const creditTradeColumns = this.getCreditTradeColumns(CREDIT_TRADE_FLOW_COLUMNS);
    const creditPage = this.getPage(creditTradeFlowRes.page);
    const optionData = data.padEmptyDataForList(optionTradeFlowRes.list);
    const optionTradeColumns = this.getOptionTradeColumns(OPTION_TRADE_FLOW_COLUMNS);
    const optionPage = this.getPage(optionTradeFlowRes.page);
    // 弹出层的自定义关闭按钮
    const closeBtn = [(
      <Button onClick={this.handleModalClose}>关闭</Button>
    )];
    return (
      <Modal
        visible
        size="large"
        maskClosable={false}
        modalKey="cust360DetailTradeFlowModal"
        closeModal={this.handleModalClose}
        title="交易流水"
        selfBtnGroup={closeBtn}
      >
        <div className={styles.tradeFlowWrap}>
          <Tabs onChange={this.handleTabChange} activeKey={activeTabKey} animated={false}>
            <TabPane tab="普通账户历史交易" key="standardAccountTrade">
              <div className={styles.tabPaneWrap}>
                <div className={styles.header}>
                  <div className={styles.filterArea}>
                    <DateFilter
                      filterName="查询日期"
                      initialStartDate={DEFAULT_START_DATE}
                      value={[standardStartDate,standardEndDate]}
                      onChange={this.handleChangeStandardDate}
                      disabledCurrentEnd={false}
                    />
                  </div>
                  <div className={styles.filterArea}>
                    <SingleFilterWithSearch
                      filterName="业务类别"
                      filterId="bussinessType"
                      value={currentStandBusnTypeValue}
                      data={busnTypeDict.list}
                      placeholder="请输入业务类别"
                      dropdownStyle={{
                        maxHeight: 324,
                        overflowY: 'auto',
                        width: 252,
                      }}
                      onChange={this.handleFilterStandardBussinessType}
                    />
                  </div>
                  <div className={styles.filterArea}>
                    <SingleFilter
                      filterName="产品代码"
                      filterId="productCode"
                      placeholder="请输入产品代码或产品名称"
                      dropdownStyle={{
                        maxHeight: 324,
                        overflowY: 'auto',
                        width: 252,
                      }}
                      dataMap={['prdtCode', 'prdtShortName']}
                      needItemObj
                      showSearch
                      data={finProductList.list}
                      value={currentStandPrdtValue}
                      onInputChange={this.queryFinProductList}
                      onChange={this.handleFilterStandardPrdt}
                    />
                  </div>
                  <div className={styles.filterArea}>
                    <TreeFilter
                      dropdownClassName={styles.allProductMenuTree}
                      filterName="全产品目录"
                      filterId="allProductMenuTree"
                      // placeholder="请输入全产品目录"
                      dropdownStyle={{zIndex: 1000}}
                      treeData={productCatalogTree.allProductMenuTree}
                      multiple
                      showSearch
                      treeCheckable
                      onChange={this.handleFilterTree}
                    />
                  </div>
                </div>
                <div className={styles.body}>
                  <Table
                    pagination={false}
                    dataSource={standardData}
                    columns={standardTradeColumns}
                    className={styles.tradeFlowTable}
                    scroll={STANDARD_TRADE_FLOW_TABLE_SCROLL}
                  />
                </div>
                <Pagination
                  {...standardPage}
                  onChange={this.handleStandardPageChange}
                />
              </div>
            </TabPane>
            <TabPane tab="信用账户历史交易" key="creditAccountTrade">
              <div className={styles.tabPaneWrap}>
                <div className={styles.header}>
                  <div className={styles.filterArea}>
                    <DateFilter
                      filterName="查询日期"
                      initialStartDate={DEFAULT_START_DATE}
                      value={[creditStartDate,creditEndDate]}
                      onChange={this.handleChangeCreditDate}
                      disabledCurrentEnd={false}
                    />
                  </div>
                  <div className={styles.filterArea}>
                    <SingleFilterWithSearch
                      filterName="业务类别"
                      filterId="bussinessType"
                      value={currentCreditBusnTypeValue}
                      data={busnTypeDict.list}
                      placeholder="请输入业务类别"
                      dropdownStyle={{
                        maxHeight: 324,
                        overflowY: 'auto',
                        width: 252,
                      }}
                      onChange={this.handleFilterCreditBussinessType}
                    />
                  </div>
                  <div className={styles.filterArea}>
                    <SingleFilter
                      filterName="产品代码"
                      filterId="productCode"
                      placeholder="请输入产品代码或产品名称"
                      dropdownStyle={{
                        maxHeight: 324,
                        overflowY: 'auto',
                        width: 252,
                      }}
                      dataMap={['prdtCode', 'prdtShortName']}
                      showSearch
                      needItemObj
                      data={finProductList.list}
                      value={currentCreditPrdtValue}
                      onInputChange={this.queryFinProductList}
                      onChange={this.handleFilterCreditPrdt}
                    />
                  </div>
                </div>
                <div className={styles.body}>
                  <Table
                    pagination={false}
                    dataSource={creditData}
                    columns={creditTradeColumns}
                    className={styles.tradeFlowTable}
                    scroll={CREDIT_TRADE_FLOW_TABLE_SCROLL}
                  />
                </div>
                <Pagination
                  {...creditPage}
                  onChange={this.handleCreditPageChange}
                />
              </div>
            </TabPane>
            <TabPane tab="期权账户历史交易" key="optionAccountTrade">
              <div className={styles.tabPaneWrap}>
                <div className={styles.header}>
                  <div className={styles.filterArea}>
                    <DateFilter
                      filterName="查询日期"
                      initialStartDate={DEFAULT_START_DATE}
                      value={[optionStartDate,optionEndDate]}
                      onChange={this.handleChangeOptionDate}
                      disabledCurrentEnd={false}
                    />
                  </div>
                  <div className={styles.filterArea}>
                    <SingleFilter
                      filterName="产品代码"
                      filterId="productCode"
                      placeholder="请输入产品代码或产品名称"
                      dropdownStyle={{
                        maxHeight: 324,
                        overflowY: 'auto',
                        width: 252,
                      }}
                      dataMap={['prdtCode', 'prdtShortName']}
                      showSearch
                      needItemObj
                      data={finProductList.list}
                      value={currentOptionPrdtValue}
                      onInputChange={this.queryFinProductList}
                      onChange={this.handleFilterOptionPrdt}
                    />
                  </div>
                </div>
                <div className={styles.body}>
                  <Table
                    pagination={false}
                    dataSource={optionData}
                    columns={optionTradeColumns}
                    className={styles.tradeFlowTable}
                    scroll={OPTION_TRADE_FLOW_TABLE_SCROLL}
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
