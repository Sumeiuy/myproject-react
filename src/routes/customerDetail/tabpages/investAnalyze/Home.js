/*
 * @Author: zhangjun
 * @Date: 2018-11-19 15:39:12
 * @Last Modified time: 2018-11-23 20:37:55
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-08 17:15:58
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import AccountTotalState from '../../../../components/customerDetailInvestAnalyze/accountTotalState/AccountTotalState';
import Tabs from '../../../../components/common/innerTab';
import AssetConfigAnalysis from '../../../../components/customerDetailInvestAnalyze/assetConfigAnalysis/AssetConfigAnalysis';
import ProfitAttributionAnalysis from '../../../../components/customerDetailInvestAnalyze/profitAttributionAnalysis/ProfitAttributionAnalysis';
import WindControlAnalysis from '../../../../components/customerDetailInvestAnalyze/windControlAnalysis/WindControlAnalysis';
import logable from '../../../../decorators/logable';
import styles from './home.less';

const TabPane = Tabs.TabPane;

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
    // 获取账户资产变动
    getAssetChangeState: PropTypes.func.isRequired,
    // 账户资产变动
    assetChangeData: PropTypes.object.isRequired,
    // 获取账户资产变动图表
    getAssetChangeReport: PropTypes.func.isRequired,
    // 账户资产变动图表数据
    assetChangeReportData: PropTypes.array.isRequired,
    // 获取账户收益走势图表数据
    getProfitTrendReport: PropTypes.func.isRequired,
    // 账户收益走势图表数据
    profitTrendData: PropTypes.object.isRequired,
    // 获取brinson归因分析
    getAttributionAnalysis: PropTypes.func.isRequired,
    // brinson归因数据
    attributionData: PropTypes.object.isRequired,
    // 获取期末资产配置数据
    getEndTermAssetConfig: PropTypes.func.isRequired,
    // 期末资产配置数据
    endTermAssetConfigData: PropTypes.object.isRequired,
    // 获取资产配置变动走势
    getAssetConfigTrend: PropTypes.func.isRequired,
    // 资产配置变动走势数据
    assetConfigTrendData: PropTypes.object.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { query: { investAbilityTabActiveKey } } = props.location;
    this.state = {
      // 当前激活tab面板的key, 如果query中没有，默认取账户总体情况的key
      activeTabKey: investAbilityTabActiveKey || 'accountTotalState',
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
        investAbilityTabActiveKey: activeTabKey
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
      getAssetChangeState,
      assetChangeData,
      getAssetChangeReport,
      assetChangeReportData,
      getProfitTrendReport,
      profitTrendData,
      getAttributionAnalysis,
      attributionData,
      getEndTermAssetConfig,
      endTermAssetConfigData,
      getAssetConfigTrend,
      assetConfigTrendData,
    } = this.props;
    return (
      <div className={styles.investmentAbilityAnalysis}>
        <Tabs onChange={this.handleChangeTab}>
          <TabPane tab="账户总体情况" key="accountTotalState">
            <AccountTotalState
              location={location}
              profitAbility={profitAbility}
              getProfitAbility={getProfitAbility}
              investmentFeatureLabels={investmentFeatureLabels}
              getInvestmentFeatureLabels={getInvestmentFeatureLabels}
              getAssetChangeState={getAssetChangeState}
              assetChangeData={assetChangeData}
              getAssetChangeReport={getAssetChangeReport}
              assetChangeReportData={assetChangeReportData}
              getProfitTrendReport={getProfitTrendReport}
              profitTrendData={profitTrendData}
            />
          </TabPane>
          <TabPane tab="资产配置分析" key="assetAllocationAnalysis">
            <AssetConfigAnalysis
              location={location}
              getEndTermAssetConfig={getEndTermAssetConfig}
              endTermAssetConfigData={endTermAssetConfigData}
              getAssetConfigTrend={getAssetConfigTrend}
              assetConfigTrendData={assetConfigTrendData}
            />
          </TabPane>
          <TabPane tab="收益归因分析" key="profitAttributionAnalysis">
            <ProfitAttributionAnalysis
              location={location}
              attributionData={attributionData}
              getAttributionAnalysis={getAttributionAnalysis}
            />
          </TabPane>
          <TabPane tab="风控能力分析" key="windControlAnalysis">
            <WindControlAnalysis />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
