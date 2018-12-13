/*
 * @Author: yuanhaojie
 * @Date: 2018-11-19 10:17:54
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-29 10:33:58
 * @Description: 产品订单
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import logable from '../../../../decorators/logable';
import { generateEffect as effect } from '../../../../helper/dva';
import Tabs from '../../../../components/common/innerTab';
import ProductOrderFlow from '../../../../components/customerDetailProductOrder/ProductOrderFlow';
import TradeOrderFlow from '../../../../components/customerDetailProductOrder/TradeOrderFlow';
import ServiceOrder from '../../../../components/customerDetailProductOrder/ServiceOrder';
import {
  DEFAULT_PAGE_SIZE,
} from '../../../../components/customerDetailProductOrder/config';

import styles from './home.less';

const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
  serviceOrderFlow: state.productOrder.serviceOrderFlow,
  tradeOrderFlow: state.productOrder.tradeOrderFlow,
  serviceProductData: state.productOrder.serviceProductData, // 服务产品搜索结果
  serviceOrderDetail: state.productOrder.serviceOrderDetail,
  serviceProductList: state.productOrder.serviceProductList,
  orderApproval: state.productOrder.orderApproval,
  attachmentList: state.productOrder.attachmentList,
  serviceOrderData: state.productOrder.serviceOrderData,
});

const mapDispatchToProps = {
  queryServiceOrderFlow: effect('productOrder/queryServiceOrderFlow'),
  queryTradeOrderFlow: effect('productOrder/queryTradeOrderFlow'),
  queryServiceProductBySearch: effect('productOrder/queryServiceProductBySearch', { loading: false }),
  queryServiceOrderDetail: effect('productOrder/queryServiceOrderDetail', { forceFull: true }),
  queryServiceProductList: effect('productOrder/queryServiceProductList', { forceFull: true }),
  queryOrderApproval: effect('productOrder/queryOrderApproval', { forceFull: true }),
  getAttachmentList: effect('productOrder/getAttachmentList', { forceFull: true }),
  // 查询是否可发起佣金调整
  queryCustCanChangeCommission: effect('productOrder/queryCustCanChangeCommission', { loading: false }),
  // 查询服务订购订单
  queryServiceOrderData: effect('productOrder/queryServiceOrderData'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ProductOrder extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    serviceOrderFlow: PropTypes.object.isRequired,
    tradeOrderFlow: PropTypes.object.isRequired,
    serviceOrderData: PropTypes.object.isRequired,
    queryServiceOrderFlow: PropTypes.func.isRequired,
    queryTradeOrderFlow: PropTypes.func.isRequired,
    serviceProductData: PropTypes.array.isRequired,
    queryServiceProductBySearch: PropTypes.func.isRequired,
    serviceOrderDetail: PropTypes.object.isRequired,
    serviceProductList: PropTypes.array.isRequired,
    orderApproval: PropTypes.object.isRequired,
    queryServiceOrderDetail: PropTypes.func.isRequired,
    queryServiceProductList: PropTypes.func.isRequired,
    queryOrderApproval: PropTypes.func.isRequired,
    attachmentList: PropTypes.array.isRequired,
    getAttachmentList: PropTypes.func.isRequired,
    queryCustCanChangeCommission: PropTypes.func.isRequired,
    queryServiceOrderData: PropTypes.func.isRequired,
  };

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  componentDidUpdate(prevProps) {
    const { location: { query: { custId: preCustId } } } = prevProps;
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
  @logable({ type: 'Click', payload: { name: '产品订单切换显示面板', value: '$args[0]' } })
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
      queryServiceOrderFlow,
      queryTradeOrderFlow,
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    if (activeTabKey === 'serviceOrderFlow') {
      queryServiceOrderFlow({
        custId,
        serviceProductCode: '',
        type: '',
        createTimeFrom: '',
        createTimeTo: '',
        pageSize: DEFAULT_PAGE_SIZE,
        curPageNum: 1,
      });
    } else if (activeTabKey === 'tradeOrderFlow') {
      queryTradeOrderFlow({
        custId,
        pageNum: 1,
        pageSize: DEFAULT_PAGE_SIZE,
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
      serviceProductData,
      serviceOrderDetail,
      serviceProductList,
      orderApproval,
      queryServiceOrderDetail,
      queryServiceProductList,
      queryOrderApproval,
      queryServiceProductBySearch,
      attachmentList,
      getAttachmentList,
      location,
      serviceOrderData,
      queryCustCanChangeCommission,
      queryServiceOrderData,
    } = this.props;
    const activeKey = this.getTabActiveKeyByUrl();

    return (
      <div className={styles.productOrderContainer}>
        <Tabs
          onChange={this.handleTabChange}
          activeKey={activeKey}
        >
          <TabPane tab="服务订购" key="serviceOrder">
            <div className={styles.tabPaneWrap}>
              <ServiceOrder
                location={location}
                serviceOrderData={serviceOrderData}
                queryCustCanChangeCommission={queryCustCanChangeCommission}
                queryServiceOrderData={queryServiceOrderData}
              />
            </div>
          </TabPane>
          <TabPane tab="服务订单流水" key="serviceOrderFlow">
            <div className={styles.tabPaneWrap}>
              <ProductOrderFlow
                productListBySearch={serviceProductData}
                queryServiceProductBySearch={queryServiceProductBySearch}
                serviceOrderFlow={serviceOrderFlow}
                onProductOrderFlowChange={this.handleProductOrderFlowChanged}
                serviceOrderDetail={serviceOrderDetail}
                serviceProductList={serviceProductList}
                orderApproval={orderApproval}
                queryServiceOrderDetail={queryServiceOrderDetail}
                queryServiceProductList={queryServiceProductList}
                queryOrderApproval={queryOrderApproval}
                attachmentList={attachmentList}
                getAttachmentList={getAttachmentList}
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
