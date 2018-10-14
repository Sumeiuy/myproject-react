/*
 * @Author: wangyikai
 * @Date: 2018-10-11 14:05:51
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-10-15 00:40:24
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
    key: 'productCode'
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName'
  },
  {
    title: '持仓数',
    dataIndex: 'holdingNumber',
    key: 'holdingNumber'
  },
  {
    title: '成本',
    dataIndex: 'cost',
    key: 'cost'
  },
  {
    title: '现价',
    dataIndex: 'presentPrice',
    key: 'presentPrice'
  },
  {
    title: '市值',
    dataIndex: 'marketValue',
    key: 'marketValue'
  },
  {
    title: '盈亏',
    dataIndex: 'profitAndLoss',
    key: 'profitAndLoss'
  },
  {
    title: '货币类型',
    dataIndex: 'currencyType',
    key: 'currencyType'
  },
];
//产品实时持仓的表格
const productColumns = [
  {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode'
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName'
  },
  {
    title: '份额',
    dataIndex: 'share',
    key: 'share'
  },
  {
    title: '收益率/净值',
    dataIndex: 'yield',
    key: 'yield'
  },
  {
    title: '市值',
    dataIndex: 'marketValue',
    key: 'marketValue'
  },
  {
    title: '盈亏',
    dataIndex: 'profitAndLoss',
    key: 'profitAndLoss'
  },
  {
    title: '货币类型',
    dataIndex: 'currencyType',
    key: 'currencyType'
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
  }
  constructor(props) {
    super(props);
    this.state = {
      // 实时持仓的弹出框
      realTimeHoldModalVisible: false,
      bondData:[],
      productDate:[],
    };
  }
   //账户类型的筛选
   @autobind
   handleAccountType(){
    // console.log(111);
   }
  componentDidMount() {
    //进入需要查询下证券实时持仓数据
    this.props.getSecuritiesHolding();
    //进入需要查询下实时资产数据
    this.props.getRealTimeAsset();
    //进入需要查询下产品实时持仓数据
    this.props.getStorageOfProduct();
    //账户类型的筛选
    this.handleAccountType();
  }
  //tab栏切换的回调
  @autobind
  handleTabSwitch(key) {
    // console.log(key);
  }
  // 关闭实时持仓的弹出层
  @autobind
  handleRealTimeHoldModalClose() {
    this.setState({ realTimeHoldModalVisible: false });
  }

  // 打开实时持仓的弹出层
  @autobind
  handleRealTimeHoldModalOpen() {
    this.setState({ realTimeHoldModalVisible: true });
  }
  render() {
    const {
      realTimeHoldModalVisible,
    } = this.state;
    const { dataSource, realTimeAsset, productDate } = this.props;
    //取出证券持仓的数据
    this.setState({bondData:dataSource.securitiesHoldings});
    //取出产品持仓的的数据
    this.setState({productDate:productDate.storageOfProducts});
   //取出实时资产的数据
   const {rtimeAssets, availableFunds, advisableFunds} = realTimeAsset;
    //调用处理实时资产数据的方法
  const rtimeAsset = transformItemUnit(rtimeAssets);
  const availableFund = transformItemUnit(availableFunds);
  const advisableFund = transformItemUnit(advisableFunds);
    return (
      <div>
        <Button className={styles.topRight}>账户分析</Button>
        <Button className={styles.topRight}>资产配置</Button>
        <Button className={styles.topRight}>交易流水</Button>
        <Button className={styles.topRight}>历史持仓</Button>
        <Button onClick={this.handleRealTimeHoldModalOpen} className={styles.topRight}>实时持仓</Button>
        <Modal
          title="实时持仓"
          size="large"
          visible={realTimeHoldModalVisible}
          closeModal={this.handleRealTimeHoldModalClose}
          onOk={this.handleRealTimeHoldModalClose}
          onCancel={this.handleRealTimeHoldModalClose}
          selfBtnGroup={[]}
          modalKey="realTimeModal"
        >
          <div className={styles.assets}>
            <div className={styles.assstsCenter}>
              <span className={styles.titleone}>实时资产{rtimeAsset.newItem}{rtimeAsset.newUnit}</span>
              <span className={styles.titletwo}>可用资金{availableFund.newItem}{availableFund.newUnit}</span>
              <span className={styles.titlethree}>可取资金{advisableFund.newItem}{advisableFund.newUnit}</span>
            </div>
          </div>
          <div className={styles.tabContainer}>
            <Tabs defaultActiveKey="securitiesHoldings"
              onChange={this.handleTabSwitch}
              animated={false}
            >
              <TabPane tab="证券实时持仓" key="securitiesHoldings" className={styles.firstTabTitle}>
                <div><span>账户类型：</span>
                  <RadioGroup name="radiogroup" defaultValue={1}>
                    <Radio value={1}>全部</Radio>
                    <Radio value={2}>普通</Radio>
                    <Radio value={3}>信用</Radio>
                  </RadioGroup>
                </div>
                <Table columns={columns} dataSource={this.state.bondData}/>

              </TabPane>
              <TabPane tab="产品实时持仓" key="storageOfProducts"
                className={styles.secondTabTitle}
              >
              <Table columns={productColumns} dataSource={this.state.productDate}/>
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}


