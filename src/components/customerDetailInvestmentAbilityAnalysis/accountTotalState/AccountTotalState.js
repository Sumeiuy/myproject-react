/*
 * @Author: zhangjun
 * @Date: 2018-11-19 16:37:18
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-21 17:06:16
 * @description 账户总体情况
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import CountPeriod from '../CountPeriod';
import InfoTitle from '../InfoTitle';
import InvestmentFeature from './InvestmentFeature';
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
  }

  componentDidMount() {
    // 获取客户盈利能力
    this.getProfitAbility();
    // 获取投资账户特征
    this.getInvestmentFeatureLabels();
  }

  // 获取客户盈利能力
  @autobind
  getProfitAbility() {
    const { location: { query: { custId } } } = this.props;
    this.props.getProfitAbility({ custId });
  }

  // 获取投资账户特征
  @autobind
  getInvestmentFeatureLabels() {
    const { location: { query: { custId } } } = this.props;
    this.props.getInvestmentFeatureLabels({ custId });
  }


  render() {
    const {
      profitAbility,
      investmentFeatureLabels,
    } = this.props;
    return (
      <div className={styles.accountTotalState}>
        <CountPeriod />
        <InfoTitle title="客户投资特征"/>
        <InvestmentFeature
          profitAbility={profitAbility}
          investmentFeatureLabels={investmentFeatureLabels}
        />
      </div>
    );
  }
}
