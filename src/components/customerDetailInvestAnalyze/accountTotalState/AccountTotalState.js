/*
 * @Author: zhangjun
 * @Date: 2018-11-19 16:37:18
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-07 13:27:14
 * @description 账户总体情况
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import CountPeriod from '../CountPeriod';
import InfoTitle from '../InfoTitle';
import InvestmentFeature from './InvestmentFeature';
import AssetChangeTable from './AssetChangeTable';
import AssetChangeChart from './AssetChangeChart';
import ProfitTrendChart from './ProfitTrendChart';
import {
  SUMMARY,
  COMPUTE_METHOD,
  ACCOUNT_PROFIT_TREND,
  PROFIT_TREND_SUMMARY,
  PROFIT_TREND_COMPUTE_METHOD1,
  PROFIT_TREND_COMPUTE_METHOD2,
} from '../config';
import styles from './accountTotalState.less';

export default class AccountTotalState extends PureComponent {
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
  }

  componentDidMount() {
    // 获取客户盈利能力
    this.getProfitAbility();
    // 获取投资账户特征
    this.getInvestmentFeatureLabels();
    // 获取账户资产变动
    this.getAssetChangeState();
    // 获取账户资产变动图表数据
    this.getAssetChangeReport();
    // 获取账户收益走势图表
    this.getProfitTrendReport();
  }

  // 获取客户盈利能力
  @autobind
  getProfitAbility() {
    const {
      location: {
        query: {
          custId,
        }
      }
    } = this.props;
    this.props.getProfitAbility({ custId });
  }

  // 获取投资账户特征
  @autobind
  getInvestmentFeatureLabels() {
    const {
      location: {
        query: {
          custId,
        }
      }
    } = this.props;
    this.props.getInvestmentFeatureLabels({ custId });
  }

  // 获取账户资产变动
  @autobind
  getAssetChangeState() {
    const {
      location: {
        query: {
          custId,
        }
      }
    } = this.props;
    this.props.getAssetChangeState({ custId });
  }

  // 获取账户资产变动图表数据
  @autobind
  getAssetChangeReport() {
    const {
      location: {
        query: {
          custId,
        }
      }
    } = this.props;
    this.props.getAssetChangeReport({ custId });
  }

  // 获取账户收益走势图表数据
  @autobind
  getProfitTrendReport() {
    const {
      location: {
        query: {
          custId,
        }
      }
    } = this.props;
    this.props.getProfitTrendReport({ custId });
  }

  render() {
    const {
      profitAbility,
      investmentFeatureLabels,
      assetChangeData,
      assetChangeReportData,
      profitTrendData,
    } = this.props;
    return (
      <div className={styles.accountTotalState}>
        <CountPeriod />
        <InfoTitle title="客户投资特征" />
        <InvestmentFeature
          profitAbility={profitAbility}
          investmentFeatureLabels={investmentFeatureLabels}
        />
        <InfoTitle title="客户资产变动情况" />
        <AssetChangeTable
          assetChangeData={assetChangeData}
        />
        <AssetChangeChart
          assetChangeReportData={assetChangeReportData}
        />
        <InfoTitle
          title={ACCOUNT_PROFIT_TREND}
          isNeedTip
          modalTitle={ACCOUNT_PROFIT_TREND}
        >
          <div className={styles.infoContainer}>
            <div className={styles.infoSummary}>
              <div className={styles.name}>{SUMMARY}</div>
              <p className={styles.summary}>
                {PROFIT_TREND_SUMMARY}
              </p>
            </div>
            <div className={styles.infoComputeMethod}>
              <div className={styles.name}>{COMPUTE_METHOD}</div>
              <div className={styles.computeMethod}>
                <p className={styles.computeMethod1}>
                  {PROFIT_TREND_COMPUTE_METHOD1}
                </p>
                <p className={styles.computeMethod2}>{PROFIT_TREND_COMPUTE_METHOD2}</p>
              </div>
            </div>
          </div>
        </InfoTitle>
        <ProfitTrendChart
          profitTrendData={profitTrendData}
        />
      </div>
    );
  }
}
