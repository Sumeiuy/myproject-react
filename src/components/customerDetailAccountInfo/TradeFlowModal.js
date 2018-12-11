/*
 * @Author: liqianwen
 * @Date: 2018-11-07 13:31:51
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-11 09:54:11
 * @description 新版客户360详情的交易流水的弹出层
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import {
  Button, Tabs
} from 'antd';
import logable, { logCommon } from '../../decorators/logable';
import Modal from '../common/biz/CommonModal';
import NormalTradeFlow from './tradeFlow/NormalTradeFlow';
import CreditTradeFlow from './tradeFlow/CreditTradeFlow';
import OptionTradeFlow from './tradeFlow/OptionTradeFlow';
import CapitalChange from './tradeFlow/CapitalChange';
import { TRADE_FLOW_TABS } from './config';

import styles from './tradeFlowModal.less';

const TabPane = Tabs.TabPane;

export default class TradeFlowModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 关闭弹出层
    onClose: PropTypes.func.isRequired,
    // 查询交易流水的api集合函数
    tradeFlowApi: PropTypes.object.isRequired,
    // 交易流水的普通账户、信用账户下的业务类别
    tradeFlowBusnTypeDict: PropTypes.object.isRequired,
    // 资金账户下的交易流水的普通账户、信用账户下的业务类别
    tradeFlowCapitalBusnTypeDict: PropTypes.object.isRequired,
    // 产品代码
    finProductList: PropTypes.object.isRequired,
    // 全产品目录
    productCatalogTree: PropTypes.array.isRequired,
    // 普通账户交易流水
    standardTradeFlowRes: PropTypes.object.isRequired,
    // 信用账户交易流水
    creditTradeFlowRes: PropTypes.object.isRequired,
    // 期权账户交易流水
    optionTradeFlowRes: PropTypes.object.isRequired,
    // 资金变动交易流水
    capitalChangeFlowRes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 当前激活的交易流水
      activeTabKey: 'normal',
    };
  }

  componentDidMount() {
    // 初始化的时候查询下普通账户的业务列表
    this.queryBusnTypeList();
    // 初始化获取普通账户的全产品目录
    this.queryProductCatalogTree();
  }

  // 查询资金变动的业务类别列表
  @autobind
  queryCapitalBusnTypeList(param) {
    this.props.tradeFlowApi.queryBusnTypeForCapital(param);
  }

  // 查询普通账户、信用账户、期权账户的业务类别
  @autobind
  queryBusnTypeList() {
    const { tradeFlowBusnTypeDict } = this.props;
    const { activeTabKey } = this.state;
    if (
      activeTabKey !== 'capitalChange'
      && _.isEmpty(tradeFlowBusnTypeDict[activeTabKey])
    ) {
      // 如果是非资金账户变动，则需要查询下各个账户类型下的业务类型列表是否存在，不存在则查询
      this.props.tradeFlowApi.queryBusnType({
        accountType: activeTabKey,
        queryType: 'tradeFlow',
      });
    }
  }

  // 查询普通账户、信用账户、期权账户的产品代码下拉框
  @autobind
  queryProductCodeList(query) {
    return this.props.tradeFlowApi.queryProductCodeList(query);
  }

  // 查询全产品目录树
  @autobind
  queryProductCatalogTree() {
    const { productCatalogTree } = this.props;
    if (_.isEmpty(productCatalogTree)) {
      // 如果不存在全产品目录树，再查询获取，因为这个不会变，只要查一次就行
      this.props.tradeFlowApi.queryProductCatalogTree();
    }
  }

  // 查询普通账户交易流水
  @autobind
  queryStandardTradeFlow(params) {
    const { location: { query: { custId } } } = this.props;
    this.props.tradeFlowApi.queryStandardTradeFlow({
      custId,
      ...params,
    });
  }

  // 查询信用账户交易流水
  @autobind
  queryCreditTradeFlow(params) {
    const { location: { query: { custId } } } = this.props;
    this.props.tradeFlowApi.queryCreditTradeFlow({
      custId,
      ...params,
    });
  }

  // 查询期权账户交易流水
  @autobind
  queryOptionTradeFlow(params) {
    const { location: { query: { custId } } } = this.props;
    this.props.tradeFlowApi.queryOptionTradeFlow({
      custId,
      ...params,
    });
  }

  // 查询资金变动交易流水
  @autobind
  queryCapitalTradeFlow(params) {
    const { location: { query: { custId } } } = this.props;
    this.props.tradeFlowApi.queryCapitalTradeFlow({
      custId,
      ...params,
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '关闭' },
  })
  handleModalClose() {
    this.props.onClose();
  }

  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey }, this.queryBusnTypeList);
    // 需要记录切换日志
    logCommon({
      type: 'Click',
      payload: {
        name: '交易流水Tab切换',
        value: TRADE_FLOW_TABS[activeTabKey],
      },
    });
  }

  render() {
    const { activeTabKey } = this.state;
    const {
      location,
      tradeFlowBusnTypeDict,
      productCatalogTree,
      standardTradeFlowRes,
      creditTradeFlowRes,
      optionTradeFlowRes,
      capitalChangeFlowRes,
      tradeFlowCapitalBusnTypeDict,
    } = this.props;
    // 弹出层的自定义关闭按钮
    const closeBtn = [(
      <Button key="tradeFlowModalCloseBtn" onClick={this.handleModalClose}>关闭</Button>
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
            <TabPane tab="普通账户历史交易" key="normal">
              <NormalTradeFlow
                location={location}
                busnTypeList={tradeFlowBusnTypeDict.normal || []}
                productCatalogTree={productCatalogTree}
                tradeFlow={standardTradeFlowRes}
                queryStandardTradeFlow={this.queryStandardTradeFlow}
                queryProductCodeList={this.queryProductCodeList}
              />
            </TabPane>
            <TabPane tab="信用账户历史交易" key="credit">
              <CreditTradeFlow
                tradeFlow={creditTradeFlowRes}
                busnTypeList={tradeFlowBusnTypeDict.credit || []}
                queryCreditTradeFlow={this.queryCreditTradeFlow}
                queryProductCodeList={this.queryProductCodeList}
              />
            </TabPane>
            <TabPane tab="期权账户历史交易" key="option">
              <OptionTradeFlow
                tradeFlow={optionTradeFlowRes}
                queryOptionTradeFlow={this.queryOptionTradeFlow}
                queryProductCodeList={this.queryProductCodeList}
              />
            </TabPane>
            <TabPane tab="资金变动" key="capitalChange">
              <CapitalChange
                busnType={tradeFlowCapitalBusnTypeDict}
                capitalData={capitalChangeFlowRes}
                queryBusnTypeList={this.queryCapitalBusnTypeList}
                queryCapitalTradeFlow={this.queryCapitalTradeFlow}
              />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}
