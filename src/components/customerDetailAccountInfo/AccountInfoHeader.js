/*
 * @Author: wangyikai
 * @Date: 2018-10-11 14:05:51
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-10-18 13:50:51
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { Button, Tabs, Radio } from 'antd';
import _ from 'lodash';
import Modal from '../../components/common/biz/CommonModal';
import Table from '../../components/common/table';
import styles from './accountInfoHeader.less';
import { transformItemUnit } from '../chartRealTime/FixNumber';
import { list, columns, productColumns } from './config';
//tab栏
const TabPane = Tabs.TabPane;
//单选框
const RadioGroup = Radio.Group;

export default class AccountInfoHeader extends PureComponent {
  static PropTypes = {
    dataSource: PropTypes.array.isRequired,
    realTimeAsset: PropTypes.object.isRequired,
    productDate: PropTypes.array.isRequired,
    getSecuritiesHolding: PropTypes.func.isRequired,
    getRealTimeAsset: PropTypes.func.isRequired,
    getProductHoldingData: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
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
          productCode: `empty_row_${i}`,
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
    this.setState({ realTimeHoldModalVisible: true });
    //进入需要查询下证券实时持仓数据
    this.props.getSecuritiesHolding({
      custId: query && query.custId,
      accountType: 'all'
    });
    //进入需要查询下实时资产数据
    this.props.getRealTimeAsset({
      custId: query && query.custId,
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

  render() {
    const {
      realTimeHoldModalVisible,
    } = this.state;
    const { dataSource, realTimeAsset, productDate } = this.props;
   //空白数据填充
    const newDateSource = this.padEmptyRow(dataSource);
    const productDates = this.padEmptyRow(productDate);
    // 修改Table的Column
    const newColumns = _.map(columns, column => ({...column, render: this.renderColumnValue}));
    const productColumn = _.map(productColumns, column => ({...column, render: this.renderColumnValue}));
    //取出实时资产的数据
    const { rtimeAssets, availableFunds, advisableFunds } = realTimeAsset;
    //调用处理实时资产数据的方法
    const rtimeAsset = transformItemUnit(rtimeAssets);
    //根据资产的正负判断实时资产的颜色
    let realTimeColor = {};
    if (rtimeAsset.newItem > 0) {
      realTimeColor = { color: 'red' };
    }
    else if (rtimeAsset.newItem === 0) {
      realTimeColor = { color: '#333' };
    }
    const availableFund = transformItemUnit(availableFunds);
    const advisableFund = transformItemUnit(advisableFunds);
    const { activeKey } = this.state;
    return (
      <div>
        <div className={styles.accountHeaderContainer}>
        <Button onClick={this.handleRealTimeHoldModalOpen} className={styles.accountHeader}>实时持仓</Button>
        <Button className={styles.accountHeader}>历史持仓</Button>
        <Button className={styles.accountHeader}>交易流水</Button>
        <Button className={styles.accountHeader}>资产配置</Button>
        <Button className={styles.accountHeader}>账户分析</Button>
        </div>
        <Modal
          title="实时持仓"
          size="large"
          showOkBtn={false}
          destroyOnClose
          visible={realTimeHoldModalVisible}
          closeModal={this.handleRealTimeHoldModalClose}
          onCancel={this.handleRealTimeHoldModalClose}
          selfBtnGroup={[(<Button onClick={this.handleRealTimeHoldModalClose}>关闭</Button>)]}
          modalKey="realTimeModal"
        >
          <div className={styles.assets}>
            <div className={styles.assetsContainer}>
              <span className={styles.rtimeAsset}>实时资产</span>
              <span className={styles.assetsnewItem} style={realTimeColor}>{rtimeAsset.newItem}{rtimeAsset.newUnit}</span>
            </div>
            <div className={styles.assetsContainer}>
              <span className={styles.availableFund}>可用资金</span>
              <span className={styles.assetsnewUnit}>{availableFund.newItem}{availableFund.newUnit}</span>
            </div>
            <div className={styles.assetsContainer}>
              <span className={styles.availableFund}>可取资金</span>
              <span className={styles.assetsnewUnit}>{advisableFund.newItem}{advisableFund.newUnit}</span>
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
                  rowKey='productCode'
                  className={styles.tableContainer}
                  columns={newColumns}
                  dataSource={newDateSource}
                  pagination={false}
                />
              </TabPane>
              <TabPane tab="产品实时持仓" key="productHoldingDate">
                <Table className={styles.tableContainer}
                  columns={productColumn}
                  rowKey='productCode'
                  dataSource={productDates}
                  pagination={false} />
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}


