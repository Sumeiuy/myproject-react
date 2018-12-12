/*
 * @Author: sunweibin
 * @Date: 2018-10-23 10:39:57
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-07 12:47:15
 * @description 新版客户360详情底部概览信息
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import AccountSummary from './AccountSummary';
import AccountDetail from './AccountDetail';
import { ACCOUNT_INFO_TABS } from './config';
import { logCommon } from '../../decorators/logable';

import styles from './accountInfoTabs.less';

const TabPane = Tabs.TabPane;

export default class AccountInfoTabs extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 查询账户概要Tab下的数据
    accountSummary: PropTypes.object.isRequired,
    // 查询账户概要
    queryAccountSummary: PropTypes.func.isRequired,
    // 查询普通账户、信用账户、期权账户
    queryAccountInfo: PropTypes.func.isRequired,
    accountInfo: PropTypes.object.isRequired,
    // 查询业务类别
    queryBusnTypeDict: PropTypes.func.isRequired,
    // 查询账户变动
    queryAccountChange: PropTypes.func.isRequired,
    // 业务类别
    busnTypeDict: PropTypes.object.isRequired,
    // 账户变动
    accountChangeRes: PropTypes.object.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      location: {
        query: { custId: nextId },
      },
    } = nextProps;
    const { custId } = prevState;
    if (nextId !== custId && !_.isEmpty(nextId)) {
      // 如果切换了用户，则需要将Tab切换到账户概览，并且查询下数据
      return {
        custId: nextId,
        activeTabKey: 'accountSummary',
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const {
      location: {
        query: { custId },
      },
    } = props;
    this.state = {
      // 默认激活的Tab，为账户概览
      activeTabKey: 'accountSummary',
      // 保存客户ID
      custId,
    };
  }

  componentDidMount() {
    // 初始化的时候查询账户概览
    this.querySummary();
  }

  componentDidUpdate(prevProps) {
    const { location: { query: { custId: nextId } } } = this.props;
    const { location: { query: { custId: prevId } } } = prevProps;
    if (nextId !== prevId && !_.isEmpty(nextId)) {
      // 如果切换了用户，则需要将Tab切换到账户概览，并且查询下数据
      // state变化移动到getDerivedStateFromProps函数中处理
      this.querySummary();
    }
  }

  // 查询账户概览
  @autobind
  querySummary() {
    const { location: { query: { custId } } } = this.props;
    if (!_.isEmpty(custId)) {
      this.props.queryAccountSummary({ custId });
    }
  }

  // 查询普通账户、信用账户、期权账户信息
  @autobind
  queryAccountInByType(accountType) {
    const { location: { query: { custId } } } = this.props;
    if (!_.isEmpty(custId)) {
      // 查询账户信息
      this.props.queryAccountInfo({
        custId,
        accountType,
      });
    }
    // 每当切换Tab的时候，需要根据不同的账户类型优先查询下其业务类别
    this.queryBusnTypeDictByAccountType(accountType);
  }

  // 需要根据不同的账户类型优先查询下其业务类别
  @autobind
  queryBusnTypeDictByAccountType(accountType) {
    // 因为这个业务类别字典不会改变，所以每一个账户下只需要查询一次
    const { busnTypeDict } = this.props;
    const hasNoCurerntTypeDict = _.isEmpty(_.get(busnTypeDict, _.lowerCase(accountType)));
    if (hasNoCurerntTypeDict) {
      this.props.queryBusnTypeDict({
        accountType: _.lowerCase(accountType),
        queryType: 'accountChange',
      });
    }
  }


  // 查询接口
  @autobind
  queryApiForTab() {
    const { activeTabKey } = this.state;
    if (activeTabKey === 'accountSummary') {
      // 账户概览Tab
      this.querySummary();
    } else if (activeTabKey === 'normalAccount') {
      // 普通账户Tab
      this.queryAccountInByType('Normal');
    } else if (activeTabKey === 'creditAccount') {
      // 信用账户Tab
      this.queryAccountInByType('Credit');
    } else {
      // 期权账户Tab
      this.queryAccountInByType('Option');
    }
  }

  // 切换Tab,并且记录日志，这样主要是由于切换Tab的onChange回调没有返回Tab的名称
  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey }, this.queryApiForTab);
    logCommon({
      type: 'Click',
      payload: {
        name: ACCOUNT_INFO_TABS[activeTabKey],
      },
    });
  }

  render() {
    const {
      accountSummary,
      accountInfo,
      busnTypeDict,
      queryAccountChange,
      accountChangeRes,
      location: { query: { custId } },
    } = this.props;
    const { activeTabKey } = this.state;

    // 普通账户下的资金账户，证券账户,账户变动
    const normalFundAccount = _.get(accountInfo, 'normalAccount.fundAccount');
    const normalStockAccount = _.get(accountInfo, 'normalAccount.stockAccount');
    const normalAccountChange = _.get(accountChangeRes, 'normalAccountChange');
    // 信用账户下的资金账户，证券账户,账户变动
    const creditFundAccount = _.get(accountInfo, 'creditAccount.fundAccount');
    const creditStockAccount = _.get(accountInfo, 'creditAccount.stockAccount');
    const creditAccountChange = _.get(accountChangeRes, 'creditAccountChange');
    // 期权账户下的资金账户，证券账户,账户变动
    const optionFundAccount = _.get(accountInfo, 'optionAccount.fundAccount');
    const optionStockAccount = _.get(accountInfo, 'optionAccount.stockAccount');
    const optionAccountChange = _.get(accountChangeRes, 'optionAccountChange');

    return (
      <div className={styles.tabsContainer}>
        <Tabs type="card" onChange={this.handleTabChange} activeKey={activeTabKey}>
          <TabPane tab="账户概览" key="accountSummary">
            <div className={styles.tabPaneWrap}>
              <AccountSummary data={accountSummary} />
            </div>
          </TabPane>
          <TabPane tab="普通账户" key="normalAccount">
            <div className={styles.tabPaneWrap}>
              <AccountDetail
                type="Normal"
                custId={custId}
                fundAccount={normalFundAccount}
                stockAccount={normalStockAccount}
                busnTypeDict={busnTypeDict.normal || []}
                accountChangeRes={normalAccountChange}
                queryAccountChange={queryAccountChange}
              />
            </div>
          </TabPane>
          <TabPane tab="信用账户" key="creditAccount">
            <div className={styles.tabPaneWrap}>
              <AccountDetail
                type="Credit"
                custId={custId}
                fundAccount={creditFundAccount}
                stockAccount={creditStockAccount}
                busnTypeDict={busnTypeDict.credit || []}
                accountChangeRes={creditAccountChange}
                queryAccountChange={queryAccountChange}
              />
            </div>
          </TabPane>
          <TabPane tab="期权账户" key="optionAccount">
            <div className={styles.tabPaneWrap}>
              <AccountDetail
                type="Option"
                custId={custId}
                fundAccount={optionFundAccount}
                stockAccount={optionStockAccount}
                busnTypeDict={busnTypeDict.option || []}
                accountChangeRes={optionAccountChange}
                queryAccountChange={queryAccountChange}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
