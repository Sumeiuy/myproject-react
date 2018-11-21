/*
 * @Author: yuanhaojie
 * @Date: 2018-11-19 10:17:54
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-21 18:49:10
 * @Description: 产品订单
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';
import { generateEffect as effect } from '../../../../helper/dva';
import ProductOrderFlow from '../../../../components/customerDetailProductOrder/ProductOrderFlow';
import TradeOrderFlow from '../../../../components/customerDetailProductOrder/TradeOrderFlow';

import styles from './home.less';

const TabPane = Tabs.TabPane;
const TRADE_ORDER_FLOW_PAGE_SIZE = 5;

const mapStateToProps = ({ productOrder }) => ({
  serviceOrderFlow: productOrder.serviceOrderFlow,
  tradeOrderFlow: productOrder.tradeOrderFlow,
});

const mapDispatchToProps = {
  queryServiceOrderFlow: effect('productOrder/queryServiceOrderFlow'),
  queryTradeOrderFlow: effect('productOrder/queryTradeOrderFlow'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ProductOrder extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    serviceOrderFlow: PropTypes.object.isRequired,
    tradeOrderFlow: PropTypes.object.isRequired,
    queryServiceOrderFlow: PropTypes.func.isRequired,
    queryTradeOrderFlow: PropTypes.func.isRequired,
  };

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { query: { productOrderTabActiveKey } } = nextProps.location;
    if (productOrderTabActiveKey !== prevState.activeTabKey) {
      // 根据query中的productOrderTabActiveKey值决定显示哪个tab
      const activeTabKey = productOrderTabActiveKey || 'serviceOrder';
      return {
        activeTabKey,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { query: { productOrderTabActiveKey } } = props.location;
    const activeTabKey = productOrderTabActiveKey ? productOrderTabActiveKey : 'serviceOrder';
    this.state ={
      activeTabKey,
    };
  }

  componentDidMount() {
    const { activeTabKey } = this.state;
    this.replaceActiveTabKey(activeTabKey);
    this.getActiveTabInfo();
  }

  componentDidUpdate(prevProps) {
    const { location: { query: { custId : preCustId } } } = prevProps;
    const {
      query: { custId },
    } = this.props.location;
    if (custId && custId !== preCustId) {
      this.getActiveTabInfo();
    }
  }

  @autobind
  handleTabChange(activeTabKey) {
    // 不直接setState，在getDerivedStateFromProps去改变state
    this.replaceActiveTabKey(activeTabKey);
  }

  @autobind
  replaceActiveTabKey(tabKey) {
    const { replace } = this.context;
    const { location: { query }} = this.props;
    replace({
      query: {
        ...query,
        productOrderTabActiveKey: tabKey,
      }
    });
  }

  @autobind
  getActiveTabInfo() {
    const { activeTabKey } = this.state;
    const {
      // queryServiceOrderFlow,
      queryTradeOrderFlow,
      location: { query: { custId } },
    } = this.props;
    if (activeTabKey === 'serviceOrderFlow') {
      // TODO
    } else if (activeTabKey === 'tradeOrderFlow') {
      queryTradeOrderFlow({
        custId,
        pageNum: 0,
        pageSize: TRADE_ORDER_FLOW_PAGE_SIZE,
      });
    }
  }

  @autobind
  handleTradeOrderFlowChanged(page, pageSize) {
    // TODO
  }

  render() {
    const {
      activeTabKey,
    } = this.state;
    const {
      tradeOrderFlow,
    } = this.props;

    return (
      <div className={styles.productOrderContainer}>
        <Tabs type="card" onChange={this.handleTabChange} activeKey={activeTabKey} size="large">
          <TabPane tab="服务订购" key="serviceOrder">
            <div className={styles.tabPaneWrap}>
            </div>
          </TabPane>
          <TabPane tab="服务订单流水" key="serviceOrderFlow">
            <div className={styles.tabPaneWrap}>
              <ProductOrderFlow />
            </div>
          </TabPane>
          <TabPane tab="交易订单流水" key="tradeOrderFlow">
            <div className={styles.tabPaneWrap}>
              <TradeOrderFlow
                tradeOrderFlowData={tradeOrderFlow}
                onTradeOrderFlowChange={this.handleTradeOrderFlowChanged}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
