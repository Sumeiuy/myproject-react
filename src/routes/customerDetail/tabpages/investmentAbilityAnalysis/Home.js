/*
 * @Author: zhangjun
 * @Date: 2018-11-19 15:39:12
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-22 09:30:10
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { Tabs } from 'antd';

import { dva } from '../../../../helper';
import withRouter from '../../../../decorators/withRouter';
import AccountTotalState from '../../../../components/customerDetailInvestmentAbilityAnalysis/accountTotalState/AccountTotalState';
import logable from '../../../../decorators/logable';

import styles from './home.less';

const TabPane = Tabs.TabPane;
// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;

const effects = {
  // 获取客户盈利能力
  getProfitAbility: 'detailInvestmentAbilityAnalysis/getProfitAbility',
  // 获取投资账户特征
  getInvestmentFeatureLabels: 'detailInvestmentAbilityAnalysis/getInvestmentFeatureLabels',
};

const mapStateToProps = state => ({
  // 客户盈利能力
  profitAbility: state.detailInvestmentAbilityAnalysis.profitAbility,
  // 投资账户特征
  investmentFeatureLabels: state.detailInvestmentAbilityAnalysis.investmentFeatureLabels,
});

const mapDispatchToProps = {
  // 获取客户盈利能力
  getProfitAbility: effect(effects.getProfitAbility, { forceFull: true }),
  // 获取投资账户特征
  getInvestmentFeatureLabels: effect(effects.getInvestmentFeatureLabels, { forceFull: true }),
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Home extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 客户盈利能力
    profitAbility: PropTypes.object.isRequired,
    // 获取客户盈利能力
    getProfitAbility: PropTypes.func.isRequired,
    // 投资账户特征
    investmentFeatureLabels: PropTypes.array.isRequired,
    // 获取投资账户特征
    getInvestmentFeatureLabels: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { query: { investmentAbilityTabActiveKey } } = props.location;
    this.state = {
      // 当前激活tab面板的key, 如果query中没有，默认取账户总体情况的key
      activeTabKey: investmentAbilityTabActiveKey ? investmentAbilityTabActiveKey : 'accountTotalState',
    };
  }

  // 切换tab
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '投资能力分析TAB切换',
      value: '$args[0]',
    },
  })
  handleChangeTab(activeTabKey) {
    this.setState({ activeTabKey }, this.replaceActiveTabKey);
  }

  // 替换location中activeTabKey值
  @autobind
  replaceActiveTabKey() {
    const { location: { query } } = this.props;
    const { activeTabKey } = this.state;
    this.context.replace({
      query: {
        ...query,
        investmentAbilityTabActiveKey: activeTabKey
      }
    });
  }

  render() {
    const {
      location,
      profitAbility,
      getProfitAbility,
      investmentFeatureLabels,
      getInvestmentFeatureLabels,
    } = this.props;
    return (
      <div className={styles.investmentAbilityAnalysis}>
        <Tabs type="card" onChange={this.handleChangeTab}>
          <TabPane tab="账户总体情况" key="accountTotalState">
            <AccountTotalState
              location={location}
              profitAbility={profitAbility}
              getProfitAbility={getProfitAbility}
              investmentFeatureLabels={investmentFeatureLabels}
              getInvestmentFeatureLabels={getInvestmentFeatureLabels}
            />
          </TabPane>
          <TabPane tab="资产配置分析" key="assetAllocationAnalysis">资产配置分析</TabPane>
          <TabPane tab="收益归因分析" key="incomeAttributionAnalysis">收益归因分析</TabPane>
          <TabPane tab="风控能力分析" key="windControlAbilityAnalysis">风控能力分析</TabPane>
        </Tabs>
      </div>
    );
  }
}
