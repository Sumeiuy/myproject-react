/*
 * @Author: wangyikai
 * @Date: 2018-10-11 14:05:51
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-06 19:43:47
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import RealTimeHoldingModal from './RealTimeHoldingModal';
import HistoryHoldingModal from './HistoryHoldingModal';
import logable, { logPV } from '../../decorators/logable';

import styles from './accountInfoHeader.less';

export default class AccountInfoHeader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
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
    // 是否有正在执行中的流程
    hasDoingFlow: PropTypes.bool.isRequired,
    // 查询历史持仓明细的api集合函数
    queryHistoryHolding: PropTypes.func.isRequired,
    // 证券历史持仓明细数据
    stockHistoryHolding: PropTypes.object.isRequired,
    // 产品历史持仓明细数据
    productHistoryHolding: PropTypes.object.isRequired,
    // 期权历史持仓明细数据
    optionHistoryHolding: PropTypes.object.isRequired,
  }

  static contextTypes = {
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 实时持仓的弹出框
      realTimeHoldModalVisible: false,
      // 历史持仓弹出层，显示隐藏状态
      historyHoldModalVisible: false,
    };
  }

  // 打开历史持仓的弹出层
  @autobind
  @logPV({ pathname: '/modal/cust360DetailHistoryHoldingModal', title: '历史持仓' })
  handleHistoryHoldingModalOpen() {
    this.setState({ historyHoldModalVisible: true });
  }

  // 关闭历史持仓的弹出层
  @autobind
  @logable({ type: 'Click', payload: { name: '关闭历史持仓'} })
  handleHistoryHoldingModalClose() {
    this.setState({ historyHoldModalVisible: false });
  }

  // 关闭实时持仓的弹出层
  @autobind
  @logable({ type: 'Click', payload: { name: '关闭实时持仓'} })
  handleRealTimeHoldModalClose() {
    this.setState({ realTimeHoldModalVisible: false });
  }
  // 打开实时持仓的弹出层
  @autobind
  @logPV({ pathname: '/modal/cust360DetailRealTimeHoldingModal', title: '实时持仓' })
  handleRealTimeHoldModalOpen() {
    // 实时持仓打开前，有限查询一把实时资产的数据
    const { location: { query: { custId } } } = this.props;
    this.props.getRealTimeAsset({ custId }).then(() => {
      this.setState({ realTimeHoldModalVisible: true });
    });
    //进入需要查询下证券实时持仓数据, 默认查全部
    this.props.getSecuritiesHolding({ custId, accountType: 'all' });
    //进入需要查询下产品实时持仓数据
    this.props.getProductHoldingData({ custId });
  }

  // 跳转到资产配置页面
  @autobind
  handleLinkToAssetAllocation() {
    const { hasDoingFlow, location: { query: { custId = ''} } } = this.props;
    // 新建
    let pathname = '/fsp/implementation/initsee';
    // 新建 url
    let url = `/asset/implementation/wizard/main?routeType=true:new:${custId}`;
    // 有执行中的流程，去列表
    if (hasDoingFlow) {
      pathname = '/fsp/serviceCenter/asset/implementation';
      url = `/asset/implementation/main?customerIdStr=${custId}`;
    }
    this.context.push({
      pathname,
      state: {
        url,
      }
    });
  }

  render() {
    const { realTimeHoldModalVisible, historyHoldModalVisible } = this.state;
    const {
      location,
      securitiesData,
      realTimeAsset,
      productData,
      queryHistoryHolding,
      stockHistoryHolding,
      productHistoryHolding,
      optionHistoryHolding,
      getSecuritiesHolding,
    } = this.props;

    return (
      <div>
        <div className={styles.accountHeaderContainer}>
          <Button className={styles.accountHeader} onClick={this.handleRealTimeHoldModalOpen} >实时持仓</Button>
          <Button className={styles.accountHeader} onClick={this.handleHistoryHoldingModalOpen}>历史持仓</Button>
          <Button className={styles.accountHeader}>交易流水</Button>
          <Button className={styles.accountHeader} onClick={this.handleLinkToAssetAllocation}>资产配置</Button>
          <Button className={styles.accountHeader}>账户分析</Button>
        </div>
        {
          historyHoldModalVisible
            ? (
              <HistoryHoldingModal
                location={location}
                onClose={this.handleHistoryHoldingModalClose}
                queryHistoryHolding={queryHistoryHolding}
                stockHistoryHolding={stockHistoryHolding}
                productHistoryHolding={productHistoryHolding}
                optionHistoryHolding ={optionHistoryHolding}
              />
            )
            : null
        }
        {
          realTimeHoldModalVisible
            ? (
              <RealTimeHoldingModal
                location={location}
                realTimeAsset={realTimeAsset}
                securitiesData={securitiesData}
                productData={productData}
                getSecuritiesHolding={getSecuritiesHolding}
                onClose={this.handleRealTimeHoldModalClose}
              />
            )
            : null
        }
      </div>
    );
  }
}
