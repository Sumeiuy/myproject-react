/*
 * @Author: wangyikai
 * @Date: 2018-10-11 14:05:51
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-10-16 17:55:35
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { Button, Tabs, Radio } from 'antd';
import Modal from '../../components/common/biz/CommonModal';
import Table from '../../components/common/table/index';
import styles from './accountInfoHeader.less';
import { transformItemUnit } from '../chartRealTime/FixNumber';
//tab栏
const TabPane = Tabs.TabPane;
//单选框
const RadioGroup = Radio.Group;
//证券实时持仓表格
const columns = [
  {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    className: 'productCode',
    width: '115px',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '110px',
  },
  {
    title: '持仓数',
    dataIndex: 'holdingNumber',
    key: 'holdingNumber',
    align: 'right',
    width: '48px',
  },
  {
    title: '可用数',
    dataIndex: 'availableNumber',
    key: 'availableNumber',
    align: 'right',
    width: '75px',
  },
  {
    title: '成本',
    dataIndex: 'cost',
    key: 'cost',
    align: 'right',
    width: '95px',
  },
  {
    title: '现价',
    dataIndex: 'presentPrice',
    key: 'presentPrice',
    align: 'right',
    width: '95px',
  },
  {
    title: '市值',
    dataIndex: 'marketValue',
    key: 'marketValue',
    align: 'right',
    width: '95px',
  },
  {
    title: '盈亏',
    dataIndex: 'profitAndLoss',
    key: 'profitAndLoss',
    align: 'right',
    width: '95px',
  },
  {
    title: '货币类型',
    dataIndex: 'currencyType',
    key: 'currencyType',
    className: 'currencyType',
    width: '105px',
  },
];
//产品实时持仓的表格
const productColumns = [
  {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    className: 'productCode',
    width: '140px',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '200px',
  },
  {
    title: '份额',
    dataIndex: 'share',
    key: 'share',
    width: '140px',
  },
  {
    title: '收益率/净值',
    dataIndex: 'yield',
    key: 'yield',
    width: '140px',
  },
  {
    title: '市值',
    dataIndex: 'marketValue',
    key: 'marketValue',
    align: 'right',
    width: '80px',
  },
  {
    title: '盈亏',
    dataIndex: 'profitAndLoss',
    key: 'profitAndLoss',
    align: 'right',
    width: '160px',
  },
  {
    title: '货币类型',
    dataIndex: 'currencyType',
    key: 'currencyType',
    width: '130px',
    className: 'currencyType'
  },
];
export default class AccountInfoHeader extends PureComponent {
  static PropTypes = {
    dataSource: PropTypes.object.isRequired,
    realTimeAsset: PropTypes.object.isRequired,
    storageOfProduct: PropTypes.object.isRequired,
    getSecuritiesHolding: PropTypes.func.isRequired,
    getRealTimeAsset: PropTypes.func.isRequired,
    getStorageOfProduct: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      // 实时持仓的弹出框
      realTimeHoldModalVisible: false,
      //分页器
      pagination: false,
      //证券默认数据
      bondData: [],
      //产品默认数据
      productDate: [],
      //证券分类数据
      classificationData: {},
      // //默认tab显示的key
      defaultTabKey: 'securitiesHoldings',
    };
  }

  //tab栏切换的回调
  @autobind
  handleTabSwitch(key) {
    this.setState({ defaultTabKey: key });
  }
  // 关闭实时持仓的弹出层
  @autobind
  handleRealTimeHoldModalClose() {
    this.setState({ realTimeHoldModalVisible: false, defaultTabKey: 'securitiesHoldings' });
  }

  // 打开实时持仓的弹出层
  @autobind
  handleRealTimeHoldModalOpen() {
    const { query } = this.props.location;
    this.setState({ realTimeHoldModalVisible: true });
    //进入需要查询下证券实时持仓数据
    this.props.getSecuritiesHolding({
      custId: query && query.custId,
    });
    //进入需要查询下实时资产数据
    this.props.getRealTimeAsset({
      custId: query && query.custId,
    });
    //进入需要查询下产品实时持仓数据
    this.props.getStorageOfProduct({
      custId: query && query.custId,
    });
  }
  //账户类型的筛选
  @autobind
  handleAccountType(e) {
    const newclassificationData = this.setState({ classificationData: e.target.value });
    this.props.getSecuritiesHolding({ newclassificationData });
  }
  render() {
    const {
      realTimeHoldModalVisible,
    } = this.state;
    const { dataSource, realTimeAsset, productDate } = this.props;
    //取出证券持仓的数据
    this.setState({ bondData: dataSource.securitiesHoldings });
    //取出产品持仓的的数据
    this.setState({ productDate: productDate.storageOfProducts });
    //取出实时资产的数据
    const { rtimeAssets, availableFunds, advisableFunds } = realTimeAsset;
    //调用处理实时资产数据的方法
    const rtimeAsset = transformItemUnit(rtimeAssets);
    const availableFund = transformItemUnit(availableFunds);
    const advisableFund = transformItemUnit(advisableFunds);
    const { defaultTabKey } = this.state;
    return (
      <div>
        <Button className={styles.accountHeader}>账户分析</Button>
        <Button className={styles.accountHeader}>资产配置</Button>
        <Button className={styles.accountHeader}>交易流水</Button>
        <Button className={styles.accountHeader}>历史持仓</Button>
        <Button onClick={this.handleRealTimeHoldModalOpen} className={styles.accountHeader}>实时持仓</Button>
        <Modal
          title="实时持仓"
          size="large"
          showOkBtn={false}
          visible={realTimeHoldModalVisible}
          closeModal={this.handleRealTimeHoldModalClose}
          onCancel={this.handleRealTimeHoldModalClose}
          selfBtnGroup={[(<Button onClick={this.handleRealTimeHoldModalClose}>关闭</Button>)]}
          modalKey="realTimeModal"
        >
          <div className={styles.assets}>
            <div className={styles.assetsContainer}>
              <span className={styles.rtimeAsset}>实时资产</span>
              <span className={styles.assetsnewItem}>{rtimeAsset.newItem}{rtimeAsset.newUnit}</span>
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
              activeKey={defaultTabKey}
            >
              <TabPane
                tab="证券实时持仓"
                key="securitiesHoldings">
                <div className={styles.tabDiv}><span className={styles.tabspan}>账户类型：</span>
                  <RadioGroup name="radiogroup" defaultValue="all" onChange={this.handleAccountType}>
                    <Radio value="all">全部</Radio>
                    <Radio value="normal">普通</Radio>
                    <Radio value="credit">信用</Radio>
                  </RadioGroup>
                </div>
                <Table
                  columns={columns}
                  dataSource={this.state.bondData}
                  pagination={this.state.pagination}
                  defaultExpandedRowKeys={this.state.defaultExpandedRowKeys} />

              </TabPane>
              <TabPane tab="产品实时持仓" key="storageOfProducts">
                <Table
                  columns={productColumns}
                  dataSource={this.state.productDate}
                  pagination={this.state.pagination} />
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}


