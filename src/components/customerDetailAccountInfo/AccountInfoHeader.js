/*
 * @Author: wangyikai
 * @Date: 2018-10-11 14:05:51
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-11-02 13:56:34
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { Button, Tabs, Radio } from 'antd';
import _ from 'lodash';
import Modal from '../../components/common/biz/CommonModal';
import Table from '../../components/common/table';
import styles from './accountInfoHeader.less';
import { number } from '../../helper';
import { displayMoney } from './utils';
import { list, columns, productColumns } from './config';
//tab栏
const TabPane = Tabs.TabPane;
//单选框
const RadioGroup = Radio.Group;
//处理千分位以及小数保留后两位
const { thousandFormat, toFixed, formatRound } = number;

export default class AccountInfoHeader extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    //证券实时持仓的数据
    securitiesData: PropTypes.array.isRequired,
    //实时资产的数据
    realTimeAsset: PropTypes.object.isRequired,
    //产品实时持仓的数据
    productData: PropTypes.array.isRequired,
    //查询证券实时持仓数据
    getSecuritiesHolding: PropTypes.func.isRequired,
    //查询实时资产的数据
    getRealTimeAsset: PropTypes.func.isRequired,
    //查询产品实时持仓数据
    getProductHoldingData: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    // 是否有正在执行中的流程
    hasDoingFlow: PropTypes.bool.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      // 实时持仓的弹出框
      realTimeHoldModalVisible: false,
      //证券分类数据
      classificationData: {},
      // //默认tab显示的key
      activeKey: 'securitiesHoldings',
    };
  }
  //数据为空时，默认显示空行
  @autobind
  padEmptyRow(data) {
    const len = _.size(data);
    let newData = _.cloneDeep(data);
    if (len < 5) {
      const padLen = 5 - len;
      for (let i = 0; i < padLen; i++) {
        newData = _.concat(newData, [{
          key: `empty_row_${i}`,
          // productCode: `empty_row_${i}`,
          // 空白行标志
          flag: true,
        }]);
      }
    }
    return newData;
  }

  //tab栏切换的回调
  @autobind
  handleTabSwitch(key) {
    this.setState({ activeKey: key });
  }
  // 关闭实时持仓的弹出层
  @autobind
  handleRealTimeHoldModalClose() {
    this.setState({ realTimeHoldModalVisible: false, activeKey: 'securitiesHoldings' });
  }
  // 打开实时持仓的弹出层
  @autobind
  handleRealTimeHoldModalOpen() {
    const { query } = this.props.location;
    const { getRealTimeAsset } = this.props;
    getRealTimeAsset({ custId: query && query.custId }).then(() => {
      this.setState({ realTimeHoldModalVisible: true });
    });
    //进入需要查询下证券实时持仓数据
    this.props.getSecuritiesHolding({
      custId: query && query.custId,
      accountType: 'all'
    });
    //进入需要查询下产品实时持仓数据
    this.props.getProductHoldingData({
      custId: query && query.custId,
    });
  }
  //账户类型的筛选
  @autobind
  handleAccountType(e) {
    const { query } = this.props.location;
    this.props.getSecuritiesHolding({ custId: query && query.custId, accountType: e.target.value });
  }
  // 渲染Tabl列的数据
  @autobind
  renderColumnValue(text, record) {
    const { flag } = record;
    return flag ? '' : text;
  }
  //处理表格数据千分位以及小数保留两（三）位小数
  @autobind
  handleSecuritiesData(securitiesData = []) {
    return _.map(securitiesData, (item) => {
      const { profitAndLoss, presentPrice, marketValue, cost, holdingNumber, availableNumber } = item;
      const newProfitAndLoss = thousandFormat(toFixed(profitAndLoss, 2), true, ',', false);
      const newPresentPrice = thousandFormat(toFixed(presentPrice, 2), true, ',', false);
      const newMarketValue = thousandFormat(toFixed(marketValue, 2), true, ',', false);
      const newCost = thousandFormat(toFixed(cost, 3), true, ',', false);
      const newHoldingNumber = thousandFormat(holdingNumber, true, ',', false);
      const newAvailableNumber = thousandFormat(availableNumber, true, ',', false);
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
  @autobind
  handleProductData(productData = []) {
    return _.map(productData, (items) => {
      const { share, netWorth, marketValue, profitAndLoss } = items;
      const newShare = thousandFormat(toFixed(share, 2), true, ',', false);
      const newNetWorth = thousandFormat(formatRound(netWorth, 2, false), true, ',', false);
      const newMarketValue = thousandFormat(toFixed(marketValue, 2), true, ',', false);
      const newProfitAndLoss = thousandFormat(toFixed(profitAndLoss, 2), true, ',', false);
      return {
        ...items,
        share: newShare,
        netWorth: newNetWorth,
        marketValue: newMarketValue,
        profitAndLoss: newProfitAndLoss
      };
    });
  }

  //根据资产的正负判断实时资产的颜色
  @autobind
  handleRealTimeAssetsColor(rtimeAssets) {
    let color = '#59ae85';
    if (rtimeAssets > 0) {
      color = 'red';
    }
    else if (rtimeAssets === 0) {
      color = '#333';
    }
    return { color };
  }

  // 跳转到资产配置页面
  @autobind
  handleLinkToAssetAllocation() {
    const { push, hasDoingFlow, location: { query: { custId = ''} } } = this.props;
    // 新建
    let pathname = '/fsp/implementation/initsee';
    // 新建 url
    let url = `/asset/implementation/wizard/main?routeType=true:new:${custId}`;
    // 有执行中的流程，去列表
    if (hasDoingFlow) {
      pathname = '/fsp/serviceCenter/asset/implementation';
      url = `/asset/implementation/main?customerIdStr=${custId}`;
    }
    push({
      pathname,
      state: {
        url,
      }
    });
  }

  render() {
    const {
      realTimeHoldModalVisible,
    } = this.state;
    const { securitiesData, realTimeAsset, productData } = this.props;
    //空白数据填充
    const newSecuritiesDatas = this.padEmptyRow(securitiesData);
    const productDatas = this.padEmptyRow(productData);
    // 修改Table的Column
    const newColumns = _.map(columns, column => ({ ...column, render: this.renderColumnValue }));
    const productColumn = _.map(productColumns, column => ({ ...column, render: this.renderColumnValue }));

    //处理表格数据千分位以及小数保留两（三）位小数
    const newSecuritiesData = this.handleSecuritiesData(newSecuritiesDatas);
    const newProductData = this.handleProductData(productDatas);
    //取出实时资产的数据
    const { rtimeAssets, availableFunds, advisableFunds } = realTimeAsset;
    //调用处理实时资产数据的方法
    const rtimeAsset = displayMoney(rtimeAssets);
    //根据资产的正负判断实时资产的颜色
    const realTimeAssetsColorStyle = this.handleRealTimeAssetsColor(rtimeAssets);
    const availableFund = displayMoney(availableFunds);
    const advisableFund = displayMoney(advisableFunds);
    const { activeKey } = this.state;
    return (
      <div>
        <div className={styles.accountHeaderContainer}>
          <Button onClick={this.handleRealTimeHoldModalOpen} className={styles.accountHeader}>实时持仓</Button>
          <Button className={styles.accountHeader}>历史持仓</Button>
          <Button className={styles.accountHeader}>交易流水</Button>
          <Button className={styles.accountHeader} onClick={this.handleLinkToAssetAllocation}>资产配置</Button>
          <Button className={styles.accountHeader}>账户分析</Button>
        </div>
        <Modal
          title="实时持仓"
          size='large'
          showOkBtn={false}
          destroyOnClose
          visible={realTimeHoldModalVisible}
          closeModal={this.handleRealTimeHoldModalClose}
          onCancel={this.handleRealTimeHoldModalClose}
          selfBtnGroup={[(<Button onClick={this.handleRealTimeHoldModalClose}>关闭</Button>)]}
          modalKey="realTimeModal"
          maskClosable={false}
        >
          <div className={styles.assets}>
            <div className={styles.assetsContainer}>
              <span className={styles.rtimeAsset}>实时资产</span>
              <span className={styles.assetsnewItem} style={realTimeAssetsColorStyle}>{rtimeAsset}</span>
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
              <TabPane
                tab="证券实时持仓"
                key="securitiesHoldings">
                <div className={styles.tabDiv}><span className={styles.tabspan}>账户类型：</span>
                  <RadioGroup name="radiogroup" defaultValue="all" onChange={this.handleAccountType}>
                    {
                      list.map(item => (
                        <Radio value={item.value} key={item.value}>
                          <span
                            style={{
                              'paddingLeft': '10px',
                              'paddingRight': '30px',
                            }}
                          >
                            {item.label}
                          </span>
                        </Radio>
                      ))
                    }
                  </RadioGroup>
                </div>
                <Table
                  rowKey='dataIndex'
                  className={styles.tableContainer}
                  columns={newColumns}
                  dataSource={newSecuritiesData}
                  pagination={false}
                  scroll={{ x: '1026px' }}
                />
              </TabPane>
              <TabPane tab="产品实时持仓" key="productHoldingDate">
                <Table className={styles.tableContainer}
                  columns={productColumn}
                  rowKey='dataIndex'
                  dataSource={newProductData}
                  pagination={false}
                  scroll={{ x: '1026px' }}
                />
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}
