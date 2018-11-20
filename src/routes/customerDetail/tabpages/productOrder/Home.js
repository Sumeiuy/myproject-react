/*
 * @Author: yuanhaojie
 * @Date: 2018-11-19 10:17:54
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-20 17:35:55
 * @Description: 产品订单
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';
import { generateEffect as effect } from '../../../../helper/dva';
import ProductOrderFlow from '../../../../components/customerDetailProductOrder/ProductOrderFlow';

import styles from './home.less';

const TabPane = Tabs.TabPane;

const mapStateToProps = ({ productOrder }) => ({
  serviceOrderFlow: productOrder.serviceOrderFlow,
});

const mapDispatchToProps = {
  queryServiceOrderFlow: effect('productOrder/queryServiceOrderFlow'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ProductOrder extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { query: { productOrderTabActiveKey } } = props.location;
    this.state ={
      activeTabKey: productOrderTabActiveKey ? productOrderTabActiveKey : 'serviceOrder',
    };
  }

  componentDidMount() {
    this.replaceActiveTabKey();
  }

  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey }, () => {
      this.replaceActiveTabKey();
    });
  }

  @autobind
  replaceActiveTabKey() {
    const { activeTabKey } = this.state;
    const { replace } = this.context;
    const { location: { query }} = this.props;
    replace({
      query: {
        ...query,
        productOrderTabActiveKey: activeTabKey,
      }
    });
  }

  render() {
    const { activeTabKey } = this.state;

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
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
