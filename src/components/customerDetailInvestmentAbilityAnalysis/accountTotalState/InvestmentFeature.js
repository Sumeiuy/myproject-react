/*
 * @Author: zhangjun
 * @Date: 2018-11-20 15:28:46
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-21 17:06:26
 * @description 客户投资特征
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import InvestmentFeatureLabel from './InvestmentFeatureLabel';
import ProfitAbilityLevel from './ProfitAbilityLevel';
import styles from './investmentFeature.less';

export default class InvestmentFeature extends PureComponent {
  static propTypes = {
    // 客户盈利能力
    profitAbility: PropTypes.object.isRequired,
    // 投资账户特征
    investmentFeatureLabels: PropTypes.array.isRequired,
  }

  render() {
    const {
      profitAbility: {
        beatCustPercent,
        custAssetStage,
        profitAbilityLevel,
      },
      investmentFeatureLabels,
    } = this.props;
    return (
      <div className={styles.investmentFeature}>
        <div className={styles.profitAbility}>
          <p className={styles.title}>
            盈利能力已击败
          </p>
          <p className={styles.beatCustPercent}>
            {beatCustPercent}
          </p>
          <p className={styles.custAssetStage}>
            同资产段 ({custAssetStage}）客户
          </p>
        </div>
        <div className={styles.profitAbilityLevel}>
          <p className={styles.title}>
            盈利能力等级
          </p>
          <div className={styles.levelWrapper}>
            <ProfitAbilityLevel
              profitAbilityLevel={profitAbilityLevel}
            />
          </div>
        </div>
        <div className={styles.investmentFeatureLabel}>
          <p className={styles.title}>
            投资账户特征
          </p>
          <div className={styles.labelContainer}>
            {
              _.map(investmentFeatureLabels, label => (<InvestmentFeatureLabel key={label.id} labelData={label} />))
            }
          </div>
        </div>
      </div>
    );
  }
}
