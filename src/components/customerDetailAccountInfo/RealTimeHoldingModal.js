/*
 * @Author: sunweibin
 * @Date: 2018-11-06 17:44:38
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-29 11:17:33
 * @description 实时持仓的弹出层
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Tabs, Radio } from 'antd';
import { autobind } from 'core-decorators';
import cx from 'classnames';
import _ from 'lodash';

import IfTableWrap from '../common/IfTableWrap';
import Table from '../../components/common/table';
import Modal from '../common/biz/CommonModal';
import { displayMoney } from './utils';
import { data, number } from '../../helper';
import logable, { logCommon } from '../../decorators/logable';
import {
  STOCK_REALTIME_COLUMNS,
  PRODUCT_REALTIME_COLUMNS,
  REALTIME_HOLDING_TABS,
} from './config';

import styles from './realTimeHoldingModal.less';

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

export default class RealTimeHoldingModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    // 头部实时资产数据
    realTimeAssets: PropTypes.object.isRequired,
    // 证券实时资产
    securitiesData: PropTypes.array.isRequired,
    // 产品实时资产
    productData: PropTypes.array.isRequired,
    // 查询证券实时持仓
    getSecuritiesHolding: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // Tab，默认为证券实时持仓
      activeKey: 'stockRealTimeHolding',
    };
  }

  // 转化证券实时数据
  @autobind
  converStockData(securitiesData = []) {
    return _.map(securitiesData, (item) => {
      const { profitAndLoss, presentPrice, marketValue, cost, holdingNumber, availableNumber } = item;
      const newProfitAndLoss = number.thousandFormat(number.toFixed(profitAndLoss));
      const newPresentPrice = number.thousandFormat(number.toFixed(presentPrice));
      const newMarketValue = number.thousandFormat(number.toFixed(marketValue));
      const newCost = number.thousandFormat(number.toFixed(cost, 3));
      const newHoldingNumber = number.thousandFormat(holdingNumber);
      const newAvailableNumber = number.thousandFormat(availableNumber);
      return {
        ...item,
        profitAndLoss: newProfitAndLoss,
        presentPrice: newPresentPrice,
        marketValue: newMarketValue,
        cost: newCost,
        holdingNumber: newHoldingNumber,
        availableNumber: newAvailableNumber
      };
    });
  }

  // 转化产品实时数据
  @autobind
  converProductData(productData = []) {
    return _.map(productData, (items) => {
      const { share, netWorth, marketValue, profitAndLoss } = items;
      const newShare = number.thousandFormat(number.toFixed(share));
      const newNetWorth = number.thousandFormat(number.formatRound(netWorth, 2, false));
      const newMarketValue = number.thousandFormat(number.toFixed(marketValue));
      const newProfitAndLoss = number.thousandFormat(number.toFixed(profitAndLoss));
      return {
        ...items,
        share: newShare,
        netWorth: newNetWorth,
        marketValue: newMarketValue,
        profitAndLoss: newProfitAndLoss
      };
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '切换实时持仓Tab',
      value: '$args[0].target.value',
    }
  })
  handleAccountType(e) {
    const { value } = e.target;
    const { location: { query: { custId } } } = this.props;
    this.props.getSecuritiesHolding({
      custId,
      accountType: value,
    });
  }

  //tab栏切换的回调
  @autobind
  handleTabSwitch(key) {
    this.setState({ activeKey: key });
    // 记录切换Tab的日志
    logCommon({
      type: 'Click',
      payload: {
        name: '实时持仓切换Tab',
        value: REALTIME_HOLDING_TABS[key],
      }
    });
  }

  render() {
    const { activeKey } = this.state;
    const { securitiesData, productData, realTimeAsset } = this.props;
    //取出实时资产的数据
    const { rtimeAssets, availableFunds, advisableFunds } = realTimeAsset;
    // 实时资产
    const rtimeAsset = displayMoney(rtimeAssets);
    const rtimeAssetCls = cx({
      [styles.assetsnewItem]: true,
      [styles.redText]: rtimeAssets >= 0,
      [styles.greenText]: rtimeAssets < 0,
    });
    // 可用资产
    const availableFund = displayMoney(availableFunds);
    // 可取资产
    const advisableFund = displayMoney(advisableFunds);
    // 使用空白行补足数据
    const hasNoStockData = _.isEmpty(securitiesData);
    const hasNoProductData = _.isEmpty(productData);
    const stockData = data.padEmptyDataForList(this.converStockData(securitiesData), 5);
    const newProductData = data.padEmptyDataForList(this.converProductData(productData), 5);

    return (
      <Modal
        title="实时持仓"
        size='large'
        showOkBtn={false}
        destroyOnClose
        visible
        closeModal={this.props.onClose}
        selfBtnGroup={[(<Button onClick={this.props.onClose}>关闭</Button>)]}
        modalKey="realTimeHoldingModal"
        maskClosable={false}
      >
        <div className={styles.assets}>
          <div className={styles.assetsContainer}>
            <span className={styles.rtimeAsset}>实时资产</span>
            <span className={rtimeAssetCls}>{rtimeAsset}</span>
          </div>
          <div className={styles.assetsContainer}>
            <span className={styles.availableFund}>可用资金</span>
            <span className={styles.assetsnewUnit}>{availableFund}</span>
          </div>
          <div className={styles.assetsContainer}>
            <span className={styles.availableFund}>可取资金</span>
            <span className={styles.assetsnewUnit}>{advisableFund}</span>
          </div>
        </div>
        <div className={styles.tabContainer}>
          <Tabs
            onChange={this.handleTabSwitch}
            animated={false}
            className={styles.tab}
            activeKey={activeKey}
          >
            <TabPane tab="证券实时持仓" key="stockRealTimeHolding">
              <div className={styles.tabDiv}>
                <span className={styles.tabspan}>账户类型：</span>
                <RadioGroup defaultValue="all" onChange={this.handleAccountType}>
                  <Radio value="all">全部</Radio>
                  <Radio value="normal">普通</Radio>
                  <Radio value="credit">信用</Radio>
                </RadioGroup>
              </div>
              <IfTableWrap isRender={!hasNoStockData} text="暂无证券实时持仓数据">
                <Table
                  className={styles.tableContainer}
                  columns={STOCK_REALTIME_COLUMNS}
                  dataSource={stockData}
                  pagination={false}
                  scroll={{ x: '1026px' }}
                />
              </IfTableWrap>
            </TabPane>
            <TabPane tab="产品实时持仓" key="productRealTimeHolding">
              <IfTableWrap isRender={!hasNoProductData} text="暂无产品实时持仓数据">
                <Table className={styles.tableContainer}
                  columns={PRODUCT_REALTIME_COLUMNS}
                  dataSource={newProductData}
                  pagination={false}
                  scroll={{ x: '1026px' }}
                />
              </IfTableWrap>
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}

