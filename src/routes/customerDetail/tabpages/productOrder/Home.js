/*
 * @Author: yuanhaojie
 * @Date: 2018-11-19 10:17:54
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-22 19:25:43
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
const TRADE_ORDER_FLOW_PAGE_SIZE = 10;

const mapStateToProps = state => ({
  serviceOrderFlow: state.productOrder.serviceOrderFlow,
  tradeOrderFlow: state.productOrder.tradeOrderFlow,
  jxGroupProductList: state.customerPool.jxGroupProductList, // 产品搜索结果
});

const mapDispatchToProps = {
  queryServiceOrderFlow: effect('productOrder/queryServiceOrderFlow'),
  queryTradeOrderFlow: effect('productOrder/queryTradeOrderFlow'),
  queryJxGroupProduct: effect('customerPool/queryJxGroupProduct'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ProductOrder extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    serviceOrderFlow: PropTypes.object.isRequired,
    tradeOrderFlow: PropTypes.object.isRequired,
    queryServiceOrderFlow: PropTypes.func.isRequired,
    queryTradeOrderFlow: PropTypes.func.isRequired,
    jxGroupProductList: PropTypes.array.isRequired,
    queryJxGroupProduct: PropTypes.func.isRequired,
  };

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  componentDidUpdate(prevProps) {
    const { location: { query: { custId : preCustId } } } = prevProps;
    const {
      query: {
        custId,
      },
    } = this.props.location;
    if (custId && custId !== preCustId) {
      this.getActiveTabInfo();
    }
  }

  @autobind
  handleTabChange(activeTabKey) {
    this.replaceActiveTabKey(activeTabKey);
  }

  @autobind
  replaceActiveTabKey(tabKey) {
    const { replace } = this.context;
    const {
      location: {
        query,
      },
    } = this.props;
    replace({
      query: {
        ...query,
        productOrderTabActiveKey: tabKey,
      }
    });
  }

  @autobind
  getActiveTabInfo() {
    const activeTabKey = this.getTabActiveKeyByUrl();
    const {
      // queryServiceOrderFlow,
      queryTradeOrderFlow,
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    if (activeTabKey === 'serviceOrderFlow') {
      // TODO
    } else if (activeTabKey === 'tradeOrderFlow') {
      queryTradeOrderFlow({
        custId,
        pageNum: 1,
        pageSize: TRADE_ORDER_FLOW_PAGE_SIZE,
      });
    }
  }

  @autobind
  handleProductOrderFlowChanged(payload) {
    const {
      location: {
        query: {
          custId,
        },
      },
      queryServiceOrderFlow,
    } = this.props;
    queryServiceOrderFlow({
      custId,
      ...payload,
    });
  }

  @autobind
  handleTradeOrderFlowChanged(pageNum, pageSize) {
    const {
      location: {
        query: {
          custId,
        },
      },
      queryTradeOrderFlow,
    } = this.props;
    queryTradeOrderFlow({
      custId,
      pageNum,
      pageSize,
    });
  }

  @autobind
  getTabActiveKeyByUrl() {
    const {
      location: {
        query: {
          productOrderTabActiveKey = 'serviceOrder',
        },
      },
    } = this.props;
    return productOrderTabActiveKey;
  }

  render() {
    const {
      serviceOrderFlow,
      tradeOrderFlow,
      jxGroupProductList,
    } = this.props;
    const activeKey = this.getTabActiveKeyByUrl();

    return (
      <div className={styles.productOrderContainer}>
        <Tabs
          type="card"
          onChange={this.handleTabChange}
          activeKey={activeKey}
        >
          <TabPane tab="服务订购" key="serviceOrder">
            <div className={styles.tabPaneWrap}>
            </div>
          </TabPane>
          <TabPane tab="服务订单流水" key="serviceOrderFlow">
            <div className={styles.tabPaneWrap}>
              <ProductOrderFlow
                productListBySearch={jxGroupProductList}
                serviceOrderFlow={serviceOrderFlow}
                onProductOrderFlowChange={this.handleProductOrderFlowChanged}
              />
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
