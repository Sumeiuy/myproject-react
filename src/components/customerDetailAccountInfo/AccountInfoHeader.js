/*
 * @Author: wangyikai
 * @Date: 2018-10-11 14:05:51
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-10-12 11:41:21
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Button, Tabs, Radio,Table } from 'antd';
import Modal from '../../components/common/biz/CommonModal';

import style from './accountInfoHeader.less';
//tab栏
const TabPane = Tabs.TabPane;
//单选框
const RadioGroup = Radio.Group;
//实时持仓表格
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
export default class AccountInfoHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 实时持仓的弹出框
      realTimeHoldModalVisible: false,
    };
  }
  //tab栏切换的回调
  @autobind
  callback(key) {
    console.log(key);
  }
  // 关闭实时持仓的弹出层
  @autobind
  handlerRealTimeHoldModalClose() {
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

    return (
      <div>
        <Button className={style.topRight}>账户分析</Button>
        <Button className={style.topRight}>资产配置</Button>
        <Button className={style.topRight}>交易流水</Button>
        <Button className={style.topRight}>历史持仓</Button>
        <Button onClick={this.handleRealTimeHoldModalOpen} className={style.topRight}>实时持仓</Button>
        <Modal
          title="实时持仓"
          size="large"
          visible={realTimeHoldModalVisible}
          closeModal={this.handlerRealTimeHoldModalClose}
          onOk={this.handlerRealTimeHoldModalClose}
          onCancel={this.handlerRealTimeHoldModalClose}
          selfBtnGroup={[]}
        >
          <div className={style.assets}>
            <div className={style.assstsCenter}>
              <span className={style.titleone}>实时资产</span>
              <span className={style.titleone}>万元</span>
              <span className={style.titletwo}>可用资金 万元</span>
              <span className={style.titlethree}>可取资金 万元</span>
            </div>
          </div>
          <div className={style.tabContainer}>
            <Tabs defaultActiveKey="securitiesHoldings"
              onChange={this.callback}
              animated={false}
            >
              <TabPane tab="证券实时持仓" key="securitiesHoldings" className={style.firstTabTitle}>
                <div><span>账户类型：</span>
                  <RadioGroup name="radiogroup" defaultValue={1}>
                    <Radio value={1}>全部</Radio>
                    <Radio value={2}>普通</Radio>
                    <Radio value={3}>信用</Radio>
                  </RadioGroup>
                </div>

                {/* <Table columns={columns} dataSource={data} /> */}

              </TabPane>
              <TabPane tab="产品实时持仓" key="storageOfProducts"
                className={style.secondTabTitle}
              >Content of Tab Pane 2</TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}


